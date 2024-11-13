import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

console.log('[Apollo] Initializing Apollo Client configuration...');

const httpLink = new HttpLink({
  uri: 'https://sepolia.easscan.org/graphql',
  credentials: 'omit',
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true
  },
  attempts: {
    max: 2,
    retryIf: (error, _operation) => {
      console.log('[Apollo] Retry attempt due to error:', error);
      return !!error;
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log('[Apollo] Error link triggered');

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
  return forward(operation);
});

console.log('[Apollo] Creating Apollo Client instance...');

export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
  },
  connectToDevTools: true
});

console.log('[Apollo] Apollo Client configuration complete');
