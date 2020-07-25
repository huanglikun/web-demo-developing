var mysql = require('mysql');
var debug = require('../utils/constant').debug

let options = {
  host: "localhost",
  //port:"3306",//可选，默认式3306
  port: 3306,
  user: "dbu",
  password: "databaseu",
  database: "testlizhangbin",
  useConnectionPooling: true
}

let conn = mysql.createConnection(options);

// queryByID = (id)=>{
//   return new Promise((resolve, reject) => {
//     try {
//       conn.query(sql, (err, results) => {
//         if (err) {
//           debug && console.log('查询失败，原因:' + JSON.stringify(err))
//           reject(err)
//         } else {
//           debug && console.log('查询成功', JSON.stringify(results))
//           resolve(results)
//         }
//       })
//     } catch (e) {
//       reject(e)
//     } finally {
//     }
//   })
// }


function querySql(sql) {
  debug && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug && console.log('执行失败，原因:' + JSON.stringify(err))
          reject(err)
        } else {
          debug && console.log('执行成功', JSON.stringify(results))
          resolve(results)
        }
      })
    } catch (e) {
      reject(e)
    } finally {}
  })
}

function updateSql(sql) {
  debug && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug && console.log('执行失败，原因:' + JSON.stringify(err))
          reject(err)
        } else {
          let msg= results
          // console.log("matched",msg.matched)
          console.log("msg.affectedRows:",msg.affectedRows)
          if(msg.affectedRows == 1){
            debug && console.log('执行成功', JSON.stringify(results))
            resolve({
              "success": true
            })
          }
          resolve({
            "success": false
          })
        }
      })
    } catch (e) {
      reject(e)
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

function insertArticle(Article) {
  return new Promise((resolve, reject) => {
    // const { title, author , sort, outline, content } = Article
    console.log(Article);
    const {
      ArticleTitle,
      ArticleAuthor,
      ArticleSort,
      ArticleOutline,
      ArticleContent
    } = Article;
    console.log(ArticleTitle, ArticleAuthor, ArticleSort);

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
    } finally {}
  })
}

module.exports = {
  querySql,
  queryOne,
  insertArticle,
  updateSql
}