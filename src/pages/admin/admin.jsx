import React,{Component} from 'react';
import memoryUtils from '../../utils/memoryUtils'
import {Redirect,Switch,Route} from 'react-router-dom'

import { Layout } from 'antd';

import AdminHeader from '../../components/header'
import LeftNav from '../../components/left-nav'

import Category from '../category/category'
import Home from '../home/home'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'



const { Footer, Sider, Content } = Layout;
/* 
后台管理的一级路由组件
*/
export default class Admin extends Component {
 render() {
  // 如果当前没有登陆(内存的user中没有_id)
  const user = memoryUtils.user
  if(!user._id){
   return <Redirect to='/login'/>
  }

  return (
   <Layout style={{height:'100%'}}>
      <Sider>
       <LeftNav/>
      </Sider>
      <Layout>
        <AdminHeader/>  
        <Content style={{backgroundColor:'#fff', margin:30}}>

         <Switch>
          <Route path='/category' component={Category}/>
          <Route path='/home' component={Home}/>
          <Route path='/product' component={Product} />
          <Route path='/role' component={Role} />
          <Route path='/user' component={User} />
          <Route path='/charts/bar' component={Bar} />
          <Route path='/charts/line' component={Line} />
          <Route path='/charts/pie' component={Pie} />
          <Redirect to='/home'/>
         </Switch>

        </Content>
        <Footer style={{textAlign:'center',color:'#aaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
  )
 }
};

