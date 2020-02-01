import { useMutation, useQuery } from '@apollo/react-hooks';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWindowSize } from '@react-hook/window-size';
import { gql } from 'apollo-boost';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Trianglify from 'trianglify';

import styles from './app.css';
import Todos from './todos';

const allTodos = gql`
  query Todos($cursor: Cursor) {
    allTodos(orderBy: ID_DESC, first: 10, after: $cursor) {
      totalCount
      edges {
        node {
          nodeId
          message
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const createTodo = gql`
  mutation CreateTodo {
    createTodo(input: { todo: { message: "" } }) {
      todoEdge {
        node {
          nodeId
          message
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const updateTodo = gql`
  mutation UpdateTodo($nodeId: ID!, $message: String!) {
    updateTodo(input: { nodeId: $nodeId, todoPatch: { message: $message } }) {
      todo {
        nodeId
        message
        createdAt
        updatedAt
      }
    }
  }
`;

const deleteTodo = gql`
  mutation DeleteTodo($nodeId: ID!) {
    deleteTodo(input: { nodeId: $nodeId }) {
      todo {
        nodeId
      }
    }
  }
`;

export interface Todo {
  nodeId: string;
  message: string;
  updatedAt: string;
  createdAt: string;
}

const App: React.StatelessComponent = () => {
  const { data, fetchMore } = useQuery(allTodos);

  const [addTodo] = useMutation(createTodo, {
    update(
      cache,
      {
        data: {
          createTodo: { todoEdge },
        },
      },
    ) {
      const readData: any = cache.readQuery({ query: allTodos });
      const writeData = {
        ...readData,
        allTodos: {
          ...readData.allTodos,
          totalCount: readData.allTodos.totalCount + 1,
          edges: [todoEdge].concat(readData.allTodos.edges),
        },
      };
      cache.writeQuery({
        query: allTodos,
        data: writeData,
      });
    },
  });

  const [removeTodo] = useMutation(deleteTodo, {
    update(
      cache,
      {
        data: {
          deleteTodo: { todo },
        },
      },
    ) {
      const readData: any = cache.readQuery({ query: allTodos });
      const writeData = {
        ...readData,
        allTodos: {
          ...readData.allTodos,
          totalCount: readData.allTodos.totalCount - 1,
          edges: readData.allTodos.edges.filter((e: any) => e.node.nodeId !== todo.nodeId),
        },
      };
      cache.writeQuery({
        query: allTodos,
        data: writeData,
      });
    },
  });

  const [editTodo] = useMutation(updateTodo);

  const todos = data?.allTodos?.edges.map((e: { node: Todo }) => e.node) || [];

  const [width, height] = useWindowSize(0, 0, {
    wait: 500,
  });

  const containerElement = React.useCallback(
    (node: HTMLDivElement) => {
      if (node !== null) {
        const pattern = Trianglify({
          width: window.innerWidth,
          height: window.innerHeight,
        });

        const oldCanvas = node.getElementsByTagName('canvas')[0];
        oldCanvas ? node.replaceChild(pattern.canvas(), oldCanvas) : node.appendChild(pattern.canvas());
      }
    },
    [width, height],
  );

  return (
    <div className={styles.container} ref={containerElement}>
      <button
        className={styles.addTodo}
        onClick={() => {
          addTodo();
        }}
      >
        <FontAwesomeIcon icon={faPlusCircle} size="3x" />
      </button>

      <Todos
        todos={todos}
        onEdit={todo => editTodo({ variables: { nodeId: todo.nodeId, message: todo.message } })}
        onRemove={todo => removeTodo({ variables: { nodeId: todo.nodeId } })}
        totalCount={data?.allTodos?.totalCount}
        onLoadMore={() => {
          if (!data) {
            return;
          }

          fetchMore({
            variables: {
              cursor: data.allTodos.pageInfo.endCursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.allTodos.edges;
              const pageInfo = fetchMoreResult.allTodos.pageInfo;

              return newEdges.length
                ? {
                    allTodos: {
                      __typename: previousResult.allTodos.__typename,
                      totalCount: previousResult.allTodos.totalCount,
                      edges: [...previousResult.allTodos.edges, ...newEdges],
                      pageInfo,
                    },
                  }
                : previousResult;
            },
          });
        }}
      />
    </div>
  );
};

export default hot(module)(App);
