import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://api.thegraph.com/subgraphs/name/your-subgraph-name', // Replace with your actual subgraph URL
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
