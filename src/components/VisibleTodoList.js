import React from 'react';
import { string, func, bool } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleTodo, fetchTodos, requestTodos } from '../actions';
import {
  getVisibleTodos,
  getIsFetching,
  getErrorMessage,
} from '../reducers';
// import { fetchTodos } from '../api';
import TodoList from './TodoList';
import FetchError from './FetchError';

class VisibleTodoList extends React.Component {
  static propTypes = {
    filter: string,
    onTodoClick: func,
    fetchTodos: func,
    isFetching: bool,
    requestTodos: func,
  };
  // cmd일 때 fetchTodo
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData();
    }
  }

  fetchData() {
    console.log('aaa');
    const { filter, fetchTodos, requestTodos } = this.props;
    fetchTodos(filter).then(() => console.log('done'));
  }
  // render todolist에 props다 주입
  render() {
    const { isFetching, errorMessage, todos } = this.props;
    if (errorMessage && !todos.length) {
      return (
        <FetchError
          message={errorMessage}
          onRetry={() => this.fetchData()}
        />
      );
    }
    {
      return isFetching && !todos.length ? (
        <p>Fetching..!!</p>
      ) : (
        <TodoList {...this.props} />
      );
    }
  }
}

const mapStateToProps = (state, { params }) => {
  const filter = params.filter || 'all';
  return {
    todos: getVisibleTodos(state, filter),
    errorMessage: getErrorMessage(state, filter),
    isFetching: getIsFetching(state, filter),
    filter,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      onTodoClick: toggleTodo,
      fetchTodos,
      requestTodos,
    }
  )(VisibleTodoList)
);
