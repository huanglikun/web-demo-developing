const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', router)



const server = app.listen(5000, function() {
  const { address, port } = server.address()
  console.log('HTTP服务启动成功：http://%s:%s', address, port)
})
