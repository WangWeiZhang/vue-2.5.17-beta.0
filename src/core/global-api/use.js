/*
 * @Description: 初始化，Vue use全局API
 * @Author: wangwz10@lenovo.com
 * @LastEditors: wangwz10@lenovo.com
 * @Date: 2021-06-06 15:54:26
 * @LastEditTime: 2021-06-06 17:47:42
 * @FilePath: \vue-2.5.17-beta.0\src\core\global-api\use.js
 */
/* @flow */

import { toArray } from '../util/index'

// initUse创建了一个Vue.use的全局API
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
