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
    '/admin/api/upload',
    '/submit',
    '/upload',
    '/article/list',
    '/article/detail',
    '/article/setup'
  ]
})

