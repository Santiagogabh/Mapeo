// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // <- nuevo adaptador requerido
    require('autoprefixer')(),
  ],
    plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
