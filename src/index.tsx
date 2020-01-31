import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/app';

import './index.css';

const client = new ApolloClient({
  uri: process.env.API_URL,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById('app'),
);

export default App;
