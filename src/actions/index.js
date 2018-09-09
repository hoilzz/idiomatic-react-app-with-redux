import { v4 } from 'node-uuid';
import * as api from '../api';
import { getIsFetching } from '../reducers';

export const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response,
});

export const requestTodos = filter => ({
  type: 'REQUEST_TODOS',
  filter,
});

export const fetchTodos = filter => (dispatch, getState) => {
  if (getIsFetching(getState(), filter)) {
    return Promise.resolve();
  }
  dispatch(requestTodos(filter));
  return api.fetchTodos(filter).then(
    response => {
      dispatch({
        type: 'FETCH_TODOS_SUCCESS',
        filter,
        response,
      });
    },
    error => {
      dispatch({
        type: 'FETCH_TODOS_FAILURE',
        filter,
        message: error.message || 'Something went wrong',
      });
    }
  );
};

export const addTodo = text => ({
  type: 'ADD_TODO',
  id: v4(),
  text,
});

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id,
});
