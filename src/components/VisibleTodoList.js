import React from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleTodo, fetchTodos } from '../actions';
import { getVisibleTodos } from '../reducers';
// import { fetchTodos } from '../api';
import TodoList from './TodoList';

class VisibleTodoList extends React.Component {
  static propTypes = {
    filter: string,
    onTodoClick: func,
    fetchTodos: func,
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
    const { filter, fetchTodos } = this.props;
    fetchTodos(filter);
  }
  // render todolist에 props다 주입
  render() {
    return <TodoList {...this.props} />;
  }
}

const mapStateToProps = (state, { params }) => {
  const filter = params.filter || 'all';
  console.log('filter: ', filter);
  return {
    todos: getVisibleTodos(state, filter),
    filter,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      onTodoClick: toggleTodo,
      fetchTodos,
    }
  )(VisibleTodoList)
);
