import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/datatimeUtils'
import menuList from '../../config/menuConfig'
import {removeUser} from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import IsButton from '../isbutton'
import './index.less'

class Header extends Component {
  state = {
    currentTime:formateDate(Date.now()) ,  //获取当前的时间
    dayPictureUrl:'',    //获取天气的图片
    weather:''     //获取天气的文本消息
  }
  //显示时间的
  showCurrentTime =()=>{

    this.timeId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000);

  }

  //获取头部左下面的title的
  getTitle = ()=>{
    const path = this.props.location.pathname
    let title = ''
    menuList.forEach((item)=>{
      if(item.key===path){
        title = item.title
      }else if(item.children){
        const cItem = item.children.find( item => path.indexOf(item.key) === 0)  //find后面的是为了写商品详情界面的
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title

  }

  //点击按钮，退出登录
  goOut = ()=>{
     // 显示确认框, 点击确定后再退出
     Modal.confirm({
      title: '确定退出吗?',
      onOk: () => {
        console.log('OK')

        // 清除保存user数据
        removeUser()  // localtion中的,---在storageUtils文件下
        memoryUtils.user = {} // 内存中的,----在memoryUtils文件下的

        // 跳转到登陆
        this.props.history.replace('/login')

      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  //获取天气信息的图片，文本消息
  getWeather = async()=>{
    const {dayPictureUrl,weather} = await reqWeather('北京')
    this.setState({dayPictureUrl,weather})
  }
 
  //执行异步任务的
  componentDidMount(){
    this.showCurrentTime()
    this.getWeather()
  }

  //即将销毁时 关闭定时器
  componentWillUnmount(){
    clearInterval(this.timeId)
  }

  render() {
    const {currentTime,dayPictureUrl,weather} = this.state

    //获取读到当前登录的用户名：username
    const {user} = memoryUtils

    //获取头部坐下方的 title
    const title = this.getTitle()

    return (
    <div className='header'>
      <div className='header-top'>
      <span>欢迎,{user.username}</span>
      {/* <a href='javascript:' onClick={this.goOut}>退出</a> */}
      <IsButton onClick={this.goOut}>退出</IsButton>
      </div>
      <div className='header-bottom'>
      <div className='header-bottom-left'>{title}</div>
      <div className='header-bottom-right'>
        <span>{currentTime}</span>  
        {!!dayPictureUrl && <img src={dayPictureUrl} alt="weather"/> }
        <span>{weather}</span>
      </div>
      </div>
    </div>
    )
  }
}
export default withRouter(Header)
