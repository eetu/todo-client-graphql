import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import { Todo as TodoType } from './app';
import styles from './todo.css';

interface TodoProps {
  todo: TodoType;
  onEdit: (todo: TodoType) => void;
}

const Todo: React.FunctionComponent<TodoProps> = (props: TodoProps) => {
  const { todo, onEdit } = props;

  const textArea = React.useCallback((node: HTMLTextAreaElement) => {
    node?.focus();
    node?.select();
  }, []);

  const [edit, setEdit] = React.useState<boolean>(false);

  return (
    <div
      className={styles.container}
      onClick={() => {
        setEdit(true);
      }}
    >
      <span className={styles.closeIcon}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </span>
      {edit ? (
        <textarea
          tabIndex={1}
          ref={textArea}
          onBlur={() => setEdit(false)}
          value={todo.message}
          onChange={element => {
            onEdit({
              ...todo,
              message: element.target.value,
            });
          }}
        ></textarea>
      ) : (
        todo.message
      )}
    </div>
  );
};

export default Todo;
