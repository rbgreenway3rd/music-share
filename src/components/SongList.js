import React from "react";
import {
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import { Pause, PlayArrow, Save } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useMutation, useSubscription } from "@apollo/client";
import { GET_SONGS } from "../graphql/subscriptions";
import { songContext } from "../App";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

function SongList() {
  const { data, loading, error } = useSubscription(GET_SONGS);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    console.log(error);
    return <div>Error fetching songs</div>;
  }

  return (
    <div>
      {data.songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(3),
  },
  songInfoContainer: {
    display: "flex",
    alignItems: "center",
  },
  songInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  thumbnail: {
    objectFit: "cover",
    width: 140,
    height: 140,
  },
}));

function Song({ song }) {
  const { id } = song;
  const classes = useStyles();
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem(
        "queuedSongs",
        JSON.stringify(data.addOrRemoveFromQueue)
      );
    },
  });
  const { state, dispatch } = React.useContext(songContext);
  const [currentSongPlaying, setCurrentSongPlaying] = React.useState(false);
  const { title, artist, thumbnail } = song;

  React.useEffect(() => {
    const isSongPlaying = state.isPlaying && id === state.song.id;
    setCurrentSongPlaying(isSongPlaying);
  }, [id, state.song.id, state.isPlaying]);

  function handleTogglePlay() {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } },
    });
  }
  return (
    <Card className={classes.container}>
      <div className={classes.songInfoContainer}>
        <CardMedia image={thumbnail} className={classes.thumbnail} />
        <div className={classes.songInfo}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body1" component="p" color="textSecondary">
              {artist}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={handleTogglePlay} size="small" color="primary">
              {currentSongPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={handleAddOrRemoveFromQueue}
              size="small"
              color="secondary"
            >
              <Save />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;
