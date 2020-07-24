const db = require('../db')

function exists(Article) {
    // console.log(Article)
    const title = Article.ArticleTitle
    const author = Article.ArticleAuthor
    const sql = `select * from article where title='${title}' and author='${author}'`
    return db.queryOne(sql)
}

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

function deleteArticle(id){
    return new Promise((resolve,reject) => {
        const sql = `delete from article where id = ${id}`
        db.querySql(sql).then(() => {
            resolve()
        })
    })
}

async function getSorts() {
    const sql = `select * from article_sort order by id`
    const result = await db.querySql(sql)
    const sorts = []
    result.forEach(item => {
        sorts.push({
            id: item.id,
            sort: item.sort,
            outline: item.outline
        })
    });
    return sorts
}

async function getArticleList(query) {
    console.log(query)
    const {
        sort,
        author,
        title,
        page = 1,
        pageSize = 10,
        order
    } = query
    const offset = (page - 1)*pageSize
    let sql = `select * from article`
    let where = 'where'
    title && (where = db.andLike(where, 'title', title))
    author && (where = db.andLike(where, 'author', author))
    sort && (where = db.and(where,'sort',sort))
    if(where!=='where'){
        sql = `${sql} ${where}`
    }
    if(order){
        const symbol = order[0]
        const column = order.slice(1,order.length)
        const orderB = symbol === '+' ? 'asc' : 'desc'
        sql = `${sql} order by ${column} ${orderB}`
    }
    let countSql = `select count(*) as count from article`
    if(where !== 'where') {
        countSql = `${countSql} ${where}`
    }
    const count = (await db.querySql(countSql))[0].count

    sql = `${sql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(sql)
    return {list,count,page,pageSize}
}

module.exports = {
    insertArticle, getSorts, getArticleList, deleteArticle
}
