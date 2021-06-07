/*
 * @Description: Type your file description
 * @Author: Type your email address
 * @LastEditors: wangwz10@lenovo.com
 * @Date: 2021-06-06 15:54:26
 * @LastEditTime: 2021-06-06 17:35:13
 * @FilePath: \vue-2.5.17-beta.0\src\core\index.js
 */
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

// 初始化全局API
initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
