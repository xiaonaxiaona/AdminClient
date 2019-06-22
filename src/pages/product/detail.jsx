import React, { Component } from 'react'
import {Card, List, Icon} from 'antd'

import IsButton from '../../components/isbutton'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

export default class ProductDetail extends Component {
  state = {
    cName1 : '',
    cName2 : ''
  }


  //发送请求，获取分类名
  async componentDidMount(){
    const {pCategoryId, categoryId} = this.props.location.state
    //一级分类的商品
    if(pCategoryId==='0'){

      const result = await reqCategory(categoryId)
      const cName1 = result.data.name

      this.setState({
        cName1
      })

    }else{  //二级分类的商品

       /* 
      用await发多个请求:
        第二个请求是在第一请求成功后才发送
      */
      // const result1 = await reqCategory(pCategoryId)
      // const result2 = await reqCategory(categoryId) 
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name

      /* 
      使用Promise.all()一次发送多个请求
      只有当都成功了, 整体才成功, 并返回包含所有成功数据的数组
      */

      //同时发多个请求，一次请求成功，才成功
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name

      this.setState({
        cName1,
        cName2
      })
    }
   
  }

  render() {
    //读取跳转时，传递过来的state数据
    const {name, desc, price, imgs, detail} = this.props.location.state
    const {cName1, cName2} = this.state

    //此时的回退用 goBack() 或者.push('/product')  都可以
    const title = (
      <span>
        <IsButton onClick={()=>{this.props.history.goBack()}}>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
        </IsButton>
        &nbsp;&nbsp;商品详情
      </span>
    )

    return (
      <Card title={title}>
        <List className='detail'>
          <List.Item>
            <span className='detail-left'>商品名称:</span>
            <span>{name}</span>
          </List.Item>
          <List.Item>
            <span className='detail-left'>商品描述:</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className='detail-left'>商品价格:</span>
            <span>{price}元</span>
          </List.Item>
          <List.Item>
            <span className='detail-left'>所属分类:</span>
            <span>{cName1} --> {cName2}</span>
          </List.Item>
          <List.Item>
            <span className='detail-left'>商品图片:</span>
            <span>
              {
                imgs.map(img => <img key={img} src={BASE_IMG_URL + img} style={{width:150}}></img>)                               
              }
            </span>
          </List.Item>
          <List.Item>
            <span className='detail-left'>商品详情:</span>
            <div dangerouslySetInnerHTML={{__html:detail}}></div>
          </List.Item>
        </List>
      </Card>
    )
  }
}
