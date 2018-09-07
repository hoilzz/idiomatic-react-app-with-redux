# 15. fetched data로 action dispatch 하기

- componentDidMount()에서 fetchData라는 이름의 common code로 추출하기
- componentDidUpdate에서 `filter`가 변경될 때마다 호출하기

## Updating fetchData()

fetch한 todos로 callback prop을 호출하는 `receiveTodos`를 만들어보자.

```javascript
fetchData() {
  fetchTodos(this.props.filter).then(todos =>
    this.props.receiveTodos(todos)
  );
}
```

## receiveTodos() 구현하기

- server response를 가지는 action을 생성
- `response` field와 `RECEIVE_TODOS` type을 리턴

_action/index.js_
```javascript
export const receiveTodos = (response) => ({
  type: 'RECEIVE_TODOS',
  resposne
})
```

- 이 액션을 처리하는 리듀서는 response와 일치하는 filter가 뭔지 알아야함
- 그래서 `filter` 인자를 추가하고 action object에 전달할 것이다.

```javascript
export const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response,
});
```

## Updating VisibleTodoList component with filter

action creator를 통해 filter를 전달하여 `fetchData`함수를 업데이트 해야한다.

props로부터 receiveTodos와 filter를 가져오기 위해, ES6 destructuring syntax를 사용했다. **여기서 `filter`를 즉시 destructure한건 왕중요하다.** 왜냐하면 콜백이 호출할 당시에, `this.props.filter`는 바뀔 수도있다. 왜냐하면 유저가 마우스 클릭을 통해 필터를 변경했을 수도 있기 때문이다.

```javascript
fetchData() {
  const { filter, receiveTodos } = this.props;
  fetchTodos(filter).then(todos =>
    receiveTodos(filter, todos)
  );
}
```

## Summary

store의 filter를 connect를 통해 가져온다. 이 filter는 api 요청시에 필요하다. filter의 값은 url의 path가 달라질 때마다 값을 읽어오는데, 위 예제 코드와 같이 미리 destructure를 하여 side-effect가 없도록 값을 읽어오도록 하자.