const fs = require('fs') // nokdejs 文件模块
const path = require('path') // path 模块提供了一些用于处理文件路径的小工具
const zlib = require('zlib') // nodejs 资源压缩模块
const rollup = require('rollup')// JavaScript模块打包器
const uglify = require('uglify-js') // 压缩代码的工具

// 检测dist路径是否存在，如果不存在创建dist文件夹
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

// 拿到要构建的所有配置项
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
/**
 * process.argv[2]是npm run build时传入的参数；例如：npm run build:ssr
 * "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer"
 * process.argv[2] = web-runtime-cjs,web-server-renderer
 */
// 判断 npm run build 是否传入参数
if (process.argv[2]) {
  // 按照‘，’将参数转换为数组
  const filters = process.argv[2].split(',')

  builds = builds.filter(b => {
    return filters.some(f => {
      console.log(f)
      return b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1
    })
  })
  console.log(builds)
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      if (isProd) {
        var minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
