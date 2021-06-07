/*
 * @Description: 创建 ASSET_TYPES 模块下的具体方法
 * @Author: wangwz10@lenovo.com
 * @LastEditors: wangwz10@lenovo.com
 * @Date: 2021-06-06 15:54:26
 * @LastEditTime: 2021-06-06 17:51:32
 * @FilePath: \vue-2.5.17-beta.0\src\core\global-api\assets.js
 */
/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

// 创建 ASSET_TYPES 下的具体方法
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
