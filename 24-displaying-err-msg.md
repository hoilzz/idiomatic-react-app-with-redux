# 24 displaying err msg

API 요청은 가끔 실패한다. 이 상황을 fake API client에서 `throw`를 통해  시뮬레이션 돌려서 rejected Promise를 리턴한다. 우리 앱에서는, loading indicator가 사라지지 않는다. 왜냐하면 `isFetching` flag가 `true`이기 때문이다. 하지만 해당 `receiveTodos` action은 일어나지 않는다. `false`로 다시 세팅하기 때문이다.

## Fixing It

action creator 파일을 정리하자.

`requestTodos` action은 `fetchTodos` 밖에서 절대 사용되지 않는다.
- `requestTodos` 객체 리터럴로 내부에 임베드
- `fetchTodos` 내부에 `receiveTodos`를 복붙하여 동일한 동작을 할 수 있음
- `Promise.then`에 2번째 인자로 rejection handler를 추가하자

```javascript
return api.fetchTodos(filter).then(
  response => {
    dispatch({
      type: 'RECEIVE_TODOS',
      filter,
      response,
    })
  },
  error => {

  }
)
```

## Renaming Actions for Clarity

`fetchTodos` action creator가 몇몇 action을 dispatch 하기 때문에, 일관성을 위해 rename 하자.

- todo 요청: `REQUEST_TODOS`는 `FETCH_TODOS_REQUEST`
- todo 요청 성공: `RECEIVE_TODOS`는 `FETCH_TODOS_SUCCESS`
- todo 요청 실패: error 핸들러 내부에 `FETCH_TODOS_FAILURE`

`error` 핸들러는 2개의 추가 데이터를 전달 받음
- `filter`
- `message`

위 2가지 데이터는 `error.message`에서 read할 수 있다. fallback으로 `Something went Wrong`을 사용할거다.

_updated fetchTodos return_
```javascript
return api.fetchTodos(filter).then(
  response => {
    dispatch({
      type: 'FETCH_TODOS_SUCCESS',
      filter,
      response,
    })
  },
  error => {
    dispatch({
      type: 'FETCH_TODOS_FAILURE',
      filter,
      message: error.message || 'Something went wrong'
    });
  }
)
```

이제 `fetchTodos` action creator는 모든 케이스를 처리할 수 있다. old action creator를 지우자. (`requestTodos`, `receiveTodos`)

## Updating Our Reducer

action type 변경했으니까 reducer로 바꾸자.
- `ids` reducer는 `RECEIVE_TODOS`가 아닌 `FETCH_TODOS_SUCCESS`를 처리
- `isFetching` 리듀서는 `REQUEST_TODOS` 대신에 `FETCH_TODOS_REQUEST`를, `RECEIVE_TODOS` 대신에 `FETCH_TODOS_SUCCESS`를 처리
- `false`를 리턴하여 loading indicator가 stuck 되지 않도록 `FETCH_TODOS_FAILURE`를 처리해야한다.
- `byId`도 마찬가지

