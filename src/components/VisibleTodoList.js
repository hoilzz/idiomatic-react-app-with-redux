import React from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleTodo } from '../actions';
import TodoList from './TodoList';
import { getVisibleTodos } from '../reducers/';
import { fetchTodos } from '../reducers';

class VisibleTodoList extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData();
    }
  }

  fetchData() {
    const { fetchTodos, filter } = this.props;
    fetchTodos(filter);
  }

  render() {
    return <TodoList {...this.props} />;
  }
}

const mapStateToProps = (state, { match: { params } }) => {
  const filter = params.filter || 'all';
  return {
    todos: getVisibleTodos(state, filter),
    filter,
  };
};

VisibleTodoList.propTypes = {
  filter: string.isRequired,
  fetchTodos: func.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    { onTodoClick: toggleTodo, fetchTodos }
  )(VisibleTodoList)
);
