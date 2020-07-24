var mysql = require('mysql');
var debug = require('../utils/constant').debug

let options = {
  host: "localhost",
  //port:"3306",//可选，默认式3306
  user: "ymdb",
  password: "a505668374",
  database: "a_genejob"
}

let conn = mysql.createConnection(options);

function querySql(sql) {
  debug && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug && console.log('查询失败，原因:' + JSON.stringify(err))
          reject(err)
        } else {
          debug && console.log('查询成功', JSON.stringify(results))
          resolve(results)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
    }
  })
}

function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(results => {
      if (results && results.length > 0) {
        resolve(results[0])
      } else {
        resolve(null)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

function and(where, k, v){
  if(where === 'where'){
    return `${where} ${k}='${v}'`
  }else{
    return `${where} and ${k}='${v}'`
  }
}

function andLike(where, k, v){
  if(where === 'where'){
    return `${where} ${k} like '%${v}%'`
  }else{
    return `${where} and ${k} like '%${v}%'`
  }
}

function insertArticle(Article) {
  return new Promise((resolve, reject) => {
    const { ArticleTitle, ArticleAuthor, ArticleSort, ArticleOutline, ArticleContent } = Article;
    // console.log(ArticleTitle, ArticleAuthor, ArticleSort);

    let sql = `insert into article(title,sort,author,content,outline) values('${ArticleTitle}','${ArticleSort}','${ArticleAuthor}','${ArticleContent}','${ArticleOutline}')`
    try {
      conn.query(sql, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
    }
  })
}

module.exports = {
  querySql,
  queryOne,
  insertArticle,
  and,
  andLike,
}
