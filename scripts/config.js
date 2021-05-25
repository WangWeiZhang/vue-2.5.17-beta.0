const path = require('path') // path 模块提供了一些用于处理文件路径的小工具
const buble = require('rollup-plugin-buble') // rollup是一个汇总插件，可使用Bublé编译器转换ES2015 +代码
const alias = require('rollup-plugin-alias') // 提供 modules（模块）名称的 alias（别名）和 reslove（解析）功能.
const cjs = require('rollup-plugin-commonjs') // 转换 CJS -> ESM, 通常配合rollup-plugin-node-resolve插件使用
const replace = require('rollup-plugin-replace') // 类比 Webpack 的 DefinePlugin , 可在源码中通过 process.env.NODE_ENV 用于构建区分 Development 与 Production 环境.
const node = require('rollup-plugin-node-resolve') // 解析 node_modules 中的模块
const flow = require('rollup-plugin-flow-no-whitespace')
const version = process.env.VERSION || require('../package.json').version
const weexVersion = process.env.WEEX_VERSION || require('../packages/weex-vue-framework/package.json').version
// 定义头部注释模版
const banner =
  '/*!\n' +
  ' * Vue.js v' + version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' Evan You\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const weexFactoryPlugin = {
  intro () {
    return 'module.exports = function weexFactory (exports, document) {'
  },
  outro () {
    return '}'
  }
}
// 引入alias， alial.js: 对文件路径做了一层映射，映射成简单的key值。
const aliases = require('./alias')
console.log(aliases)

// 获取文件完整路径（根据传入文件路径的第一层和aliases的key做匹配，返回对应文件的完整路径）
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    console.log('resolve, alias中包含的', path.resolve(aliases[base], p.slice(base.length + 1)))
    // aliases中如果包含解析出的key，就将映射到的路径 + 解析出得路径，返回文件完整路径
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    console.log('resolve, alias不包含的', path.resolve(__dirname, '../', p))
    // aliases中如果不包含解析出的key，就将当前路径的上一层 + 传入路径拼接，返回完整路径。
    return path.resolve(__dirname, '../', p)
  }
}

// 不同版本的vuejs的配置
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    // 编译前入口文件路径，最后编译出dest出口文件
    entry: resolve('web/entry-runtime.js'),
    // 编译后的出口文件路径
    dest: resolve('dist/vue.runtime.common.js'),
    // 构建出来的文件格式
    format: 'cjs',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // Web compiler (CommonJS).
  'web-compiler': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-template-compiler/package.json').dependencies)
  },
  // Web compiler (UMD for in-browser use).
  'web-compiler-browser': {
    entry: resolve('web/entry-compiler.js'),
    dest: resolve('packages/vue-template-compiler/browser.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'VueTemplateCompiler',
    plugins: [node(), cjs()]
  },
  // Web server renderer (CommonJS).
  'web-server-renderer': {
    entry: resolve('web/entry-server-renderer.js'),
    dest: resolve('packages/vue-server-renderer/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-basic': {
    entry: resolve('web/entry-server-basic-renderer.js'),
    dest: resolve('packages/vue-server-renderer/basic.js'),
    format: 'umd',
    env: 'development',
    moduleName: 'renderVueComponentToString',
    plugins: [node(), cjs()]
  },
  'web-server-renderer-webpack-server-plugin': {
    entry: resolve('server/webpack-plugin/server.js'),
    dest: resolve('packages/vue-server-renderer/server-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  'web-server-renderer-webpack-client-plugin': {
    entry: resolve('server/webpack-plugin/client.js'),
    dest: resolve('packages/vue-server-renderer/client-plugin.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/vue-server-renderer/package.json').dependencies)
  },
  // Weex runtime factory
  'weex-factory': {
    weex: true,
    entry: resolve('weex/entry-runtime-factory.js'),
    dest: resolve('packages/weex-vue-framework/factory.js'),
    format: 'cjs',
    plugins: [weexFactoryPlugin]
  },
  // Weex runtime framework (CommonJS).
  'weex-framework': {
    weex: true,
    entry: resolve('weex/entry-framework.js'),
    dest: resolve('packages/weex-vue-framework/index.js'),
    format: 'cjs'
  },
  // Weex compiler (CommonJS). Used by Weex's Webpack loader.
  'weex-compiler': {
    weex: true,
    entry: resolve('weex/entry-compiler.js'),
    dest: resolve('packages/weex-template-compiler/build.js'),
    format: 'cjs',
    external: Object.keys(require('../packages/weex-template-compiler/package.json').dependencies)
  }
}

// 封装rollup需要的数据格式，最终返回
function genConfig (name) {
  // 指定build中
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      replace({
        __WEEX__: !!opts.weex,
        __WEEX_VERSION__: weexVersion,
        __VERSION__: version
      }),
      flow(),
      buble(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    }
  }
  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}
console.log('process.env.TARGET:', process.env.TARGET)

// 区分是本地运行还是构建源码
if (process.env.TARGET) {
  // 本地运行
  module.exports = genConfig(process.env.TARGET)
} else {
  // 暂时没用到getBuild
  exports.getBuild = genConfig
  // 构建源码，将builds对象中的所有key查找到，一次调用genConfig处理成rollup最终需要的格式
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
