
// 加载文件传输
const  multer  = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname,'../upload') })
const {baseUrl} = require('../ServerConf')
// console.log(baseUrl,"baseUrl")

const express = require('express')
const router = express.Router()

// single后面的数据  file
router.post('/upload', upload.single('avater'), async (req, res)=> {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    let file = req.file
    file.url = path.join(baseUrl,'/upload',file.filename)
    // http://localhost:5000/upload/{filename}
    console.log(file)
    res.send(file)
})
router.get('/rrrrt',async ()=>{
    res.json({"flag": 1})
})

module.exports = router
