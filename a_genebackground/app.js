const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

//静态 
app.use('/upload',express.static(__dirname+'/upload'))

// 跨域
app.use(cors())

// post参数
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 调用router 1 到router文件中index
app.use('/', router) 


// console.log('__dirname:',__dirname)

const server = app.listen(5000, function() {
  const { address, port } = server.address()
  // console.log('HTTP服务启动成功：http://%s:%s', address, port)
  console.log('HTTP服务启动成功：http://localhost:%s', port)
})
