import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'   // ===> [<Item/>, <SubMenu/>>]
import { Menu, Icon } from 'antd';
const { SubMenu,Item }  = Menu;


class LeftNav extends Component {
/*
  根据menu中数据中数组生成包含<Item> / <SubMenu>的数组
  关键技术: array.reduce() + 递归调用
  */
 getMenuNodes = (menuList)=>{

  const path = this.props.location.pathname

  return menuList.reduce((pre,item) => {
   //console.log(1)
   if(!item.children){  //添加Item
    pre.push(
     <Item key={item.key}>
       <Link to={item.key}>
        <Icon type={item.icon}/>
        <span>{item.title}</span>
       </Link>
     </Item>
    )
   }else{  //添加SubMenu

    // 如果请求的是当前item的children中某个item对应的path, 当前item的key就是openKey  【打开SubMenu菜单项】
    const cItem = item.children.find((cItem,index) => path.indexOf(cItem.key) === 0 )
    if(cItem){
     this.openKey = item.key  // 当前请求的是某个二级菜单路由
    }

    pre.push(
     <SubMenu
       key={item.key}
       title={
         <span>
           <Icon type={item.icon}/>
           <span>{item.title}</span>
         </span>
       }
     >
       {this.getMenuNodes(item.children)}
     </SubMenu>       
    )

   }
   return pre
  },[])

 }

 //在第一次render()之前，即将被挂载时，放上去，【以下代码属于优化的代码】 
 componentWillMount(){
   this.menuNodes = this.getMenuNodes(menuList)
 }

 render() {
  // //获取所有的菜单节点,下面的代码只需要挂载一次，所以放在componentWillMount( )中
   // const menuNodes = this.getMenuNodes(menuList)

  //将请求的路由作为当前选中的菜单项的 key 值  ,这里面的location是withRouter（）传给他的
  const selectedKey = this.props.location.pathname;

  //得到所有的要展开的二级菜单的值  【打开SubMenu菜单项】
  const openKey = this.openKey

  return (
   <div className='left-nav'>
    <Link to='/home' className='leftNav-Header'>
     <img src={logo} alt="logo"/>
     <h1>硅谷后台</h1>
    </Link>
    <Menu
     mode="inline"
     theme="dark"
     selectedKeys={[selectedKey]}  //当前选中的菜单项 key 数组
     defaultOpenKeys={[openKey]}    //初始展开的 SubMenu 菜单项 key 数组 【打开SubMenu菜单项】
    >
    {/* {menuNodes} */}
    {this.menuNodes}

   {/*     
     <Menu.Item key="/home">
       <Link to='/home'>
        <Icon type="home" />
        <span>首页</span>
       </Link>
     </Menu.Item>
   */}
     {/* <SubMenu
       key="sub1"
       title={
         <span>
           <Icon type="mail" />
           <span>商品</span>
         </span>
       }
     >
     <Menu.Item key="2">
      <Link>
       <Icon type="pie-chart" />
       <span>品类管理</span>
      </Link>     
     </Menu.Item>

     <Menu.Item key="3">
      <Link>
       <Icon type="pie-chart" />
       <span>商品管理</span>
      </Link>      
     </Menu.Item>

     </SubMenu>
         */}

    </Menu>
   
   </div>
  )
 }
}
/* 
向外暴露是通过withRouter包装LeftNav产生新组件
新组件会向非路由组件传递3个属性: history/location/match => 非路由组件也可以使用路由相关语法
withRouter是一个高阶组件
*/
export default withRouter(LeftNav)
