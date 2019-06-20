import React, { Component } from 'react'
import {Card,Button,Icon,Table,Modal,message} from 'antd'

import IsButton from '../../components/isbutton'
import {reqCategorys} from '../../api'
import UpdateForm from './update-form'
import AddForm from './add-form'
import {reqUpdateCategory, reqAddCategory } from '../../api'


export default class Category extends Component {

state = {
  parentId:'0',// 当前分类列表的parentId
  categorys:[] ,//一级请求数组
  subCategorys:[],//二级请求数组
  loading:false  ,//是否显示loading界面
  parentName: '', // 当前分类列表的父分类名称
  showStatus:0 // 0: 都不显示, 1: 修改, 2: 添加
}
 

//初始化表格列的数组
  initColumns = (category)=>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',        
      },
      {
        title: '操作',
        width:300,
        render: (category) => {
          return (
            <span>
              <IsButton onClick={() => this.showUpdate(category)}>修改分类</IsButton>
              {this.state.parentId === '0' && <IsButton onClick={() => this.showSubCategorys(category)}>查看子分类</IsButton>}
            </span>
          )
        }
      },
      
    ]
  }

  //获取一级与二级列表
  getFirstAndTwoColumns = async(pid) =>{

    this.setState({loading:true})  //请求前显示loading
    /*
    const {parentId} = this.state
    const result = await reqCategorys(parentId)  //----获取的parentId的值，是会得到所有的1-2级的数组，
                                                  //因为2级的包在1级里面,先进入1级才会进入2级
    */

    //以下是在添加分类需要特殊做的
    const parentId = pid || this.state.parentId
    const result = await reqCategorys(parentId) //添加分类---特殊用的

    this.setState({loading:false})
    if(result.status===0){
      // 得到的分类数组可能是一级的, 也可能是二级的
      const categorys = result.data

      if(parentId==='0'){
        this.setState({categorys}) //----获取的是一级
      }else{
        this.setState({ subCategorys : categorys})  //----获取的是二级
      }

    }
  }

  //显示二级列表 
  showSubCategorys = (category)=>{
/* 
    setState()是异步更新的状态数据, 在setState()的后面直接读取状态数据是旧的数据
    利用setState({}, callback): callback在状态数据更新且界面更新后执行
    */
    this.setState({
      parentId:category._id,
      parentName:category.name
    },()=>{
      //更新二级列表
      this.getFirstAndTwoColumns()
      //console.log(1);
      
    })
    
  }

  //退回到一级列表
  showCategorys = ()=>{
   
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  
  }


   /* 
  显示更新的界面
  */
  showUpdate = category => {
    // 保存cateogory
    this.category = category
    // 更新状态
    this.setState({
      showStatus: 1
    })
  }

  /* 
  更新分类
  */
  updateCategory = () => {
    // 进行表单验证-----子组件传递过来的form才能进行表单验证
    this.form.validateFields(async(err, values) => {
      if (!err) { // 只有验证通过才继续

        // 1--隐藏修改界面
        this.setState({
          showStatus: 0
        })

        // 2--得到输入的分类名称
        const categoryName = this.form.getFieldValue('categoryName')

        // 3--重置输入数据
        this.form.resetFields()

        // 4--得到分类的_id
        const categoryId = this.category._id

        //console.log('发更新请求', categoryName, categoryId)
        const result = await reqUpdateCategory({ categoryId, categoryName })

        if (result.status===0) {
          message.success('更新分类成功')
          this.getFirstAndTwoColumns()
        }

      }
      
    })
  

  }

  //添加分类
  addCategory = ()=>{
    // 进行表单验证-----子组件传递过来的form才能进行表单验证
    this.form.validateFields(async(err, values) => {
      if (!err) { // 只有验证通过才继续

        // 1--隐藏修改界面
        this.setState({
          showStatus: 0
        })

        // 2--得到输入的分类名称parentId, categoryName 
        const { parentId, categoryName } = this.form.getFieldsValue()

        // 3--重置输入数据
        this.form.resetFields()

        //4.---- 得到请求的结果
        const result = await reqAddCategory( parentId, categoryName )

        //5---添加数据
        if (result.status===0) {

          message.success('添加分类成功')

          //一级列表  -------此时的这里需要去修改getFirstAndTwoColumns，给他一个形参
          if(parentId==='0'){
            this.getFirstAndTwoColumns('0')
          }else if(parentId === this.state.parentId ){ //二级列表
            this.getFirstAndTwoColumns()
          }

        }

      }
      
    })
  }
  
  //在render()之前即将挂载-----初始化表格的列
  componentWillMount(){
    this.initColumns()
  }

  //在render()之后，即将挂载DidMount()----异步请求的
  componentDidMount(){
    this.getFirstAndTwoColumns()  //获取一级分类列表显示
  }


  render() {
    const {parentId,categorys,subCategorys,loading,parentName,showStatus} = this.state

    // 读取当前指定的分类
    const category = this.category || {}

    //定义标题------定义card右侧的内容
    const extra =(
      <Button type='primary' onClick={()=>this.setState({showStatus:2})}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )
    //定义标题------定义card左侧的内容
     const title = parentId==='0' ? '一级分类列表' : (
      <span>
        <IsButton onClick={this.showCategorys}>一级分类列表</IsButton>
        <Icon type="arrow-right"></Icon>&nbsp;&nbsp;
        <span>{parentName}</span>
      </span>
    )

  return (
    <div>
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={parentId==='0' ? categorys : subCategorys}
          pagination={{ defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="更新分类"
          visible={showStatus===1}
          onOk={this.updateCategory}
          onCancel={() => this.setState({ showStatus: 0 })}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}/>
        </Modal>

        <Modal
          title="添加分类"
          visible={showStatus===2}
          onOk={this.addCategory}
          onCancel={() => this.setState({ showStatus: 0 })}
        >
          <AddForm parentId={parentId} categorys={categorys} setForm={(form) => this.form = form}/>
        </Modal>
        
      </Card>
    </div>
    )
  }
}
// pagination={{ defaultPageSize: 5, showQuickJumper: true}}------每页显示的条数，也是否可以跳转
//rowKey---表格行  key的取值
//dataSource----指定表格的数据源，为一个数组
//columns------几列