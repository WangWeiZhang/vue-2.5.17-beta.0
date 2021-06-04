/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }

  // 向Vue的config属性上，定义了configDef
  Object.defineProperty(Vue, 'config', configDef)

  // 暴露的 util 方法。
  // 注意：这些不被视为公共 API 的一部分 - 避免依赖
  // 除非您意识到风险。
  // 定义了一个util的方法，最好不要用，因为内部方法实现不稳定，有一定风险，有可能随着版本的变化会变
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
  // 定义 set delete nextick 方法
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 将Vue下的option属性设置成一个原型为null的对象
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    // 创建一个原型为null的对象，将其分别赋值给遍历到的要定义的方法。
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
