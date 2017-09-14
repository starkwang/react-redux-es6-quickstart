# 用React+Redux+ES6写一个最傻瓜的Hello World

最近Redux+React似乎在前端圈子里越来越火了，然而即使是官方的文档也只给出了一个[TodoMVC的范例](http://camsong.github.io/redux-in-chinese/docs/basics/ExampleTodoList.html)，里面上百行的代码以及过多的新概念，对于很多初学者（包括我）来说依然很复杂。

google百度搜了搜，也一直没有找到简单傻瓜如同Hello World的快速入门，所以今天花了一点时间写了个最最简单的DEMO（真的是最最简单了/w\）：

[点这里看DEMO](http://starkwang.github.io/react-redux-es6-quickstart/)

Github：https://github.com/starkwang/react-redux-es6-quickstart



## 一、开发环境搭建 ##

### 1、webpack
首先我们需要webpack这个打包工具（如果你已经有了就无视吧）：

```
sudo npm install -g webpack
```

### 2、依赖包
创建一个文件夹，随便叫什么名字，比如`redux-test`。

```
mkdir redux-test && cd redux-test
```
然后用npm安装以下依赖包：

 1. babel-loader
 2. react
 3. react-dom
 4. react-redux
 5. redux

### 3、Webpack的配置文件
这个项目中需要把ES6、JSX转换为浏览器可运行的ES5语法，所以我们需要使用webpack及其babel-loader来进行转换、打包。这里我们默认`index.jsx`是入口文件。

```js
// webpack.config.js
module.exports = {
    entry: './index.jsx',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['es2015','react']
            }
        }]
    }
};

```
把这个`webpack.config.js`放到目录下即可。

### 4、HTML
首先的首先，我们需要一张HTML页面，这个页面里有一个id为`root`的`div`作为我们应用的根节点：

```html
<!DOCTYPE html>
<html>

<head>
  <title>React-Redux Hello World</title>
</head>

<body>
  <div id="root"></div>
</body>

<script type="text/javascript" src="bundle.js"></script>

</html>

```
## 二、开始写代码吧 ##

网上React的入门教学实在太多，不再赘述。

关于Redux，请务必读完[中文文档](http://camsong.github.io/redux-in-chinese/docs/basics/index.html)的入门部分。

我们现在主要是要实现DEMO中的效果：
[点这里看DEMO][2]
1、点击文字的时候，文字会在“Hello”和“Stark”中来回切换；
2、点击按钮的时候，文字会变为“You just click button”。

------------
**以下代码都是在同一个文件index.jsx中！**

**以下代码都是在同一个文件index.jsx中！**

**以下代码都是在同一个文件index.jsx中！**

### 0、引入依赖包

我们需要react的本体、react-dom的`render`方法、redux的`createStore`和`bindActionCreators`方法，以及react-redux的`Provider`和`connect`方法
```js
import React from 'react';
import { render } from 'react-dom';
import { createStore,bindActionCreators } from 'redux';
import { Provider ,connect } from 'react-redux';
```

### 1、Action
显然我们要定义两种事件：“文字来回切换”、“按钮点击”。
```js
// action
// 我们这里并没有使用const来声明常量，实际生产中不推荐像下面这样做
function changeText(){
    return {
        type:'CHANGE_TEXT'
    }
}

function buttonClick(){
    return {
        type:'BUTTON_CLICK'
    }
}
```

### 2、Reducer
对于不同的action，对应的状态转换也不一样：

```js
// reducer

// 最初的状态是"Hello"
const initialState = {
    text: 'Hello'
}

function myApp(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_TEXT':
            return {
                text:state.text=='Hello'?'Stark':'Hello'
            }
        case 'BUTTON_CLICK':
            return {
                text: 'You just click button'
            }
        default:
            return {
                text:'Hello'
            }
    }
}
```

### 3、Store

Store是由Redux直接生成的：

```js
let store = createStore(myApp);
```

### 4、组件
这里一共有三个组件：文字组件`Hello`、按钮`Change`、以及它们的父组件`App`

```js
// Hello
class Hello extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.changeText();
    }

    render() {
        return (
            <h1 onClick={this.handleClick}> {this.props.text} </h1>
        );
    }
}
```


```js
// Change
class Change extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.buttonClick();
    }

    render() {
        return (
            <button onClick={this.handleClick} >change</button>
        );
    }
}
```

```js
// App
class App extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        //actions和text这两个props在第5步中会解释
        const { actions, text} = this.props;
        return (
            <div>
                <Hello actions={actions} text={text}/>
                <Change actions={actions}/>
            </div>
        );
    }
}
```

### 5、连接React组件和Redux

```js
// mapStateToProps的作用是声明，当state树变化的时候，哪些属性是我们关心的？
// 由于我们这个应用太小，只有一个属性，所以只有text这个字段。
function mapStateToProps(state) {
  return { text: state.text }
}

//mapDispatchToProps的作用是把store中的dispatch方法注入给组件
function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({changeText:changeText,buttonClick:buttonClick},dispatch)
    }
}

//这里实际上给了App两个props：text和actions，即第4步中的那段注释
App = connect(mapStateToProps,mapDispatchToProps)(App)
```

### 6、渲染我们的App

```js
// Provider是react-redux直接提供的
// store是我们在第3步中生成的

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
```

### 7、编译、打包
还记得安装的webpack和写好的配置文件吗？

直接在项目目录下执行：
```
webpack
```
然后就可以把`index.jsx`编译打包成`bundle.js`了


## 三、index.jsx源代码 ##

下面是index.jsx的完整源码，可以直接复制
```js
import React from 'react';
import {render} from 'react-dom';
import { createStore,bindActionCreators } from 'redux';
import { Provider ,connect} from 'react-redux';

// action
function changeText(){
    return {
        type:'CHANGE_TEXT'
    }
}

function buttonClick(){
    return {
        type:'BUTTON_CLICK'
    }
}

// reducer
const initialState = {
    text: 'Hello'
}
function myApp(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_TEXT':
            return {
                text:state.text=='Hello'?'Stark':'Hello'
            }
        case 'BUTTON_CLICK':
            return {
                text: 'You just click button'
            }
        default:
          return {
            text:'Hello'
        };
    }
}

// store
let store = createStore(myApp);


class Hello extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.changeText();
    }

    render() {
        return (
            <h1 onClick={this.handleClick}> {this.props.text} </h1>
        );
    }
}

class Change extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.actions.buttonClick();
    }

    render() {
        return (
            <button onClick={this.handleClick} >change</button>
        );
    }
}

class App extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        const { actions, text} = this.props;
        return (
            <div>
                <Hello actions={actions} text={text}/>
                <Change actions={actions}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
  return { text: state.text }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({changeText:changeText,buttonClick:buttonClick},dispatch)
    }
}

App = connect(mapStateToProps,mapDispatchToProps)(App)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)


```


## 四、总结 ##
如果你还能坚持活着看到这里，你一定在吐槽，“卧槽这种简单到连jQuery都懒得用的小玩具竟然也要写100+行代码？”

没错，Redux作为Flux架构的一个变种，本来就是“适合大型应用”的，它解决的是当应用复杂度上升时，数据流混乱的问题，而并非直接提升你的代码效率。

有时候用Angular、jQuery甚至原生js就几行代码的事，在Redux下却会分为action、reducer、store三步来进行。虽然效率低下，但是当项目越来越大时，可以很好地管理项目的复杂度。
