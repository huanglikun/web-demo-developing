const express = require('express')
const boom = require('boom')
const multer = require('multer')
const fs = require('fs')
const { UPLOAD_PATH,CODE_SUCCESS } = require('../../utils/constant')
const Result = require('../../models/Result')
const articleService = require('../../services/article')


const router = express.Router()

// router.get('/submit', async (req, res, next) => {
//     // console.log(req.query);  
//     // console.log('article') 
//     const Article = JSON.parse(req.query.ArticleJson);
//     // console.log(Article);    
//     if (!Article) {
//         next(boom.badRequest(new Error('文章内容不能为空')))
//     } else {
//         articleService.insertArticle(Article)
//             .then(() => {
//                 new Result().success(res)
//             })
//             .catch(err => {
//                 console.log('/book/create', err)
//                 next(boom.badImplementation(err))
//             })
//     }
// })
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
                console.log('/book/create', err)
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

//  文章列表
router.get('/list', async(req, res,next) => {
    // console.log('in article')
    let title = req.query.title
    let page = req.query.page
    let limit = req.query.limit
    console.log('title,page,limit',title,page,limit)
    if(title == null || title == ''){
        next(boom.badRequest(new Error('搜索内容不能为空')))
    }else{
        articleService.serachArticleByTitle(title,page,limit)
            .then((data)=>{
                data.code = CODE_SUCCESS
                console.log('json', data)
                res.json(data)
            })
            .catch((err)=>{
                console.log('/article/list', err)
                next(boom.badImplementation(err))
            })
    }
})

// 文章详情 根据id
router.get('/detail',async (req,res,next)=>{
    console.log('in article')
    let article_id= req.query.id
    console.log('article_id',article_id)
    if(article_id == null || article_id == ''){
        next(boom.badRequest(new Error('搜索内容不能为空')))
    }else{
        articleService.serachArticleByID(article_id)
            .then((data)=>{
                data.code = CODE_SUCCESS
                console.log('json', data)
                res.json(data)
            })
            .catch((err)=>{
                console.log('/article/detail', err)
                next(boom.badImplementation(err))
            })
    }
})



// 是否是置顶 
// 地址：http://localhost:5000/article/setup
// 方法： put
// 参数；{
//      id:文章id
//      isUp: 0 , 1        1是要修改成置顶  
// }

router.put('/setup',async(req,res,next)=>{
    console.log('in setup')
    let {id, is_up} = req.query
    console.log(req.query.id,req.query.is_up)
    if(id == null || typeof id == 'undefined' || id == ''){
        next(boom.badRequest(new Error('搜索内容不能为空')))
    }else{
        articleService.setArticleUp(id, is_up)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log('/article/detail', err)
            next(boom.badImplementation(err))
        })
    }
})
// const storage = multer.diskStorage({
//     //存储的位置
//     destination(req, file, cb) {
//         cb(null, UPLOAD_PATH)
//     },
//     //文件名字的确定 multer默认取一个没有扩展名的文件名
//     filename(req, file, cb) {
//         cb(null, Date.now() + file.originalname)
//     }
// })
// const upload = multer({ storage })
// router.post('/avatar-upload', upload.single('file'),
//     function (req, res, next) {
//         console.log(req.file.path);
//         if (!req.file || req.file.length === 0) {
//             new Result('上传封面失败').fail(res)
//         } else {
//             // console.log(req.file);
//             new Result(req.file.filename,'上传封面成功').success(res)
//         }
//     });






module.exports = router