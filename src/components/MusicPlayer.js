import React from "react";
import QueuedSongList from "./QueuedSongList";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  CardMedia,
} from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext, Pause } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { songContext } from "../App";
import { useQuery } from "@apollo/client";
import { GET_QUEUED_SONGS } from "../graphql/queries";
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: "0px 15px",
  },
  content: {
    flex: "1 0 auto",
  },
  thumbnail: {
    width: 150,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

function MusicPlayer() {
  const { data, loading, error } = useQuery(GET_QUEUED_SONGS);
  const { state, dispatch } = React.useContext(songContext);
  const [played, setPlayed] = React.useState(0);
  const [seeking, setSeeking] = React.useState(false);
  const [playedSeconds, setPlayedSeconds] = React.useState(0);
  const [positionInQueue, setPositionInQueue] = React.useState(0);
  const reactPlayerRef = React.useRef();
  const classes = useStyles();

  // Enables MusicPlayer to begin playing next song in queue once current song ends
  React.useEffect(() => {
    const songIndex = data.queuedSongs.findIndex(
      (song) => song.id === state.song.id
    );
    setPositionInQueue(songIndex);
  }, [data.queuedSongs, state.song.id]);

  // Updates the songs' positions in queue and stages upcoming song for player
  React.useEffect(() => {
    const nextSong = data.queuedSongs[positionInQueue + 1];
    // Check for value slightly less than 1 due to 'step' being set to 0.01 in slider properties...
    if (played >= 0.99 && nextSong) {
      setPlayed(0);
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }, [data.queuedSongs, played, dispatch, positionInQueue]);

  function handleTogglePlay() {
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleSliderChange(event, newValue) {
    setPlayed(newValue);
  }

  function handleSeekMouseDown() {
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    reactPlayerRef.current.seekTo(played);
  }

  function formatDuration(seconds) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  }

  function handlePlayPreviousSong() {
    const previousSong = data.queuedSongs[positionInQueue - 1];
    if (previousSong) {
      dispatch({ type: "SET_SONG", payload: { song: previousSong } });
    }
  }

  function handlePlayNextSong() {
    const nextSong = data.queuedSongs[positionInQueue + 1];
    if (nextSong) {
      dispatch({ type: "SET_SONG", payload: { song: nextSong } });
    }
  }
  return (
    <>
      <Card variant="outlined" className={classes.container}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h3">
              {state.song.title}
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {state.song.artist}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton onClick={handlePlayPreviousSong}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={handleTogglePlay}>
              {/* checks state: if isPlaying = true, show pause button. otherwise show play button */}
              {state.isPlaying ? (
                <Pause className={classes.playIcon} />
              ) : (
                <PlayArrow className={classes.playIcon} />
              )}
            </IconButton>
            <IconButton onClick={handlePlayNextSong}>
              <SkipNext />
            </IconButton>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              {formatDuration(playedSeconds)}
            </Typography>
          </div>
          <Slider
            value={played}
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={handleSliderChange}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
        {/* the 'onProgress' property is a callback function from ReactPlayer
        allowing user to interact with the music player's slider */}
        <ReactPlayer
          ref={reactPlayerRef}
          onProgress={({ played, playedSeconds }) => {
            if (!seeking) {
              setPlayed(played);
              setPlayedSeconds(playedSeconds);
            }
          }}
          url={state.song.url}
          playing={state.isPlaying}
          hidden
        />
        <CardMedia className={classes.thumbnail} image={state.song.thumbnail} />
      </Card>
      <QueuedSongList queuedSongs={data.queuedSongs} />
    </>
  );
}

export default MusicPlayer;
