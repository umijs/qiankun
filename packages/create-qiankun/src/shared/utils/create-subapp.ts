
import fse from 'fs-extra';
import path, { join } from 'node:path';
import { bold } from 'kolorist';
import type { RenderOptions } from '../..';

interface PkgInfo {
  name: string,
  version: string,
  description?: string,
  author?: string,
  email?: string,
  qiankun: {
    port: number
  }
}

export default async function clientPackagesInfo (dirname: string) {
  const list: PkgInfo[] = []
  const dir = await fse.opendir(join(dirname, 'packages'))
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      const pkgPath = join(dirname, 'packages', dirent.name, 'package.json')
      const pkgFile = await fse.readFile(pkgPath, { encoding: 'utf-8' })
      const pkgJson = JSON.parse(pkgFile) as PkgInfo
      if (pkgJson.qiankun) {
        list.push(pkgJson)
      }
    }
  }
  return list
}

function getTemplatePath(appName: string) {
  return join(process.cwd(), 'template', appName)
}

export async function createSubApp (options: RenderOptions) {
  const { projectRoot, userChoose } = options
  const { subAppName } = userChoose

  const templatePath = join(process.cwd(), 'template', subAppName as string)
  const targetPath = projectRoot

  await fse.copy(templatePath, targetPath)
  return true
}

export async function createSubAppInMono (options: RenderOptions) {
  const { projectRoot, userChoose } = options
  const { subAppName } = userChoose

  const pkgList = await clientPackagesInfo(projectRoot)
  const maxPort = Math.max.apply(null, pkgList.map(item => item.qiankun.port))

  let i = 1
  for (const appName of subAppName || []) {
    console.log(`create ${bold(appName)}`)
    const templatePath = getTemplatePath(appName)
    const targetPath = join(projectRoot, 'packages', appName)

    await fse.copy(templatePath, targetPath)

    const packageJsonPath = path.join(targetPath, 'package.json')
    const data = await fse.readFile(packageJsonPath, { encoding: 'utf-8' })

    const pkgJson = JSON.parse(String(data)) as { [key: string]: unknown }
    pkgJson.qiankun = {
      port: isFinite(maxPort) ? maxPort + i++ : 9001,
    }

    await fse.writeFile(packageJsonPath, JSON.stringify(pkgJson, null, 2))
  }
  return true
}
