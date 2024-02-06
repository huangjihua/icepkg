import fse from 'fs-extra';
import * as path from 'path';

/**
 * If we create a sub package in monorepo workspace, we need to delete some files and content which don't need.
 */
/**
 * 删除指定目录下的所有文件以及清除 package.json 中的字段
 *
 * @param dir 目录路径
 * @returns 返回一个 Promise 对象，用于异步执行
 */
export default async function removeFilesAndContent(dir: string) {
  await removeFiles(dir);
  await deleteFieldsInPkgJSON(dir);
}

const uselessFiles: string[] = [
  '.gitignore',

  '.eslintrc.cjs',
  '.eslintrc.js',
  '.eslintrc',
  '.eslintignore',

  '.stylelintrc.js',
  '.stylelintrc.cjs',
  '.stylelintrc',
  '.stylelintignore',

  'abc.json',
];
/**
 * 删除指定目录下的无用文件
 *
 * @param dir 目标目录路径
 * @returns 无返回值
 */
async function removeFiles(dir: string) {
  for (const file of uselessFiles) {
    const filePath = path.join(dir, file);
    if (await fse.pathExists(filePath)) {
      await fse.remove(filePath);
    }
  }
}

const uselessFields: Record<string, string[]> = {
  scripts: ['eslint', 'eslint:fix', 'stylelint', 'stylelint:fix', 'lint'],
  devDependencies: ['stylelint', 'eslint', '@applint/spec'],
};
/**
 * 从指定目录下的 package.json 文件中删除无用字段
 *
 * @param dir 目录路径
 * @returns 无返回值
 */
async function deleteFieldsInPkgJSON(dir: string) {
  const pkgJSONPath = path.join(dir, 'package.json');
  const pkgJSON = await fse.readJSON(pkgJSONPath);
  Object
    .entries(uselessFields)
    .forEach(([field, properties]) => {
      properties.forEach((property) => {
        delete pkgJSON[field][property];
      });
    });
  await fse.writeJSON(pkgJSONPath, pkgJSON, { spaces: 2 });
}
