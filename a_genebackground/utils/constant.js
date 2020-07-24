const { env } = require('./env')
const UPLOAD_PATH = env === 'dev' ? '/Users/hp/Desktop/vue+node项目/a_vue_gene/public/article_avator' : '/';

module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  debug: true,
  PWD_SALT: 'ym_genejob_ym',
  PRIVATE_KEY: 'ym_jwttoken_ym',
  JWT_EXPIRED: 60 * 60,
  UPLOAD_PATH,
  MIME_TYPE_EPUB: 'application/epub+zip'
}
