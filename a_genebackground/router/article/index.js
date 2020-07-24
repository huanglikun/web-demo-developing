const express = require('express')
const boom = require('boom')
const multer = require('multer')
const fs = require('fs')
const { UPLOAD_PATH } = require('../../utils/constant')
const Result = require('../../models/Result')
const articleService = require('../../services/article')

const router = express.Router()

router.get('/submitArticle', async (req, res, next) => {
    // console.log(req.query);
    const Article = req.query
    if (!Article) {
        next(boom.badRequest(new Error('文章内容不能为空')))
    } else {
        articleService.insertArticle(Article)
            .then(() => {
                new Result('文章上传成功').success(res)
            })
            .catch(err => {
                next(boom.badImplementation(err))
            })
    }
})

router.get('/getSorts', async (req, res, next) => {
    articleService.getSorts().then(sorts => {
        new Result(sorts, '获取分类成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/getArticleList', async (req, res, next) => {
    articleService.getArticleList(req.query).then(({ list, count, page, pageSize }) => {
        new Result({ list, count, page: +page, pageSize: +pageSize }, '获取文章成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/deleteArticle', function (req, res, next) {
    console.log(req.query);
    const { id } = req.query
    if (!id) {
        next(boom.badRequest(new Error('参数id不能为空')))
    } else {
        articleService.deleteArticle(id).then(() => {
            new Result('删除文章成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})

const storage = multer.diskStorage({
    //存储的位置
    destination(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    //文件名字的确定 multer默认取一个没有扩展名的文件名
    filename(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage })
router.post('/avatar-upload', upload.single('file'),
    function (req, res, next) {
        console.log(req.file.path);
        if (!req.file || req.file.length === 0) {
            new Result('上传封面失败').fail(res)
        } else {
            // console.log(req.file);
            new Result(req.file.filename, '作业上传成功').success(res)
        }
    });

module.exports = router