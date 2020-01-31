import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Trianglify from 'trianglify';

import styles from './app.css';
import Todos from './todos';

const allTodos = gql`
  query Todos($cursor: Cursor) {
    allTodos(first: 1, after: $cursor) {
      totalCount
      edges {
        node {
          id
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

export interface Todo {
  id: string;
  message: string;
  updatedAt: string;
  createdAt: string;
}

const App: React.StatelessComponent = () => {
  const { loading, error, data, fetchMore } = useQuery(allTodos);

  const todos = data?.allTodos?.edges.map((e: { node: Todo }) => e.node) || [];

  const containerElement = React.useCallback((node: HTMLDivElement) => {
    const pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    if (node !== null) {
      node.appendChild(pattern.canvas());
    }
  }, []);

  return (
    <div className={styles.container} ref={containerElement}>
      <Todos
        todos={todos}
        onEdit={todo => console.log('t', todo)}
        onLoadMore={() => {
          fetchMore({
            variables: {
              cursor: data.allTodos.pageInfo.endCursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.allTodos.edges;
              const pageInfo = fetchMoreResult.allTodos.pageInfo;

              return newEdges.length
                ? {
                    // Put the new comments at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
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
