# server 에서 데이터 생성하기

- ## addTodo

...

## Updating the Add Todo Process

...

## Updating the byId reducer

look up table 에 todo 를 머지하기 위해 `byId` reducer 를 변경해야 한다.

`ADD_TODO_SUCCESS` action 에 대한 새로운 케이스를 추가하자.

- new version lookup table 생성하기 위해 spread operator 사용
  - action response ID key 아래에 action response 에서 읽은 새로운 todo 객체가 있다.

```javascript
// Inside reducers/byId.js
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_SUCCESS':
      const nextState = { ...state };
      action.response.forEach(todo => {
        nextState[todo.id] = todo;
      });
      return nextState;
    case 'ADD_TODO_SUCCESS': // Our new case
      return {
        ...state,
        [action.response.id]: action.response,
      };
    default:
      return state;
  }
};
```

그러나, list by filter 를 아직 업데이트 안했다. 그래서 여전히 all 은 3 개의 IDs 를 리스트에서만 가진다. 만약 다른 탭으로 이동하면, new todo 는 나타난다. 왜냐하면 그것의 ID 가 fetched IDs 리스트에 이제 포함됐기 때문이다. 비슷하게 만약 이전 탭으로 돌아간다면 이제 나타난다 왜냐하면 re-fetch 했기 때문이다.

## updating createList

각 탭에 대한 IDs 의 리스트는 `createList.js` 내부에 정의된 리듀서로 관리된다. `ADD_TODO_SUCCESS` action 을 처리하기 위해 `ids` reducer 를 업데이트해야한다.

todo 가 서버에 추가되어있다는 컨펌을 받았을 때, 기존 리스트에 새로 추가된 ID 가 있는 새로운 ID 목록을 리턴할 수 있다.

다른 action 과 달리, `ADD_TODO_SUCCESS`는 action object 에서 `filter` 프로퍼티를 가지지 못한다.

현재 `if(filter !== action.filter)`는 `ids`내부에서 체크할 수 없다. 이걸 대응해보자.

`FETCH_TODOS_SUCCESS`의 경우에, 만약 action 내부의 필터가 list 의 필터와 일치한다면 fetched Ids 를 변경할 것이다.

그러나, `ADD_TODO_SUCCESS`의 경우에 새롭게 추가된 todo 만 나타나기를 원한다. (except the completed filter) 왜냐하면 새롭게 추가된 todo 는 완료되지 않았기 떄문이다.

```javascript
const createList = (filter) => {
  const ids = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TODOS_SUCCESS':
        return filter === action.filter ?
          action.response.map(todo => todo.id) :
          state;
      case 'ADD_TODO_SUCCESS':
        return filter !== 'completed' ?
          [...state, action.response.id] :
          state;
      default:
        return state;
    }
  };
```

## Summary

todo 추가할 때 서버에서 추가된 todo 데이터를 내려준다.

- byId, listByFilter 리듀서 변경

- byId

  - ADD_TODO_SUCCESS action 에 대한 새로운 케이스 추가

- listByFilter
  - ADD_TODO_SUCCESS action 에 대한 케이스 추가
  - 이 때, listByFilter 의 다른 action 과 달리 filter 프로퍼티를 갖지 못한다.
  - filter 분기문을 fetch_todo_success 내부로 이동
  - add_todo_success 는 filter 가 completed 가 아닌 경우에만 response 의 todo 추가
