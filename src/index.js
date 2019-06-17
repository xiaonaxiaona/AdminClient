/* 
入口js
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // 自定义的模块引入必须以.开头
import './api'  

import memoryUtils from './utils/memoryUtils'
import {getUser} from './utils/storageUtils'

//const user = JSON.parse(localStorage.getItem('USER-KEY') || '{}')
const user = getUser()
memoryUtils.user = user

ReactDOM.render(<App />, document.getElementById('root'));


