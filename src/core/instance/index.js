/*
 * @Description: Vue根文件
 * @Author: wangwz10@lenovo.com
 * @LastEditors: wangwz10@lenovo.com
 * @Date: 2021-06-06 15:54:26
 * @LastEditTime: 2021-06-06 15:55:13
 * @FilePath: \vue-2.5.17-beta.0\src\core\instance\index.js
 */
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue构造函数
function Vue (options) {
  // 检测当前用户初始化Vue对象是否使用new操作符，如果没有则报出警告
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 
  this._init(options)
}

// 调用mixin方法，每个mixin方法中都是往Vue的原型对象上挂载了一部分方法（mixin实现了Vue的原型上挂载方法的一部分）
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue

/**
 * 为什么不用es6来实现类的定义，而选择使用es5来实现？
 *    因为es6比较难写，而es5可以使用prototype上绑定好多对象和方法。并且可以把方法和对象拆分到不同的文件下，方便代码的管理，不用在一个大文件下，把所有部分都定义在一块。
 * 方便代码的管理与维护。
 * 
 * 总结：所以Vue本身就是一个函数，是用函数实现的一个类，类上挂载了很多原型和方法
 */

// 全局方法，定义在/core/global-api/
