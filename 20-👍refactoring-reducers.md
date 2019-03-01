# reducer 리팩토링하기

예전에, `visibilityFilter` reducer 를 제거했다.

그리고 root reducer 는 single `todos` redducer 만 결합하고 있다. `index.js`가 `todos`reducer 의 프록시로 행동하기 때문에,

- 우리는 `index.js`를 완전히 제거하고
- 그리고나서 `todos.js`에서 index.js 로 이름을 변경할거임. 최종적으로 `todos`는 new root reducer 로 만들거다.

루트 리듀서는 다음을 가진다.

- byId
- idsByFilter
  - allIds
  - activeIds
  - completeIds

몇몇 개를 분리된 파일로 만들어보자.

`byId` reducer 의 상태와 일치하는 곳에서, state 와 id 를 가지는 `getTodo` selector 로 export 되는 파일을 추가하자.

`index.js`로 돌아가서, default import 로 리듀서를 임포트할 수 있다.

```javascript
import byId, * as fromById from './byId;
```

이제 ID 를 관리하는 리듀서를 살펴보면, 코드가 `filter` 값을 제외하고 거의 일치하는 것을 알 수 있다.

## Creating createList

`filter`를 인자로 받는 `createList`를 생성하자

`createList`는

- 명시된 filter 로 `ids`를 처리하는 함수를 리턴
- 그래서 state 모양은 `배열`이다.

`allIds` 구현체를 복붙하고, `all` 리터럴을 `createList`의 `filter`인자로 바꾸자. 그래서 어떤 filter 든 생성할 수 있다.

```javascript
const createList = filter => {
  return (state = [], action) => {
    if (action.filter !== filter) {
      return state;
    }

    switch (action.type) {
      case 'RECEIVE_TODOS':
        return action.response.map(todo => todo.id);
      default:
        return state;
    }
  };
};
```

이제 `allIds`, `activeIds`, `completedIds` 리듀서 코드를 완전히 삭제하자.
대신에, `createList` 함수를 이용하는 리듀서를 생성하고 인자로 filter 를 전달하자.

`createList` 함수를 `createList.js`라는 파일에 작성하자.

**이제 selector 형태에서 state 를 접근하는 public API 를 추가하자.**
우리는 이거슬 `getIds`라고 부르고, list 상태를 리턴할 것이다.

### Finishing up

`index.js`로 돌아와서 `createList`와 named selector 를 import 하자.

```javascript
import createList, * as fromList from './createList';
```

`idsByFilter`에서 `listByFilter`로 이름을 다시 만들자. 왜냐하면 list 를 리턴하도록 구현했으니까
우리는 `getIds` 셀렉터를 사용할거다.

```javascript
export const getVisibleTodos = (state, filter) => {
  const ids = fromList.getIds(state.listByFilter[filter]);
  return ids.map(id => fromById.getTodo(state.byId, id));
};
```

`byId` 리듀서를 별개 파일로 만들었기 때문에, 이 리듀서는 단지 lookup table 이라는 가정을 하고싶지 않다.(뭔소리?) 이걸 염두해두고, `fromById.getTodo` selector 를 이용하여 state 와 해당 ID 를 내보내고 전달한다.

## summary

```
RootReducer
|-- byId : id를 key로 가지는 lookup table
|-- listByFilter : filter를 key로 가지는 리듀서
    |-- all
    |-- active
    |-- completed
```

_byId_

- getTodo: id 를 인자로 받아 todo 를 리턴

_listByFilter_

- getIds: filter 를 기준으로 ids state 에 접근할 수 있는 public API

---

- 리듀서의 read는 기본으로 필요하기 때문에 getXX selector를 구현
