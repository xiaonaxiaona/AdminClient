import React, { Component } from 'react'
import {Card,Select,Input,Button,Icon,Table,message} from 'antd'


import IsButton from '../../components/isbutton';
import {reqProducts, reqSearchProducts, reqStateUpdate} from '../../api'
import {PAGE_SIZE} from '../../utils/constains.js'

export default class ProductHome extends Component {
  state = {
    loading:false,
    products:[],
    total:0, // 所有商品的总个数
    searchType:'productName' ,// 根据什么来搜索, productName: 商品名, productDesc: 商品描述
    searchName:'',
  }
  //初始化table的所有列信息的数组 [显示表头信息]
  initColumns = ()=>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price,
      },
      {
        title: '状态',
        width: 100,
        render: (product) => {
          const {status,_id} = product
          const btnText = status===1? '下架':'上架'
          const text = status===1? '在售':'已下架'
          return (
            <span>
              <Button type='primary' onClick={()=>this.stateUpdate(_id,status === 1? 2:1)}>{btnText}</Button>
              <span>{text}</span>
            </span>
          )
        },
      },
      {
        title: '操作',
        width: 100,
        render: (product)=>(
          <span>
            <IsButton onClick={()=>{this.props.history.push('/product/detail/' + product._id , product)}}>详情</IsButton>
            <IsButton>修改</IsButton>
          </span>
        )
      },
    ]
  }

  //请求接口----请求数据[总显示的 与 按关键字搜索的]
  getProducts = async(pageNum)=>{
    this.pageNum = pageNum;  //保存当前页

    const {searchType, searchName} = this.state
    let result;

    this.setState({loading:true})

    if(!searchName){ //这里没有值就是请求的所有的数据
      result = await reqProducts({ pageNum, pageSize: PAGE_SIZE }) //根据传的pageNum与pageSize，可以看出是后台分页
                                                                  //响应的有total（总记录数） 与当前页的数据条数
    }else{//这里有值，就是请求的当前的关键字的数据
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchType, searchName})
    }

    this.setState({loading:false})

    if(result.status === 0){
      const { total,list } = result.data
      this.setState({
        total,
        products:list,
      })
    }

  }

  //改变状态---status   productId----商品名称；status----商品状态值
  stateUpdate =async (productId,status)=>{
    const result = await reqStateUpdate(productId,status)
    if(result.status === 0){
      message.success('更新状态成功')//1---提示框  更新成功

      this.getProducts(this.pageNum)//2----更新当前页的数据

    }
  }


  //即将挂载，渲染一次
  componentWillMount(){
    this.initColumns()
  }

  //异步任务请求
  componentDidMount(){
    this.getProducts(1)
  }

  render() {
    const { loading, products, total, searchType, searchName} = this.state
   // Card的左侧是title
    const title = (
      <span>

        <Select 
          value={ searchType } 
          style={{ width:150 }}
          onChange= {(value) => this.setState({searchType: value}) }>
          <Select.Option value='productName'>按名称搜索</Select.Option>
          <Select.Option value='productDesc'>按描述搜索</Select.Option>
        </Select>
        <Input 
          placeholder='关键字' 
          style={{width:150 ,margin:'0 15px'}}
          value={ searchName }
          onChange={(e)=> this.setState({searchName: e.target.value}) }>
        </Input>
        <Button type='primary' onClick={()=> this.getProducts(1)}>搜索</Button>

      </span>
    )
    //右侧是extra
    const extra = (
      <Button type='primary'>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={products}
          pagination={{ 
            defaultPageSize: PAGE_SIZE, 
            showQuickJumper: true, 
            total,
            // 监视页码改变的监听
            // onChange: (pageNum) => {this.getProducts(pageNum)}
            onChange: this.getProducts}}
        />
      </Card>
    )
  }
}
