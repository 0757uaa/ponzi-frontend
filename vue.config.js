const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const resolve = dir => path.join(__dirname, './', dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: IS_PROD ? process.env.BASE_URL : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 81,
    /**
    * vue-cli3跨域的全配置！
    */
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      // .set("vue$", "vue/dist/vue.esm.js")
      .set('@', resolve('src'))
      .set('cps', resolve('src/components'))
      .set('assets', resolve('src/assets'))
    // 打包时使用compression-webpack-plugin插件对资源进行压缩
    config.plugin('compressionPlugin')
      .use(new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false
      }))
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
