# loading indicator 노출하기

비동기로 데이터 가져올 때, 어떤 시각적 신호를 표시하고 싶다. `render` 함수에 fetching 여부를 알려주는 조건을 추가할거다. todo 보여줄게 없으면 `visibltTodoList`에서 render 함수에 loading indicator 를 리턴할거다.

`todos`와 `isFetching`을 prop 에서 가져오자. `todos`는 list 에 전달할 유일한 extra prop 이기 때문에, spread operator 사용하는거 대신에 `todos`를 직접 전달하자.

`mapStateToProps` 함수는 이미 `visibleTodos`를 계산하고 props 에 `todos`를 포함시킨다. `getIsFetching`은 현재 app 의 `state`와 fetched 된 todo 에 대한 `filter`를 받는다.

```javascript
render() {
  const { isFetching, toggleTodo, todos } = this.props;
  if(isFetching && !todos.length) {
    return <p>Loading</p>
  }

  return (
    <TodoList
      todos={todos}
      onTodoClick={toggleTodo}
    />
  );
}

const mapStateToProps = (state, { params }) => {
  const filter = params.filter || 'all';
  return {
    isFetching: getIsFetching(state, filter),
    todos: getVisibleTodos(state, filter),
    filter,
  }
}
```

## Updating the root reducer

root reducer 로 스위치해서, `getIsFetching`이라는 selector 함수를 추가하자. `state`와 `filter`를 인자로 받고, 리스트의 fetching 여부를 찾기 위해 다른 셀렉터에 위임한다.

`state.listByFilter`로부터 리스트의 상태를 전달한다. 하지만 `getIsFetching`을 아직 사용하지 않는다.

```javascript
export const getIsFetching = (state, filter) =>
  fromList.getIsFetching(state.listByFilter[filter]);
```

## Updating createList.js

`getIsFetching` selector 를 생성하기 전에, list 의 상태 모양을 수정해야한다. `state`가 id 의 배열이라고 가정하는 대신, 배열을 속성으로 포함하는 객체라고 가정한다

`state.isFething`을 읽는 `getIsFetching`이라는 셀렉터를 추가하자.

```javascript
export const getIds = state => state.ids;
export const getIsFetching = state => state.isFetching;
```

리듀서는 2 개 field 들의 추적해야한다. 그래서 복잡한 기존 `createList` reducer 보다는 `ids`라고 이름을 바꾸자. 왜냐하면 `id`s 를 관리하기 때문이다.

## creating isFetching

일단, `combineReducers`를 import 문을 추가하자.

state 의 isFetching flag 를 관리하는 `isFetching` reducer 를 생성하자.

초기값은 false 다. 만약 `REQUEST_TODOS`라면, `true`를 리턴하도록 하자. 왜냐면 fetching 을 시작했기 떄문이다.

createList 의 `filter`인자와 일치하지 않는 filter 를 가진 action 을 무시하는 `ids` 리듀서도 동일한 조건을 포함하자.

```javascript
const isFetching = (state = false, action) => {
  if (filter !== action.filter) {
    return state;
  }
  switch (action.type) {
    case 'REQUEST_TODOS':
      return true;
    case 'RECEIVE_TODOS':
      return false;
    default:
      return state;
  }
};
```

`REQUEST_TODOS` action 을 처리하지만 그것을 어느곳에서도 dispatching 하지 않는다.

## Adding the 'REQUEST_TODOS' action creator

requestTodos 라고 불리는 함수를 추가하자.

- filter 를 인자로 받음
- `REQUEST_TODOS` action 을 나타내는 action object 를 리턴

```javascript
export const requestTodos = filter => ({
  type: 'REQUEST_TODOS',
  filter,
});
```
## Updating fetchData inside VisibleTodoList

props에서 `requestTodos`를 destructure할 수 있다. 그러면 비동기인 `fetchTodos`를 시작하기 전에 올바르게 호출할 수 있다.

```javascript
fetchData() {
  const { filter, fetchTodos, requestTodos } = this.props;
  requestTodos(filter);
  fetchTodos(filter);
}
```

## Summary

fetching 여부에 따라 loading indicator 렌더하기
- isFetching이라는 값을 이용하기
  - store에서 관리하기 위해 새로추가
  - byId보다는 listByFilter를 fetching 할 때와 관련있으므로 이 서브리듀서에 isFetching 필드를 추가.
    - createList 에서 각 filter마다 isFetching 필드를 추가해야 하기 때문에 여기에 추가
    - 그럼 기존에 기본으로 return 하던 얘를 ids라는 이름을 가진 리듀서로 리턴
    - 그래서 최종적으로 combineReducer({ids, isFetching})
  - 이 필드의 값을 결정하기 위해 action type, action creator 추가
  - 컴포넌트에서 이 값을 가져오기 위해 root reducer에 public API selector 추가.

