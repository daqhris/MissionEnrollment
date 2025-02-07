import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

let apolloClientInstance: ApolloClient<any> | null = null;

console.log('[Apollo] Initializing Apollo Client configuration...');

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_EAS_EXPLORER_URL}/graphql`,
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

function createApolloClient() {
  console.log('[Apollo] Creating Apollo Client instance...');

  try {
    if (!apolloClientInstance) {
      apolloClientInstance = new ApolloClient({
        link: from([errorLink, retryLink, httpLink]),
        cache: new InMemoryCache({
          addTypename: true,
          typePolicies: {
            Query: {
              fields: {
                attestations: {
                  merge(existing = [], incoming) {
                    return [...incoming];
                  },
                },
              },
            },
          },
        }),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
          },
          query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
          },
        },
        connectToDevTools: process.env.NODE_ENV === 'development'
      });
      console.log('[Apollo] Apollo Client instance created successfully');
    }
    return apolloClientInstance;
  } catch (error) {
    console.error('[Apollo] Error creating Apollo Client:', error);
    throw error;
  }
}

export const apolloClient = createApolloClient();

console.log('[Apollo] Apollo Client configuration complete');
