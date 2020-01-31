import * as React from 'react';

import { Todo } from './app';
import TodoComponent from './todo';
import styles from './todos.css';

interface TodosProps {
  todos: Todo[];
  onLoadMore: () => void;
  onEdit: (editedTodo: Todo) => void;
}

const Todos: React.FunctionComponent<TodosProps> = (props: TodosProps) => {
  const { todos, onLoadMore, onEdit } = props;

  return (
    <>
      <ul className={styles.ul}>
        {todos.map((todo: Todo) => (
          <li className={styles.li} key={todo.id}>
            <TodoComponent todo={todo} onEdit={onEdit} />
          </li>
        ))}
      </ul>
      <button onClick={onLoadMore}>more</button>
    </>
  );
};

export default Todos;
