import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { Todo } from './app';
import Loader from './loader';
import TodoComponent from './todo';
import styles from './todos.css';

interface TodosProps {
  todos: Todo[];
  onLoadMore: () => void;
  onEdit: (editedTodo: Todo) => void;
  onRemove: (removedTodo: Todo) => void;
  totalCount: number;
}

const Todos: React.FunctionComponent<TodosProps> = (props: TodosProps) => {
  const { todos, onLoadMore, onEdit, onRemove, totalCount } = props;

  return (
    <>
      <ul className={styles.ul}>
        <InfiniteScroll
          loadMore={() => onLoadMore()}
          hasMore={todos.length < totalCount}
          loader={
            <li key="loader">
              <Loader />
            </li>
          }
        >
          {todos.map((todo: Todo) => (
            <li className={styles.li} key={todo.nodeId}>
              <TodoComponent todo={todo} onEdit={onEdit} onRemove={onRemove} />
            </li>
          ))}
        </InfiniteScroll>
      </ul>
    </>
  );
};

export default Todos;
