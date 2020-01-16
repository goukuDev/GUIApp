const path = require('path');
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'electron/dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,

  runtimeCompiler: true,

  chainWebpack: () => {},

  //下面的配置作用:在项目里面引用组件的时候不需要写层级关系
  configureWebpack:(config)=> {
    Object.assign(config,{
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': resolve('src'),
        },
        modules:['components','./','node_modules','../']
      }
    })
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  // css相关配置
  css: {},

  parallel: require('os').cpus().length > 1,

  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/news':{
        target:'http://toutiao-ali.juheapi.com',
        changeOrigin:true,
        ws:true,
        pathRewrite:{
          '^/news':''
        }
      },
      // '/waether':{
      //   target:'https://3g.163.com',
      //   changeOrigin:true,
      //   ws:true,
      //   pathRewrite:{
      //     '^/waether':''
      //   }
      // },
    },
    before: app => {},
  },
  // 第三方插件配置
  pluginOptions: {
  // ...
  }
}