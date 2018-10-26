# normalizing api response with normalizr

`byId` 리듀서는 현재 server action을 다르게 처리해야한다. 왜냐하면 다른 response shape을 가졌기 때문이다.

예를 들어, `FETCH_TODOS_SUCCESS` action response는 todos의 배열이다. 이 배열은 한번 이터레이션 돌고 next state에 한번 머지되어야한다.

`ADD_TODO_SUCCESS`의 response는 막 추가된 single todo다. 이 single todo는 다른 방식으로 머지되어야한다.

every new API call에 대한 새로운 케이스를 추가하는 거 대신에, **response를 노멀라이즈하자. 그래서 response 모양은 항상 동일하게 하자.**

## schema.js 만들기

action 디렉토리 내부에 schema.js 만들자

첫번째는 `todo` object를 위한 스키마다. 정규화된 response에서 dictionary로 `todo`를 지정한다.

두번째는 `arrayOfTodos` 스키마다. `todo` object의 배열을 포함하는 응답에 해당한다.

## Updating our Action Creators

actions/index.js에서 `normalize` 함수를 임포트하자. schema file에서 정의한 schemas들을 모두 namespacew import 하자.

`FETCH_TODOS_SUCCESS` callback 내부에서, normalized response를