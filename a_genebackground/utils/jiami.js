var crypto = require('crypto')
var salt = require('./constant').PWD_SALT

function jiami(str){
    let obj = crypto.createHash('md5')
    str = salt+str;
    obj.update(str)
    return obj.digest('hex')
}

module.exports = {
    jiami
}