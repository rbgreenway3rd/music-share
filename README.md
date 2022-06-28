# Music Share App

This is a music sharing application built for learning GraphQL and Apollo, as well as for practicing MaterialUI and React fundamentals.

## Functionality

SimpliToons is a music player application that allows a user to paste either a YouTube or SoundCloud URL into the search bar and, if the URL is valid and points to a playable song, the user will be prompted to fill out a form to provide the song's title and artist. This enables the user to save songs to their dashboard, enabling them to play a song just by clicking the play button. The user can also construct a queue from their saved songs. The app's music player will automatically begin playing the next song in the queue once the current song has finished playing.

### Note on functionality:

This application has semi-full CRUD functionality. A user can: CREATE data by saving songs, READ that data by having saved songs rendered to the dashboard, UPDATE the data by adding and/or removing songs from the current queue, and DELETE data by clicking the 'delete' button next to a song - removing it from either the queue or the dashboard entirely.
However, due to how the database was constructed, multiple users cannot be created, therefore there is currently no functionality for creating a profile or logging in. This application 'remembers' some data through the use of the browser's localStorage.

#### Tech-stack:

JavaScript,
ReactJs,
Apollo,
GraphQL,
MaterialUI (using emotion),
"subscriptions-transport-ws" (for WebSocket based subscriptions)

see pacakge.json for all dependencies...
NOTE: some dependencies listed may be deprecated as I was learning what to use and how as I built the applicaiton
