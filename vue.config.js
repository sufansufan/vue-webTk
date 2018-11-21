// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const path = require("path");

const resolve = dir => {
  return path.join(__dirname, dir);
};

module.exports = {
  devServer: {
    proxy: "http://192.168.1.123:8083"
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/css/base.scss";`
      }
    }
  },
  assetsDir: "./",
  configureWebpack: {
    entry: {
      app: ["babel-polyfill", "@/main.js"]
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.css$/,
    //       use: [MiniCssExtractPlugin.loader, "css-loader"]
    //     }
    //   ]
    // },
    plugins: [
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
      // new MiniCssExtractPlugin({
      //   filename: "[name].[chunkhash:8].css",
      //   chunkFilename: "[id].css"
      // })
    ]
    // externals: {
    //   vue: "Vue",
    //   "vue-router": "VueRouter",
    //   vuex: "Vuex",
    //   axios: "axios",
    //   "element-ui": "ELEMENT"
    // }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_c", resolve("src/components"))
      .set("_conf", resolve("config"));
  }
};
