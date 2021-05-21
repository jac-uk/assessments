module.exports = {
  devServer: {
    port: 8082,
  },
  css: {
    loaderOptions: {
      sass: {
        // always import main.scss first
        additionalData: '@import "@/main.scss";',
      },
    },
  },
  parallel: !process.env.NODE_ENV === 'production',
};
