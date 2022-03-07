const path = require('path')
// const argv = require('minimist')(process.argv.slice(2))
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const { MAIN_TITLE } = require('./src/setting.js')

// 用于pathrewrite，这样可以在setting文件统一设置接口前缀
const prefixReg = '^' + process.env.VUE_APP_PROXY_PREFIX
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist', // TODO: 修改为项目名称，便于打包构建
  lintOnSave: 'warning', // 每次保存时检测lint，并输出为warning
  filenameHashing: true, // 文件名哈希值
  productionSourceMap: false, // 生产环境不需要sourcemap可以设置为false
  css: {
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
        plugins: [require('autoprefixer')]
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/styles/_variables.less')]
    }
  },
  configureWebpack: config => {
    if (process.env.ENV === 'analyze') {
      // 打包分析插件
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerHost: '127.0.0.1',
          analyzerPort: '11100'
        })
      )
    }
    config.plugins.push(
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: 4,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log']
          }
        },
        extractComments: false
      })
    )
    config.plugins.push(
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, 'src/assets/icon'), // 源文件夹
          glob: '*.png' // 源文件类型
        },
        target: {
          image: path.resolve(__dirname, 'src/styles/sprite/sprite.png'),
          css: [
            [
              path.resolve(__dirname, 'src/styles/sprite/sprite.less'),
              {
                format: 'function_based_template'
              }
            ]
          ]
        },
        apiOptions: {
          cssImageRef: './sprite.png'
        },
        customTemplates: {
          function_based_template: templateFunction
        }
      })
    )
  },
  chainWebpack: config => {
    // 配置alias，快捷访问方式
    // 需要用path.resolve，直接用相对路径或绝对路径会解析失败
    config.resolve.alias.set('@imgs', path.resolve(__dirname, './src/assets'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    // 添加要替换的 loader
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
        include: [resolve('src/assets/icon')]
      })
      .end()

    // TODO: script传参还有问题，需要进一步解决
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
    // if (argv._.pop() === 'compressPic') {
    // 	// 若要开启图片压缩，使用命令：build:img
    // 	config.module
    // 		.rule('images')
    // 		.test(/\.(png|jpg|jpeg|gif|svg)$/i)
    // 		.use('file-loader')
    // 		.loader('image-webpack-loader')
    // 		.options({
    // 			bypassOnDebug: true
    // 		})
    // 		.end()
    // }

    // 配置worker-loader
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        inline: true,
        fallback: false
      })
    config.module.rule('js').exclude.add(/\.worker\.js$/)

    // 修改初始显示的标题
    config.plugin('html').tap(args => {
      args[0].title = MAIN_TITLE
      return args
    })

    config.when(process.env.NODE_ENV === 'production', config => {
      // 拆包，减少首次加载vendor文件的大小，减少首屏事件
      // npm run analyze 可以查看打包情况
      config.optimization.splitChunks({
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        name: true,
        cacheGroups: {
          // 将体积较大的包单独分离出来，减少vendor的体积，加快首屏速度
          vendors: {
            name: 'chunk-vendors', // enforce默认为false下不能直接设置name值，否则打包会失败
            test: /[\\/]node_modules[\\/]/,
            priority: -10, // 表示缓存的优先级；
            enforce: true
          },
          elementUI: {
            name: 'chunk-elementUI',
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            priority: 10,
            reuseExistingChunk: true // 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。
          }
          // 后续较大的第三方依赖可以单独打包，实现懒加载，参考如下
          // moment: {
          // 	name: 'chunk-moment',
          // 	test: /[\\/]node_modules[\\/]_?moment(.*)/,
          // 	priority: 20,
          // 	reuseExistingChunk: true
          // }
        }
      })
    })
  },
  devServer: {
    host: 'localhost',
    port: 8082, // TODO: 设置端口
    openPage: '#/', // 默认打开首页
    open: true, // 自动打开浏览器
    proxy: {
      // 在axios全局拦截器增加了/api前缀，因此需要rewrite一下。
      // 但要注意，只有经过axios拦截器的才能重写，没有经过axios拦截器的都需要额外写proxy
      [process.env.VUE_APP_PROXY_PREFIX]: {
        target: process.env.VUE_APP_BASE_URL,
        pathRewrite: {
          [prefixReg]: ''
        }
      }
    }
  }
}
const templateFunction = function (data) {
  const shared =
    '.icon { display: inline-block; vertical-align: middle; background-image: url(I) }'.replace(
      'I',
      data.sprites[0].image
    )

  const perSprite = data.sprites
    .map(function (sprite) {
      return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; background-size: Ppx Qpx;}'
        .replace('N', sprite.name)
        .replace('W', sprite.width / 2)
        .replace('H', sprite.height / 2)
        .replace('X', sprite.offset_x / 2)
        .replace('Y', sprite.offset_y / 2)
        .replace('P', sprite.total_width / 2)
        .replace('Q', sprite.total_height / 2)
    })
    .join('\n')

  return shared + '\n' + perSprite
}
