import { Grid, useMediaQuery } from "@mui/material";
import React from "react";
import AddSong from "./components/AddSong";
import Header from "./components/Header";
import MusicPlayer from "./components/MusicPlayer";
import SongList from "./components/SongList";

function App() {
  const greaterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const greaterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <>
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
    </>
  );
}

export default App;
