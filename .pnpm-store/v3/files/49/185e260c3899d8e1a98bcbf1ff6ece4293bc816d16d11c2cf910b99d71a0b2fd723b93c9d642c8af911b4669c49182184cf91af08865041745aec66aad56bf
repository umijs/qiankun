"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var outdent = require("outdent");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var outdent__default = _interopDefault(outdent);

const getAddMessage = async (changeset, options) => {
  const skipCI = "add" === (null == options ? void 0 : options.skipCI) || !0 === (null == options ? void 0 : options.skipCI);
  return outdent__default.default`docs(changeset): ${changeset.summary}${skipCI ? "\n\n[skip ci]\n" : ""}`;
}, getVersionMessage = async (releasePlan, options) => {
  const skipCI = "version" === (null == options ? void 0 : options.skipCI) || !0 === (null == options ? void 0 : options.skipCI), publishableReleases = releasePlan.releases.filter((release => "none" !== release.type)), numPackagesReleased = publishableReleases.length, releasesLines = publishableReleases.map((release => `  ${release.name}@${release.newVersion}`)).join("\n");
  return outdent__default.default`
    RELEASING: Releasing ${numPackagesReleased} package(s)

    Releases:
    ${releasesLines}
    ${skipCI ? "\n[skip ci]\n" : ""}
`;
}, defaultCommitFunctions = {
  getAddMessage: getAddMessage,
  getVersionMessage: getVersionMessage
};

exports.default = defaultCommitFunctions;
