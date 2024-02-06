import fs from 'fs-extra';

/**
 * 检查目录是否为空
 *
 * @param dir 目录路径
 * @returns 返回目录是否为空
 */
export async function checkEmpty(dir: string): Promise<boolean> {
  let files: string[] = fs.readdirSync(dir);
  files = files.filter((filename) => {
    return ['node_modules', '.git', '.DS_Store', '.iceworks-tmp', 'build', '.bzbconfig'].indexOf(filename) === -1;
  });
  if (files.length && files.length > 0) {
    return false;
  } else {
    return true;
  }
}
