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
export const reqCategory = (parentId) =>ajax(BASE + '/manage/category/list',{parentId})

//更新分类的名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

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