import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { IdGetterObj, InMemoryCache } from 'apollo-cache-inmemory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/app';

import './index.css';

interface todoObj extends IdGetterObj {
  nodeId: string | null;
}

const cache = new InMemoryCache({
  dataIdFromObject: (object: todoObj) => object.nodeId,
});

const client = new ApolloClient({
  uri: process.env.API_URL,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById('app'),
);

export default App;
