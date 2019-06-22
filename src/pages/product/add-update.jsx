import React, { Component } from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Button,
  Cascader,  //-----负责多级联动的
  message
} from 'antd'

import IsButton from '../../components/isbutton'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

import {reqCategorys, reqAddOrUpdateProduct} from '../../api'

const { Item } = Form
const { TextArea } = Input

/* 
商品的添加/修改子路由组件
*/
class ProductAddUpdate extends Component {

  state = {
    options:[]
  }

  constructor(props) {
    super(props);
    // 创建一个ref对象容器
    this.pwRef = React.createRef()
    this.editorRef = React.createRef()
  }

  //对价格进行校验---自定义的校验
  validatePrice = (rule,value,callback) =>{
    if(value < 0){
      callback('价格不能小于0')
    }else{
      callback()
    }
  }

  //获取一级 或者 二级 列表 
  getCategorys = async (parentId)=>{
    const result = await reqCategorys(parentId)
    if(result.status === 0){

      const categorys = result.data

      if(parentId==='0'){  //获取的是一级列表
        this.initOptions(categorys)
      }else{  //获取的是二级列表
        return categorys    // 返回值作为async函数返回的promise对象的成功的value
      }
    }
  }

  
  //初始就需要获得并且显示（修改的时候显示）一二级的列表-----根据分类的数组更新options显示
  initOptions = async (categorys)=>{
    // option={value, label, isLeaf}
    const options = categorys.map(c =>({
      label:c.name,
      value:c._id,
      isLeaf:false
    }))
    // 如果当前是更新二级分类的商品, 需要, 获取对应的二级分类列表显示
   const {product, isUpdate} = this
   if(isUpdate && product.pCategoryId !== '0'){
     const subCategorys = await this.getCategorys(product.pCategoryId)   
     if(subCategorys && subCategorys.length > 0){
       //在options中找到当前商品对应的option
       const targetOption = options.find(option => option.value === product.pCategoryId)

       //给targetOption，也就是给 option添加children来确定二级列表
       targetOption.children = subCategorys.map(c =>({
         label :c.name,
         value:c._id,
         isLeaf:true
       }))
     }
   }

    //更新options状态
    this.setState({
      options
    })

  }

  //选择某个一级项的回调
  //请求获取对应的二级列表并显示-----文档中的固定的形式
  loadData = async selectedOptions =>{
    //得到选中的一级项的数据对象
    const targetOption = selectedOptions[0]  //{value, label, isLeaf}
    //显示loading的效果
    targetOption.loading  = true

    //异步获取二级的分类列表数据
    const pCategoryId = targetOption.value
    const subCategorys = await this.getCategorys(pCategoryId)
    //隐藏loading
    targetOption.loading  = false

    if(!subCategorys || subCategorys.length === 0){ //没有二级分类
      targetOption.isLeaf = true
    }else{
      // 给option对象添加children, 就会自动显示为二级列表
      targetOption.children = subCategorys.map(c =>({
        label: c.name,
        value: c._id,
        isLeaf: true
      }))
    }

    //更新options列表数据
    this.setState({
      options:[...this.state.options]
    })

  }

  //提交时-----需要进行表单验证
  submit = () => {
    this.props.form.validateFields(async (err,values) =>{
      if(!err){
        //读取所有上传图片文件名的数组
        const imgs = this.pwRef.current.getImgs()
        // 读取富文本内容(html格式字符串)
        const detail = this.editorRef.current.getDetail()

        //提交上去 需要一个product对象，传参也需要一个它 {name, desc, price, categoryId, pCategoryId, detail, imgs}
        const {name, desc, price, categoryIds} = values
        let pCategoryId , categoryId

        if(categoryIds.length === 0){
          pCategoryId = '0';
          categoryId = categoryIds[0]
        }else{
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1]
        }
        //添加与更新的produce 相差一个_id
        const product = {name, desc, price, categoryId, pCategoryId, detail, imgs}
        //更新的标识，有值就是更新，他的id值是当前的id,当前传过来的product的id
        if(this.isUpdate){
          product._id = this.product._id
        }
        const result = await reqAddOrUpdateProduct(product)
        if(result.status === 0){
          message.success(this.isUpdate? '更新成功':'添加数据成功')
        }

        console.log('验证通过',values)
      }
    })
  }
  


  componentWillMount(){
    this.product  = this.props.location.state || {}  //保存商品对象
    this.isUpdate = !!this.product._id //保存是否是更新的标识，两个！！，是将他强制变为布尔值
  }

  componentDidMount(){
    this.getCategorys('0') //获取一级分类列表的显示
  }
  
  render() {
    const { getFieldDecorator } = this.props.form
    const  { product, isUpdate }  = this

    //读取指定的product
    if(product._id){//此时_id里面有值，说明是修改的

      if(product.pCategoryId === '0'){ //说明修改的是一级列表，要显示的是一级列表
        product.categoryIds = [ product.categoryId ]
      }else{
        product.categoryIds = [ product.pCategoryId, product.categoryId ]
      }//此时是显示一级与二级的列表

    }else{  //此时是添加的情况,添加时，是不需要有任何显示的
      product.categoryIds = []
    }

    const title = (
      <span>
        <IsButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{ fontSize: 20 }} />
        </IsButton>
        {isUpdate? "更新商品" : "添加商品"}
      </span>
    )

    // 指定form的item布局的对象
    const formLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    }

    return (
      <Card title={title}>
        <Form {...formLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  { required: true, message: '商品名称必须输入' }
                ]
              })(
                <Input placeholer='请输入商品名称' />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  { required: true, message: '商品描述必须输入' }
                ]
              })(
                <TextArea placeholder="请输入商品描述" autosize/>
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '商品价格必须输入' },
                  { validator: this.validatePrice}
                ]
              })(
                <Input type='number' placeholer='请输入商品价格' addonAfter='元'/>
              )
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: product.categoryIds,
                rules: [
                  { required: true, message: '商品分类必须指定' },
                  
                ]
              })(
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}  //是显示一级与二级列表的,多级联动
                />
              )
            }
            
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
          </Item>
          <Item
            label="商品详情"
            wrapperCol = {{ span: 18 }}
          >
            <RichTextEditor ref={this.editorRef} detail={product.detail}/>
          </Item>
          <Button type='primary' onClick={this.submit}>提交</Button>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)
