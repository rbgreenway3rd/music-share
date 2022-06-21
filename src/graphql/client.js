import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { SubscriptionClient } from "subscriptions-transport-ws";
// // SECURITY VULNERABILITY !!!
const HASURA_SECRET =
  "6yujEtCHqZBKxcPUruzbTyIihx96KwpcHg8FTiryfVlUDMh4JilG8s0Ok1Ry56SM";
// // Secret key hardcoded into project for simplicity
// // Normally, database needs to be configured to properly handle true authentication

// const httpLink = createHttpLink({
//   uri: "https://graphql-music-share.hasura.app/v1/graphql",
// });

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       "x-hasura-admin-secret": HASURA_SECRET,
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

const clientLink = new WebSocketLink(
  new SubscriptionClient("wss://graphql-music-share.hasura.app/v1/graphql", {
    options: {
      reconnect: true,
    },
  })
);
const client = new ApolloClient({
  headers: {
    "x-hasura-admin-secret": HASURA_SECRET,
  },
  link: clientLink,
  cache: new InMemoryCache(),
});

export default client;
