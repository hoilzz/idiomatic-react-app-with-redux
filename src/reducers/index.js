import { combineReducers } from 'redux';
import todos, * as fromTodos from './todos';
import visibilityFilter from './visibilityFilter';
import * as api from '../api/';

const todoApp = combineReducers({
  todos,
  visibilityFilter,
});

export default todoApp;

export const getVisibleTodos = (state, filter) => {
  console.log(state);
  return fromTodos.getVisibleTodos(state.todos, filter);
};

const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response,
});

export const fetchTodos = filter =>
  api
    .fetchTodos(filter)
    .then(response => receiveTodos(filter, response));
