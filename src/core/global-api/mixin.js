/*
 * @Description: 定义了一个全局的mixin方法
 * @Author: wangwz10@lenovo.com
 * @LastEditors: wangwz10@lenovo.com
 * @Date: 2021-06-06 15:54:26
 * @LastEditTime: 2021-06-06 17:49:03
 * @FilePath: \vue-2.5.17-beta.0\src\core\global-api\mixin.js
 */
/* @flow */

import { mergeOptions } from '../util/index'

// 定义了一个全局的Vue的mixin方法
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
