import React,{Component} from 'react';
import {Form, Icon, Input, Button,message} from 'antd';
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import {Redirect} from 'react-router-dom'
import {saveUser} from '../../utils/storageUtils'

import logo from '../../assets/images/logo.png'
import './login.less'



/* 
登陆的一级路由组件
*/
class Login extends Component {
 handleSubmit = event => {
  event.preventDefault();   // 阻止默认行为
  /* const user = this.props.form.getFieldValue('username')
  const pass =this.props.form.getFieldValue('password')
  const {username,password} = this.props.form.getFieldsValue()
  console.log(user,pass,username,password); */

  //统一验证 ---validateFields
  this.props.form.validateFields(async(err, values) => {
    if (!err) { //验证成功
      // console.log('Received values of form: ', values);
      const {username,password} = values;
      const result = await reqLogin(username,password)
      
      if(result.status===0){//登录成功了
        //保存用户信息
        const user = result.data

        //localStorage.setItem('USER-KEY',JSON.stringify(user))  //保存了local文件
        saveUser(user)   //保存了local文件

        memoryUtils.user = user //保存在内容中

        //跳转用户界面
        this.props.history.replace('/')

      }else{
        message.error(result.msg,2) //antd 的message的模板中的
      }

    }
  });
  
 }
 //密码的自定义验证
 validator=(rule, value='', callback)=>{
   //去掉空格，但是如果用户直接点击登录，什么都没有输入时，
   //下面的去调用空格的代码会报错的，所以在传参时，可以先传个空串，
   //或者根据文档，在配置对象那里写initialValue:''
  value = value.trim();
  if(!value){
    callback('请输入密码')  // 指定要显示的提示内容 
  }else if(value.length<4){
    callback('不能小于4位')
  }else if(value.length>12){
    callback('不能大于12位')
  }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
    callback('必须是英文、数字或下划线组成')
  }else{
    callback() //----代表验证成功
  }
 }

 render() {
  const { getFieldDecorator } = this.props.form;

  //在login界面，如果已经登录了，就跳转去admin的界面
  if(memoryUtils.user._id){
    return <Redirect to='/'/>
  }

  return (
   <div className='login'>
    <header className='login_header'>
     <img src={logo} alt="logo"/>
     <h1>React项目: 后台管理系统</h1>
    </header>
    <section className='login_section'>
     <h2>用户登录</h2>
     <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username',{// 配置对象(options): 属性名是特定名称
            // 指定初始值为空串
            initialValue: '',
            //声明式验证:使用已有验证规则进行验证
            rules:[
              {required: true, message: '请输入用户名' },
              {min:4,message:'不能小于四位'},
              {max:12,message:'不能大于12位'},
              {pattern:/^[a-zA-Z0-9_]+$/,message:'必须是英文、数字或下划线组成'}
            ]  

          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password',{//配置对象
            //自定义验证----validator
            rules:[{validator:this.validator}]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}            
              placeholder="密码"
              type = 'password'
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    </section>
   </div>
  )
 }
};

/*
Form组件: 包含了<Form>的组件
Form.create()返回函数包装一个Form组件生成一个新的组件: Form(Login)
Login会接收到一个form属性对象
*/

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm 

/* export default Form.create()(Login) */
