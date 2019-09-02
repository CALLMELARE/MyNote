# Redux 使用指南

## 基础篇

### Action

* `Action` 是把数据从应用传到 `store` 的有效载荷
* 它是 store 数据的唯一来源
* 一般来说你会通过 `store.dispatch()` 将 action 传到 store

`Action`本质上是 JavaScript 普通对象。我们约定，`action` 内必须使用一个字符串类型的`type`字段来表示将要执行的动作。多数情况下，`type`会被定义成字符串常量。

* 因为数据是存放在数组中的，所以我们通过下标 index 来引用特定的任务
* 而实际项目中一般会在新建数据的时候生成唯一的 ID 作为数据的引用标识
* 我们应该尽量减少在`action`中传递的数据

#### `action`创建函数

**Action 创建函数**就是生成 action 的方法

在Redux中的`action 创建函数`只是简单的返回一个`action`

```js
function addTodo(text) {
  return {
    type: ADD_ITEM,
    text
  }
}
```

Redux 中只需把`action`创建函数的结果传给`dispatch()`方法即可发起一次`dispatch`过程

```js
dispatch(addTodo(text))
dispatch(completeTodo(index))
```

或者创建一个 被绑定的`action`创建函数来自动`dispatch`

```js
const boundAddTodo = text => dispatch(addTodo(text))
const boundCompleteTodo = index => dispatch(completeTodo(index))
```

然后直接调用它们

```js
boundAddTodo(text);
boundCompleteTodo(index);
```

`bindActionCreators()`可以自动把多个`action`创建函数绑定到`dispatch()`方法上。

### Reducer

Reducers指定了应用状态的变化如何响应`actions`并发送到`store`的，记住`actions`只是描述了有事情发生了这一事实，并没有描述应用如何更新`state`。

#### 设计`state`结构

通常，除了主要功能性数据外，这个`state`树还需要存放其它一些数据，以及一些 UI 相关的 state。这样做没问题，但尽量把这些数据与 UI 相关的`state`分开。

#### `action`处理

保持`reducer`纯净非常重要。永远不要在`reducer`里做这些操作：

* 修改传入参数
* 执行有副作用的操作，如API请求和路由跳转
* 调用非纯函数，如`Date.now()`或`Math.random()`

> tips:
> **只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。**

### Store

* `action`用来描述“发生了什么”
* `reducers`根据`action`更新`state`
* `store`把`action`和`reducers`联系在一起

> Tips:
> **Redux 应用只有一个单一的 store**。
> 当需要拆分数据处理逻辑时，应该使用 `reducer` 组合而不是创建多个 `store`

#### `store`的基本功能

* 维持应用的 state
* `getState`() 方法获取 `state`
* `dispatch(action)` 方法更新 `state`
* `subscribe(listener)` 注册监听器
* `subscribe(listener)` 返回的函数注销监听器

根据已有的`reducer`来创建`store`是非常容易的。
`combineReducers()`可以将多个`reducer`合并成为一个。
现在我们将其导入，并传递`createStore()`。

```js
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```

`createStore()`的第二个参数是可选的, 用于设置`state`初始状态。
服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。

```js
let store = createStore(todoApp, window.STATE_FROM_SERVER)
```

#### 发起`action`

```js
import {
  addTodo,
  toggleTodo,
  setVisibilityFilter,
  VisibilityFilters
} from './actions'

// 打印初始状态
console.log(store.getState())

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(() => console.log(store.getState()))

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// 停止监听 state 更新
unsubscribe()
```

### 数据流

**严格的单向数据流**是Redux架构的设计核心。
Redux 应用中数据的生命周期遵循下面 4 个步骤：

* *调用`store.dispatch(action)`

```js
{ type: 'LIKE_ARTICLE', articleId: 42 }
{ type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } }
{ type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

* Redux store 调用传入的`reducer`函数。
Store会把两个参数传入`reducer`： 当前的`state`树和`action`

```js
// 当前应用的 state（todos 列表和选中的过滤器）
let previousState = {
  visibleTodoFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Read the docs.',
      complete: false
    }
  ]
}

// 将要执行的 action（添加一个 todo）
let action = {
  type: 'ADD_TODO',
  text: 'Understand the flow.'
}

// reducer 返回处理后的应用状态
let nextState = todoApp(previousState, action)
```

注意 reducer 是**纯函数**。它仅仅用于计算下一个 state。它应该是完全可预测的：多次传入相同的输入必须产生相同的输出。它不应做有副作用的操作，如 API 调用或路由跳转。这些应该在 dispatch action 前发生。

* 根`reducer`应该把多个子`reducer`输出合并成一个单一的`state`树

Redux 原生提供`combineReducers()`辅助函数，来把根`reducer`拆分成多个函数，用于分别处理`state`树的一个分支。

* Redux store 保存了根 `reducer` 返回的完整 `state` 树。

所有订阅 `store.subscribe(listener)` 的监听器都将被调用；监听器里可以调用 `store.getState()` 获得当前 state

## 参考

* [完全理解 redux](https://github.com/brickspert/blog/issues/22)
* [redux中文文档](http://cn.redux.js.org/docs/introduction)
