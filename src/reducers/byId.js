// public API가 아니기 때문에 state, action을 받을 필요 없수다.
// export const getTodo = (state, action) => {
//   return state[action.id];
// };
// 내부 selector이기 때문에, action이 아닌 id 를 받음
export const getTodo = (state, id) => state[id];

const byId = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_SUCCESS': {
      const nextById = { ...state };
      action.response.forEach(todo => {
        nextById[todo.id] = todo;
      });

      return {
        ...state,
        ...nextById,
      };
    }
    case 'ADD_TODO_SUCCESS': {
      return {
        ...state,
        [action.reponse.id]: action.response,
      };
    }
    default:
      return state;
  }
};

export default byId;
