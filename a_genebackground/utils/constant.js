const { env } = require('./env')
const UPLOAD_PATH = env === 'dev' ? '/Users/hp/Desktop/vue+node项目/a_genebackground/assets/avator-img' : '/root/upload/admin-upload/ebook';

const UPLOAD_URL = env === 'dev' ? 'https://book.youbaobao.xyz/admin-upload-ebook' : 'https://www.youbaobao.xyz/admin-upload-ebook'

module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  debug: true,
  PWD_SALT: 'ym_genejob_ym',
  PRIVATE_KEY: 'ym_jwttoken_ym',
  JWT_EXPIRED: 60 * 60,
  UPLOAD_PATH,
  UPLOAD_URL,
  MIME_TYPE_EPUB: 'application/epub+zip'
}
