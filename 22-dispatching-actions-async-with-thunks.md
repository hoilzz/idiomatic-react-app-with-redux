# dispatching actions async with thunks

현재 구현에서 loading indicator를 보여주기 위해, `fetchTodos`로 todos를 fetch하기 전에, `requestTodos` action을 디스패치한다. 만약 todos를 fetch하기 전에, `requestTodos`를 자동으로 dispatch 하도록 하면 더 좋을 거같다. 왜냐하면 걔네들은 각각 fire될 일이 없기 때문이다.

_visibltTodoList.js_ before

```javascript
fetchData() {
  const { filter, fetchTodos, requestTodos } = this.props;
  requestTodos(filter);
  fetchTodos(filter);
}
```

명백한 `requestTodos` dispatch를 컴포넌트에서 제거할 수 있다. 더이상 `requestTodos` action creator를 `export`할 필요가 없다.

우리의 목표는 fetch할 때마다 `requestTodos()`를 dispatch 하는 것이고 fetching을 종료했을 때 `receiveTodos()`를 dispatching 하는 것이다. 하지만 `fetchTodos` action creator는 `receiveTodos` action을 통해서만 resolve되고 있다.

## current fetchTodos action creator

```javascript
export const fetchTodos = filter =>
  api.fetchTodos(filter).then(response =>
    receiveTodos(filter, response)
  )
```

action Promise는 1개의 action으로 끝난다. 하지만 **일정 기간 동안 multiple action을 제공하는 추상화**를 원한다. Promise를 리턴하는 것보다 dispatch callback 인자를 받는 함수를 리턴하는 것이 더 나은 이유다.

**여튼 바꾸게 되면 비동기 작업 중 원하는 시점에 `dispatch()`를 여러번 호출하도록 하게 할 수 있다.** 시작에서 `requestTodos` action을 dispatch할 수 있고, 그러고나서 Promise가 resolve될 때 우리는 명시적으로 `receivdTodos`action을 dispatch 할 수 있다.

### Updated fetchTodos

```javascript
export const fetchTodos = filter => dispatch => {
  dispatch(requestTodos(filter));

  return api.fetchTodos(filter).then(response => {
    dispatch(receiveTodos(filter, response));
  })
}
```

위 함수로 바꾸면서 더 유연성을 줬다. Promise는 1개 async value만을 표현할 수 있기 때문에, `fetchTodos`는 이제 callback 인자를 가진 함수를 리턴할 수 있다. 그래서 async 동작 동안 multiple times 호출할 수 있다.

## Introducing Thunks

`fetchTodos`와 같은 **다른 함수에서 반환된 함수는 thunks**라고 한다. 이제 thunk를 이용하여 서포트하는 미들웨어를 구현하자.

### Updating configureStore.js

`configureStore.js` 내부에 `redux-promise`를 제거하자 그리고 `thunk`로 바꾸자.

`thunk` middleware는
- thunk를 dispatch하는데 서포트
- `store`, next middleware(`next`), `action`을 인자로 받는다

- 만약 `action`이 action을 대신한 함수라면, 우리는 이것을 함수 안에 주입 될 `dispatch` function을 원하는 thunk라고 가정한다. 이 경우에 우리는 `store.dispatch`로 action을 호출할 것이다.

- 그렇지 않으면, next middleware에 action을 전달하는 결과를 리턴한다.

### thunk middleware in configureStore.js

```javascript
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch) :
    next(action);
```

`configureStore`내부에 new thunk middleware를 미들웨어 배열에 추가하자.