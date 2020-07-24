const jwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

// jwt中间件

module.exports = jwt({
  secret: PRIVATE_KEY,
  credentialsRequired: true
}).unless({
  path: [
    '/',
    '/user/login',
  ]
})
