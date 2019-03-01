# 14. fetching data on route change

`VisibleTodoList` 컴포넌트는 `connect`와 `withRouter`로 인해 생성된다.
`fetchTodos` API 쓰기 적절한 곳은 `componentDidMount()`다. 이 함수를 사용하기 위해 class 컴포넌트를 만들자.

## Creating new react component

## adding lifecycle hooks

컴포넌트가 마운트 될 때, 현재 필터에서 todos 를 가져온다. 필터를 prop 으로 직접 이용 가능한 점은 편리하다. params 에서 filter 를 계산하여 `mapStateToProps`를 변경한다. 하지만 return 객체의 하나로 전달할 것이다. 그래서 이제는 filter 와 todos 를 visibleTodoList 에서 얻을 수 있다.

mapStateToProps.js

```javascript
const mapStateToProps = (state, { params }) => {
  const filter = params.filter || 'all';
  return {
    todos: getVisibleTodos(state, filter),
    filter,
  };
};
```

```javascript
class VisibleTodoList extends Component {
  componentDidMount() {
    fetchTodos(this.props.filter).then(todos =>
      console.log(this.props.filter, todos)
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      fetchTodos(this.props.filter).then(todos =>
        console.log(this.props.filter, todos)
      );
    }
  }
}
```

## summary

- filter가 바뀔 때마다, 컴포넌트에서 API 요청하기 위해 mapStateToProps에 같이 내려줌
- 첫 렌더링 떄 fetchTodos 하고, prevProps 와 비교하여 filter 가 변경될 때마다 fetch 하기위해 class component 로 변경
