module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        webpackConfig.module.rules = webpackConfig.module.rules.filter(rule => {
          if (rule.enforce === 'pre' && rule.use && Array.isArray(rule.use)) {
            return !rule.use.some(use => use.loader && use.loader.includes('source-map-loader'));
          }
          return true;
        });
      }
      return webpackConfig;
    },
  },
};