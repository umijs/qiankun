/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import got from 'got';
import * as jsonwebtoken from 'jsonwebtoken';

/**
 * Configuration data needed to create a GitHub Check.
 *
 * GitHub Checks are attached to a particular commit in a particular repo, and
 * are created by GitHub Apps, which are installed into an org or repo.
 *
 * More info at https://developer.github.com/v3/apps/
 *
 * Note that we do not currently manage a generally-accessible GitHub App. We
 * only support a fully self-service integration, whereby users are expected to
 * create their own GitHub App, install it to their repos, grant full power to
 * this binary to act as that App via a private key, and then piggyback on e.g.
 * Travis CI to actually run the benchmarks. This avoids the need to run any
 * services for the time being, but still lets us have our own standalone Check
 * tab in the GitHub UI.
 */
export interface CheckConfig {
  label: string;
  appId: number;
  installationId: number;
  repo: string;
  commit: string;
}

/**
 * Parse the --github-check flag.
 */
export function parseGithubCheckFlag(flag: string): CheckConfig {
  const parsed = JSON.parse(flag) as Partial<CheckConfig>;
  if (
    !parsed.appId ||
    !parsed.installationId ||
    !parsed.repo ||
    !parsed.commit
  ) {
    throw new Error(
      `Invalid --github-check flag. Must be a JSON object ` +
        `with properties: appId, installationId, repo, and commit.`
    );
  }
  return {
    label: String(parsed.label || 'Tachometer Benchmarks'),
    appId: Number(parsed.appId),
    installationId: Number(parsed.installationId),
    repo: String(parsed.repo),
    commit: String(parsed.commit),
  };
}

/**
 * Create a pending GitHub check object and return a function that will mark
 * the check completed with the given markdown.
 */
export async function createCheck(
  config: CheckConfig
): Promise<(markdown: string) => void> {
  const {label, appId, installationId, repo, commit} = config;

  // We can directly store our GitHub App private key as a secret Travis
  // environment variable (as opposed to committing it as a file and
  // configuring to Travis decrypt it), but we have to be careful with the
  // spaces and newlines that PEM files have, since Travis does a raw Bash
  // substitution when it sets the variable.
  //
  // Given a PEM file from GitHub, the following command will escape spaces
  // and newlines so that it can be safely pasted into the Travis UI. The
  // spaces will get unescaped by Bash, and we'll unescape newlines ourselves.
  //
  //     cat <GITHUB_PEM_FILE>.pem \
  //         | awk '{printf "%s\\\\n", $0}' | sed 's/ /\\ /g'
  const appPrivateKey = (process.env.GITHUB_APP_PRIVATE_KEY || '')
    .trim()
    .replace(/\\n/g, '\n');
  if (appPrivateKey === '') {
    throw new Error(
      'Missing or empty GITHUB_APP_PRIVATE_KEY environment variable, ' +
        'which is required when using --github-check.'
    );
  }
  const appToken = getAppToken(appId, appPrivateKey);
  const installationToken = await getInstallationToken({
    installationId,
    appToken,
  });

  // Create the initial Check Run run now, so that it will show up in the
  // GitHub UI as pending.
  const checkId = await createCheckRun({
    label,
    repo,
    commit,
    installationToken,
  });

  return (markdown: string) =>
    completeCheckRun({label, repo, installationToken, checkId, markdown});
}

/**
 * Create a JSON Web Token (https://tools.ietf.org/html/rfc7519), which allows
 * us to perform actions as a GitHub App.
 *
 * @param appId GitHub App ID. Can be found on the GitHub App settings page.
 * @param privateKey Text of a PEM private key. Can be generated from the GitHub
 *     App settings page. More info at
 *     https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/
 */
function getAppToken(appId: number, privateKey: string): string {
  const expireMinutes = 10;
  const issuedTimestamp = Math.floor(Date.now() / 1000);
  const expireTimestamp = issuedTimestamp + expireMinutes * 60;
  const payload = {
    iss: appId, // (iss)uer
    iat: issuedTimestamp, // (i)ssued (at)
    exp: expireTimestamp, // (exp)iration time
  };
  return jsonwebtoken.sign(payload, privateKey, {algorithm: 'RS256'});
}

/**
 * Create an access token which allows us to perform actions as a GitHub App
 * Installation.
 */
async function getInstallationToken({
  installationId,
  appToken,
}: {
  installationId: number;
  appToken: string;
}): Promise<string> {
  const resp = await got.post(
    `https://api.github.com/installations/${installationId}/access_tokens`,
    {
      headers: {
        Accept: 'application/vnd.github.machine-man-preview+json',
        Authorization: `Bearer ${appToken}`,
      },
    }
  );
  const data = JSON.parse(resp.body) as {token: string};
  return data.token;
}

/**
 * Create a new GitHub Check Run (a single invocation of a Check on some commit)
 * and return its identifier.
 */
async function createCheckRun({
  label,
  repo,
  commit,
  installationToken,
}: {
  label: string;
  repo: string;
  commit: string;
  installationToken: string;
}): Promise<string> {
  const resp = await got.post(
    `https://api.github.com/repos/${repo}/check-runs`,
    {
      headers: {
        Accept: 'application/vnd.github.antiope-preview+json',
        Authorization: `Bearer ${installationToken}`,
      },
      // https://developer.github.com/v3/checks/runs/#parameters
      body: JSON.stringify({
        head_sha: commit,
        name: label,
      }),
    }
  );
  const data = JSON.parse(resp.body) as {id: string};
  return data.id;
}

/**
 * Update a GitHub Check run with the given markdown text and mark it as
 * complete.
 */
async function completeCheckRun({
  label,
  repo,
  installationToken,
  checkId,
  markdown,
}: {
  label: string;
  repo: string;
  checkId: string;
  markdown: string;
  installationToken: string;
}) {
  await got.patch(
    `https://api.github.com/repos/${repo}/check-runs/${checkId}`,
    {
      headers: {
        Accept: 'application/vnd.github.antiope-preview+json',
        Authorization: `Bearer ${installationToken}`,
      },
      // https://developer.github.com/v3/checks/runs/#parameters-1
      body: JSON.stringify({
        name: label,
        completed_at: new Date().toISOString(),
        // Note that in the future we will likely want to be able to report
        // a failing check (e.g. if there appears to be a difference greater
        // than some threshold).
        conclusion: 'neutral',
        output: {
          title: label,
          summary: 'Benchmark results',
          text: markdown,
        },
      }),
    }
  );
}
