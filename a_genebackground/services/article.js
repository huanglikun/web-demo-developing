const db = require('../db')

function exists(Article) {
    // console.log(Article)
    const title = Article.ArticleTitle
    const author = Article.ArticleAuthor
    const sql = `select * from article where title='${title}' and author='${author}'`
    return db.queryOne(sql)
}

// 1插入文章 的功能
function insertArticle(Article) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await exists(Article)
            if (result) {
                reject(new Error('文章已存在'))
            } else {
                await db.insertArticle(Article)
                resolve()
            }
        } catch (e) {
            reject(e)
        }
    })
}
// 2根据标题搜索 文章
serachArticleByTitle = (title,page,limit) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            let sql = `select pubtime, author,title,outline,label as tag,id from article where title like '%${title}%' limit ${(page-1)*limit},${limit}`
            let data = {}
            let arr = await db.querySql(sql)
            let label_arr = []
            arr.map((x)=>{
                let obj = x

                // 1 时间的部分
                let date = new Date(obj.pubtime)
                // str = String(obj.pubtime).substring(0,10) + ' ' +String(obj.pubtime).substring(12,14) 
                let str = [date.getFullYear(), date.getMonth()+1, date.getDay()].join('-')+" "+date.getHours()         
                // console.log(str,typeof str)
                obj.pubtime = str
                // obj.pubtime = str

                // 2 添加一个 label 包含其中的label
                if (label_arr.length == 0 || label_arr.indexOf(obj.tag) == -1){
                    label_arr.push(obj.tag)
                }

                // 3 删除其中每个 tag

                delete obj.tag

                return obj
            })
            data.items = arr
            data.label = label_arr
            data.total = data.items.length
            // console.log('data', data)
            resolve(data)
        }catch(e){
            reject(e)
        }
    })
}

// 3根据id搜索 文章
serachArticleByID = (id)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let sql = `select title, content,outline,pubtime,avatar,author,id from article where id = ${id}`
            let data = await db.querySql(sql)
            console.log(data)
            data.map((x)=>{
                let obj = x

                // 1 时间的部分
                let date = new Date(obj.pubtime)
                // str = String(obj.pubtime).substring(0,10) + ' ' +String(obj.pubtime).substring(12,14) 
                let str = [date.getFullYear(), date.getMonth()+1, date.getDay()].join('-')+" "+date.getHours()         
                // console.log(str,typeof str)
                obj.pubtime = str
                // obj.pubtime = str

                return obj
            })
            console.log('data', data)
            resolve(data)
        }catch(e){
            reject(e)
        }
    })
}

// 4 文章置顶功能
setArticleUp = (id, is_up) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            let sql = `update article set is_up = ${is_up} where id = ${id}`
            let data = await db.updateSql(sql)
            console.log('data', data)
            resolve(data)
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    insertArticle,
    serachArticleByTitle,
    serachArticleByID,
    setArticleUp
}
