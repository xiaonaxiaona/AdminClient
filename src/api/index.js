/*
包含n个接口请求函数的模块
根据接口文档编写
调用自定义ajax请求函数发请求
每个函数的返回值都是promise对象
*/
import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from './ajax'
// const BASE = 'http://localhost:3001'
const BASE = ''

// 登陆
/* export function reqLogin(username,password){
 return ajax(BASE + '/login',{username,password},'POST')
} */
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

//商品分类
export const reqCategorys = (parentId) =>ajax(BASE + '/manage/category/list',{parentId})

//更新分类的名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

//添加数据
export const reqAddCategory = (parentId,categoryName) => ajax(BASE +'/manage/category/add',{parentId,categoryName},'POST')

//获取商品分页列表【数组】
export const reqProducts = ({pageNum , pageSize}) => ajax(BASE +'/manage/product/list',{pageNum,pageSize})

//搜索商品分页列表----按名字 / 分类搜索
export const reqSearchProducts = ({
  pageNum ,
  pageSize,
  searchType,
  searchName,
}) => ajax(BASE + '/manage/product/search',{
  pageNum ,
  pageSize,
  [searchType]: searchName,
})
//对象中的属性名，只要写上就是写死了  不能再改变了，但是套上[ ] 就不是死值了

//对商品进行状态处理----进行上架/下架处理  在售/下架
export const reqStateUpdate = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST')

//在detail中，根据分类的id获取当前的分类，然后显示
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//添加/更新商品 -----在add-update中用到  -----由于是传的参数比较多，所以将这一整条数据传递过去
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? "update" : "add"), product, 'POST')




//  简单测试一下的代码
// reqLogin('admin','admin').then(result =>{
//   console.log('result',result)
//  }
// )

//用jsonp来获取天气文本信息与图片信息的（为了模拟异步操作，将jsonp放在定时器中）
export const reqWeather = (location)=>{

 //const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
 const url =`http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
 return new Promise((resolve,reject)=>{
  
  setTimeout(()=>{
    jsonp(url,{},(err, data)=>{
      if(!err && data.status === 'success'){
        const {dayPictureUrl,weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      }else{
        message.error('获取天气信息失败')
      }
    })
  })

 })

}