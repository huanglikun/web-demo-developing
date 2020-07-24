import request from '@/utils/request'

export function submitArticle(params){
    return request({
        url: '/article/submitArticle',
        method: 'get',
        params
    })
}

export function getSorts(){
    return request({
        url: '/article/getSorts',
        method: 'get',
    })
}

export function getArticleList(params){
    return request({
        url: '/article/getArticleList',
        method: 'get',
        params
    })
}

export function deleteArticle(id){
    return request({
        url: '/article/deleteArticle',
        method: 'get',
        params: {id}
    })
}