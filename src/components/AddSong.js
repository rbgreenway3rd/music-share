import React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, AddBoxOutlined } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useMutation } from "@apollo/client";
import { ADD_SONG } from "../graphql/mutations";
import ReactPlayer from "react-player";
import YouTubePlayer from "react-player/youtube";
import SoundCloudPlayer from "react-player/soundcloud";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  urlInput: {
    margin: theme.spacing(1),
  },
  addSongButton: {
    margin: theme.spacing(1),
  },
  dialog: {
    textAlign: "center",
  },
  thumbnail: {
    width: "90%",
  },
}));

const placeholderSong = {
  duration: 0,
  title: "",
  artist: "",
  thumbnail: "",
};

function AddSong() {
  const classes = useStyles();
  // "useMutation" will return an 'error' object on failure
  // Including the 'error' object here makes the data available throughout the "AddSong()" component
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [url, setUrl] = React.useState("");
  const [playable, setPlayable] = React.useState(false);
  const [song, setSong] = React.useState(placeholderSong);
  const [dialog, setDialog] = React.useState(false);

  function handleCloseDialog() {
    setDialog(false);
  }

  function getYouTubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundCloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            //duration returned in miliseconds, so we need to convert
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            //resizes returned thumbnail to ensure its big enough
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYouTubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundCloudInfo(nestedPlayer);
    }
    //spreads returned songData into state and adds url property to end
    setSong({ ...songData, url });
  }

  // handles updating 'song' state in 'Edit Song' form when adding song
  function handleChangeSongData(event) {
    const { name, value } = event.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  }

  // handles running 'ADD_SONG' mutation when form is submitted
  async function handleAddSong() {
    try {
      const { url, thumbnail, duration, title, artist } = song;
      await addSong({
        variables: {
          // if a field is not filled out, returns null
          // "ADD_SONG" mutation does not allow null values -> i.e.  server-side form validation
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          // The ".length" method not needed for 'duration' since its data-type is a float
          duration: duration > 0 ? duration : null,
          title: title.length > 0 ? title : null,
          artist: artist.length > 0 ? artist : null,
        },
      });
      handleCloseDialog();
      setSong(placeholderSong);
      setUrl("");
    } catch (error) {
      console.error(
        "Error adding song. Make sure all fields are filled out. Expand the error object below for more info"
      );
      console.dir(error);
    }
  }

  // Check if url points to playable song
  // 'canPlay() returns boolean
  React.useEffect(() => {
    const isPlayable =
      SoundCloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  // "console.dir(error)" prints an expandable 'error' object containing GraphQL info in console
  // console.dir(error);

  // Makes use of the 'error' properties in <TextField> within form
  // Using the optional chaining operator, "?", to check if an object and/or nested object exists
  function handleValidationError(field) {
    // See "console.dir(error)" to view the 'error' object's structure to understand this return statement
    return error?.graphQLErrors[0]?.extensions?.path.includes(field);
  }

  const { thumbnail, title, artist } = song;

  // FORM:
  // Validation handled on server side (Hasura)
  return (
    <div className={classes.container}>
      <Dialog
        className={classes.dialog}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img
            src={thumbnail}
            alt="Song thumbnail"
            className={classes.thumbnail}
          />
          <TextField
            value={title}
            onChange={handleChangeSongData}
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            error={handleValidationError("title")}
            // The helperText, "Please fill out field", will be displayed if "handleValidationError()" function returns 'True'
            helperText={
              handleValidationError("title") && "Please fill out field"
            }
          />
          <TextField
            value={artist}
            onChange={handleChangeSongData}
            margin="dense"
            name="artist"
            label="Artist"
            fullWidth
            error={handleValidationError("artist")}
            // The helperText, "Please fill out field", will be displayed if "handleValidationError()" function returns 'True'
            helperText={
              handleValidationError("artist") && "Please fill out field"
            }
          />
          <TextField
            value={thumbnail}
            onChange={handleChangeSongData}
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
            error={handleValidationError("thumbnail")}
            // The helperText, "Please fill out field", will be displayed if "handleValidationError()" function returns 'True'
            helperText={
              handleValidationError("thumbnail") && "Please fill out field"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSong} variant="outlined" color="primary">
            Add Song
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        className={classes.urlInput}
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        placeholder="Add Youtube or Soundcloud Url"
        fullWidth
        margin="normal"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={!playable}
        className={classes.addSongButton}
        onClick={() => setDialog(true)}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden={true} onReady={handleEditSong} />
    </div>
  );
}

export default AddSong;
