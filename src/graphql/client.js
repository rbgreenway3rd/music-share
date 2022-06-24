import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { gql } from "@apollo/client";
import { GET_QUEUED_SONGS } from "./queries";

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
  typeDefs: gql`
    type Song {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    input SongInput {
      id: uuid!
      title: String!
      artist: String!
      thumbnail: String!
      duration: Float!
      url: String!
    }

    type Query {
      queuedSongs: [Song]!
    }

    type Mutation {
      addOrRemoveFromQueue(input: SongInput!): [Song]!
    }
  `,

  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS,
        });
        if (queryResult) {
          const { queuedSongs } = queryResult;
          const isInQueue = queuedSongs.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queuedSongs.filter((song) => song.id !== input.id)
            : [...queuedSongs, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queuedSongs: newQueue },
          });
          return newQueue;
        }
        return [];
      },
    },
  },
});

// Deprecated
// client.writeData({
//   data: {
//     queuedSongs: [],
//   },
// });

const hasQueue = Boolean(localStorage.getItem("queuedSongs"));

client.writeQuery({
  query: gql`
    query getQueuedSongs {
      queuedSongs
    }
  `,
  data: {
    queuedSongs: hasQueue
      ? JSON.parse(localStorage.getItem("queuedSongs"))
      : [],
  },
});

export default client;
