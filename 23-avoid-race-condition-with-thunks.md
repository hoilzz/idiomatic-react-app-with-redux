# 23 avoid race condition with thunks

fake API 에서 0.5 -> 5 초 delay 를 줬을 때, 문제가 있었다. 요청 시작하기 전에 탭 로딩 여부를 체크하지 않았다. 그래서 `receiveTodos` action 이 다시 시작되고 잠재적으로 경쟁 조건이 발생할 수 있다.

이걸 고치기 위해, **주어진 필터의 todos 를 이미 fetching 중이라는걸 알게 되면 `fetchTodos` action creator 에서 조기 종료**할 수 있다.

`fetchTodos` 내부에서, 현재 store state 와 filter 를 인자로 받는 `getIsFetching` selector 를 이용하여 fetching 여부를 판단하기 위해 `if`를 추가 할 것이다. 만약 `true`를 리턴하면, action dispatching 없이 thunk 에서 조기 종료할 것이다.

### Updating fetchTodos

```javascript
export const fetchTodos = filter => dispatch => {
  if (getIsFetching(getState(), filter)) {
    return;
  }
};
```

file 에 정의되지 않은 `getState()`를 이용한다. 얘는 `store` object 에 속해있다. 하지만 action creator 에서 직접 접근하지 않는다.

## Updating the thunk middleware

`thunk` middleware 에서 store.dispatch() 함수 뿐만 아니라 getState 도 inject 해보자. thunk action creator 내부에서 `dispatch`뒤에 2 번째 인자로 사용할 수 있다.

```javascript
export const fetchTodos = filter => (dispatch, getState) => {};
```

위 코드 변경으로, `fetchTodos` action creator 는 action 을 조건부로 dispatch 할 수 있다. 만약 app 을 실행하면, 3 가지 이상의 동시 요청(각 필터 유형에 하나씩)을 생성할 수 없습니다.

해당 `receiveTodos` 액션이 돌아왔을 때만 action`isFetching` flag 가 재설정됩니다. 그러고나서 new todos 에 대한 요청을 할 수 있다. 불필요한 네트워크 동작과 잠재적인 race condition 을 피할 수 있는 좋은 방식이다.

### Updating fetchTodos

thunk 의 리턴 값이 Promise 기 때문에, 즉시 resolve 되는 Promise 가 리턴 되도록 `return`문을 조기 변경할 것이다.

이거 할필요 없지만 calling code 에 편리하다.

```javascript
export const fetchTodos = (filter) => (dispatch, getState) => {
  if (getIsFetching(getState(), filter)) {
    return Promise.resolve();
  }
```

`thunk` middleware 는 그 자체로 Promise 를 사용하지 않는다. 하지만 해당 action creator 를 dispatching 하는 `return` 값이 될 수 있다.
