import React from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleTodo } from '../actions';
import { getVisibleTodos } from '../reducers';
import { fetchTodos } from '../api';
import TodoList from './TodoList';

class VisibleTodoList extends React.Component {
  static propTypes = {
    filter: string,
    onTodoClick: func,
    receiveTodos: func,
  };
  // cmd일 때 fetchTodo
  componentDidMount() {
    fetchTodos(this.props.filter).then(todos =>
      console.log(this.props.filter, todos)
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      fetchTodos(this.props.filter).then(
        todos => console.log(this.props.filter, todos) // eslint-disable-line no-console
      );
    }
  }
  // render todolist에 props다 주입
  render() {
    return <TodoList {...this.props} />;
  }
}

const mapStateToProps = (state, { params }) => {
  const filter = params.filter || 'all';
  return {
    todos: getVisibleTodos(state, filter),
    filter,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { onTodoClick: toggleTodo,  }
  )(VisibleTodoList)
);
