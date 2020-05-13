module.exports = {
  devServer: {
    port: 8082,
  },
  css: {
    loaderOptions: {
      sass: {
        // always import main.scss first
        prependData: '@import "@/main.scss";',
      },
    },
  },
  parallel: !process.env.NODE_ENV === 'production',
};
