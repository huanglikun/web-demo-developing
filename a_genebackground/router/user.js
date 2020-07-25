const express = require('express')
const Result = require('../models/Result')



// 调用数据库 函数login
const { login, findUser } = require('../services/user')

const {
  decoded
} = require('../utils')
const {
  PRIVATE_KEY,
  JWT_EXPIRED
} = require('../utils/constant')
const {
  jiami
} = require('../utils/jiami')

// 确认[]中的数据是否正确
const { body, validationResult } = require('express-validator')

const boom = require('boom')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post(
  '/login',
  [
    body('username').isString().withMessage('用户名必须为字符'),
    body('password').isString().withMessage('密码必须为数字')
  ],
  function (req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{
        msg
      }] = err.errors
      next(boom.badRequest(msg))
    } else {
      let {
        username,
        password
      } = req.body
      password = jiami(password)

      // 在上面确认用户输入无误时， 调用数据库方法
      login(username, password).then(user => {
        if (!user || user.length === 0) {
          new Result('账号或密码错误').fail(res)
        } else {
          const token = jwt.sign({
              username
            },
            PRIVATE_KEY, {
              expiresIn: JWT_EXPIRED
            }
          )
          new Result({
            token
          }, '登录成功').success(res)
        }
      })
    }
  })

router.get('/info', function (req, res) {
  const decode = decoded(req)
  if (decode && decode.username) {
    findUser(decode.username).then(user => {
      if (user) {
        user.roles = [user.role]
        new Result(user, '用户信息查询成功').success(res)
      } else {
        new Result('用户信息查询失败').fail(res)
      }
    })
  } else {
    new Result('用户信息查询失败').fail(res)
  }
})

module.exports = router