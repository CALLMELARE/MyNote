# Redux 使用指南(基础篇)

## Action

* `Action` 是把数据从应用传到 `store` 的有效载荷
* 它是 store 数据的唯一来源
* 一般来说你会通过 `store.dispatch()` 将 action 传到 store

`Action`本质上是 JavaScript 普通对象。我们约定，`action` 内必须使用一个字符串类型的`type`字段来表示将要执行的动作。多数情况下，`type`会被定义成字符串常量。

* 因为数据是存放在数组中的，所以我们通过下标 index 来引用特定的任务
* 而实际项目中一般会在新建数据的时候生成唯一的 ID 作为数据的引用标识
* 我们应该尽量减少在`action`中传递的数据

### action创建函数

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

## Reducer

Reducers指定了应用状态的变化如何响应`actions`并发送到`store`的，记住`actions`只是描述了有事情发生了这一事实，并没有描述应用如何更新`state`。

### 设计state结构

通常，除了主要功能性数据外，这个`state`树还需要存放其它一些数据，以及一些 UI 相关的 state。这样做没问题，但尽量把这些数据与 UI 相关的`state`分开。

### action处理

保持`reducer`纯净非常重要。永远不要在`reducer`里做这些操作：

* 修改传入参数
* 执行有副作用的操作，如API请求和路由跳转
* 调用非纯函数，如`Date.now()`或`Math.random()`

> tips:
> **只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。**

## Store

* `action`用来描述“发生了什么”
* `reducers`根据`action`更新`state`
* `store`把`action`和`reducers`联系在一起

> Tips:
> **Redux 应用只有一个单一的 store**。
> 当需要拆分数据处理逻辑时，应该使用 `reducer` 组合而不是创建多个 `store`

### store的基本功能

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

### 发起action

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

## 数据流

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

## 搭配React使用

`Redux`和`React`之间没有关系。`Redux`支持`React`、`Angular`、`Ember`、`jQuery`甚至纯 `JavaScript`。

### 安装 React Redux

```bash
npm install --save react-redux
```

如果你用`<script>`标签的方式引入UMD包，那么它会在全局抛出`window.ReactRedux`对象

### 容器组件Smart/Container Components和展示组件Dumb/Presentational Components

|                 |        展示组件         |         容器组件          |
| :-------------: | :---------------------: | :-----------------------: |
|      作用       |      描述如何展现       |       描述如何运行        |
| 直接使用`Redux` |           否            |            是             |
|    数据来源     |         `props`         |    监听 `Redux state`     |
|    数据修改     | 从 `props` 调用回调函数 |  向 Redux 派发 `actions`  |
|    调用方式     |          手动           | 通常由 `React Redux` 生成 |

技术上讲你可以直接使用`store.subscribe()`来编写容器组件。但不建议这么做的原因是无法使用`React Redux`带来的性能优化。也因此，不要手写容器组件，而使用`React Redux`的`connect()`方法来生成。

### 设计组件层次结构

#### 展示组件

* `TodoList` 用于显示 `todos` 列表。
  * `todos`: `Array` 以 { `text`, `completed` } 形式显示的 `todo` 项数组。
  * `onTodoClick(index: number)` 当 `todo` 项被点击时调用的回调函数。
* `Todo` 一个 `todo` 项。
  * `text`: string 显示的文本内容。
  * `completed`: `boolean`，`todo` 项是否显示删除线。
  * `onClick()` 当 `todo` 项被点击时调用的回调函数。
* `Link` 带有 `callback` 回调功能的链接
  * `onClick()` 当点击链接时会触发
* `Footer` 一个允许用户改变可见 `todo` 过滤器的组件。
* `App` 根组件，渲染余下的所有内容。

这些组件只定义外观并不关心数据来源和如何改变。**传入什么就渲染什么**。

#### 容器组件

为了实现状态过滤，需要实现`FilterLink`的容器组件来渲染`Link`并在点击时触发对应的 `action`

* `VisibleTodoList` 根据当前显示的状态来对 `todo` 列表进行过滤，并渲染 `TodoList`
* `FilterLink` 得到当前过滤器并渲染 `Link`
* `filter`: `string` 就是当前过滤的状态

#### 其它组件

* `AddTodo` 含有 `Add` 按钮的输入框

### 组件编码

我们会使用函数式无状态组件除非需要本地 `state` 或生命周期函数的场景。这并不是说展示组件必须是函数 -- 只是因为这样做容易些。如果你需要使用本地 `state`，生命周期方法，或者性能优化，可以将它们转成 `class`

#### `components/Todo.js`

```js
import React from 'react';
import PropTypes from 'prop-types';
const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)
Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}
export default Todo;
```

#### `components/TodoList.js`

```js
import React from 'react';
import PropTypes from 'prop-types';
import Todo from './Todo';
const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map((todo, index) => (
      <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
    ))}
  </ul>
)
TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired
}
export default TodoList;
```

#### `components/Link.js`

```js
import React from 'react';
import PropTypes from 'prop-types';
const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }
  return (
    <a
      href=""
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}
Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}
export default Link;
```

#### `components/Footer.js`

```js
import React from 'react'
import FilterLink from '../containers/FilterLink'
const Footer = () => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
    {', '}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </p>
)
export default Footer;
```

### 实现容器组件

使用 `connect()` 前，需要先定义 `mapStateToProps` 这个函数来指定如何把当前 `Redux store state` 映射到展示组件的 `props` 中。例如，`VisibleTodoList` 需要计算传到 `TodoList` 中的 `todos`，所以定义了根据 `state.visibilityFilter` 来过滤 `state.todos` 的方法，并在 `mapStateToProps` 中使用。

```js
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}

const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

除了读取 `state` ，容器组件还能分发 `action` 。类似的方式，可以定义 `mapDispatchToProps()` 方法接收 `dispatch()` 方法并返回期望注入到展示组件的 `props` 中的回调方法。例如，我们希望 `VisibleTodoList` 向 `TodoList` 组件中注入一个叫 `onTodoClick` 的 `props` ，还希望 `onTodoClick` 能分发 `TOGGLE_TODO` 这个 `action` ：

```js
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}
```

最后，使用 `connect()` 创建 `VisibleTodoList` ，并传入这两个函数

```js
import { connect } from 'react-redux';

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList;
```

#### `containers/FilterLink.js`

```js
import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink;
```

#### `containers/VisibleTodoList.js`

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

### 将容器放到一个组件

#### `components/App.js`

```js
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
```

### 传入 Store

建议的方式是使用指定的 React Redux 组件 `<Provider>` 来让所有容器组件都可以访问 `store`，而不必显式地传递它。只需要在渲染根组件时使用即可。

#### `index.js`

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## 参考

* [完全理解 redux](https://github.com/brickspert/blog/issues/22)
* [redux中文文档](http://cn.redux.js.org/docs/introduction)
