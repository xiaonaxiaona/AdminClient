import store from 'store'

/* 
用来进行local数据存储的工具模块
*/
//保存-------的是key,value的形式,value是个对象  {'key',{}} -------在login路由组件的，登录时候保存起来
export function saveUser(user){
 //localStorage.setItem('USER-KEY',JSON.stringify(user))
 store.set('USER-KEY',user)
}

//读取-----指定的key所对应的value值------在入口文件index中用 getUser()
export function getUser(){
 return store.get('USER-KEY') || {}
}

//删除------一个对象
export function removeUser(){
 store.remove('user')
}

