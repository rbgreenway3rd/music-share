import { Grid, useMediaQuery } from "@mui/material";
import React from "react";
import AddSong from "./components/AddSong";
import Header from "./components/Header";
import MusicPlayer from "./components/MusicPlayer";
import SongList from "./components/SongList";
import songReducer from "./Reducer";

export const songContext = React.createContext({
  song: {
    id: "0a4764cf-e9bc-47ee-b732-74ad510c104a",
    title: "Gnossienne No.3",
    artist: "Erik Satie",
    thumbnail: "http://img.youtube.com/vi/3c_RU2NcJ9c/0.jpg",
    url: "https://www.youtube.com/watch?v=3c_RU2NcJ9c&ab_channel=DistantMirrors",
    duration: 265,
  },
  isPlaying: false,
});

function App() {
  const initialSongState = React.useContext(songContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);
  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <songContext.Provider value={{ state, dispatch }}>
      <Header />

      <Grid container spacing={3}>
        <Grid
          style={{
            paddingTop: greaterThanSm ? 80 : 10,
          }}
          item
          xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  position: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70,
                }
              : {
                  position: "fixed",
                  width: "100%",
                  left: 0,
                  bottom: 0,
                }
          }
          item
          xs={12}
          md={5}
        >
          <MusicPlayer />
        </Grid>
      </Grid>
    </songContext.Provider>
  );
}

export default App;
