/**
 * 提供一个对象，是key对应到真实路径的关系。
 */

const path = require('path')
// path.resolve是nodejs提供的路径解析的方法
const resolve = p => path.resolve(__dirname, '../', p)

// src下不同文件的路径映射
module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  entries: resolve('src/entries'),
  sfc: resolve('src/sfc')
}
