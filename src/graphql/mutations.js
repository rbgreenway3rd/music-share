import { gql } from "@apollo/client";

// The "!" following each data-type means that field cannot be null
// This aids in server-side form validation
// Look at "handleAddSong()" function in "AddSong.js" to see how this is used

export const ADD_OR_REMOVE_FROM_QUEUE = gql`
  mutation addOrRemoveFromQueue($input: SongInput!) {
    addOrRemoveFromQueue(input: $input) @client
  }
`;

export const ADD_SONG = gql`
  mutation addSong(
    $title: String!
    $artist: String!
    $thumbnail: String!
    $duration: Float!
    $url: String!
  ) {
    insert_songs(
      objects: {
        title: $title
        artist: $artist
        thumbnail: $thumbnail
        duration: $duration
        url: $url
      }
    ) {
      affected_rows
    }
  }
`;
