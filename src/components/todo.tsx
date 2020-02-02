import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDebounceCallback } from '@react-hook/debounce';
import classnames from 'classnames';
import * as React from 'react';

import { Todo as TodoType } from './app';
import styles from './todo.css';

interface TodoProps {
  todo: TodoType;
  onEdit: (todo: TodoType) => void;
  onRemove: (todo: TodoType) => void;
}

const Todo: React.FunctionComponent<TodoProps> = (props: TodoProps) => {
  const { todo, onEdit, onRemove } = props;

  const textArea = React.useCallback((node: HTMLTextAreaElement) => {
    node?.focus();
    node?.select();
  }, []);

  const [edit, setEdit] = React.useState<boolean>(false);

  const [message, setMessage] = React.useState(todo.message || '');

  React.useEffect(
    useDebounceCallback(() => {
      onEdit({
        ...todo,
        message,
      });
    }, 500),
    [message],
  );

  return (
    <div
      className={classnames(styles.todo, {
        [styles.todoEdit]: edit,
      })}
      onClick={() => {
        setEdit(true);
      }}
    >
      <span
        className={styles.closeIcon}
        onClick={event => {
          event.stopPropagation();
          onRemove(todo);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </span>
      {edit ? (
        <textarea
          tabIndex={1}
          ref={textArea}
          onBlur={event => {
            const message = event.currentTarget.value;
            onEdit({
              ...todo,
              message,
            });
            setEdit(false);
          }}
          value={message}
          onChange={element => {
            setMessage(element.target.value);
          }}
          onKeyDown={event => {
            if (event.keyCode === 13 && !event.shiftKey) {
              const message = event.currentTarget.value;
              onEdit({
                ...todo,
                message,
              });
              setEdit(false);
            }
          }}
        ></textarea>
      ) : (
        <>
          {todo.message ? (
            <span className={styles.text}>{todo.message}</span>
          ) : (
            <span className={styles.emptyText}>click to add text</span>
          )}
        </>
      )}
    </div>
  );
};

export default Todo;
