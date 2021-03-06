const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3070',
        changeOrigin: true
      },
    }
  },
  outputDir: path.resolve(__dirname, "../dist/nft-app")
})
