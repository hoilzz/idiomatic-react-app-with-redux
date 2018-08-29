const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (!state[action.id]) {
        return state[action.id];
      }
      return {
        ...state[action.id],
        completed: !state[action.id].completed,
      };
    default:
      return state;
  }
};

export default todo;
