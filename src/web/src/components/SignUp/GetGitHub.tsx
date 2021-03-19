import { useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import PostAvatar from '../Posts/PostAvatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      backgroundColor: theme.palette.background.default,
      width: '100%',
    },
    container: {
      display: 'grid',
      gridTemplateAreas: '1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      color: theme.palette.text.primary,
      width: '100%',
      height: '50vh',
      // backgroundColor: 'yellow',
    },
    infoContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
    },
    inputsContainer: {
      width: '100%',
    },
    avatarPreview: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
    },
    inputs: {
      margin: '1em 0',
    },
    formInput: {
      marginTop: '.2em',
      fontSize: '1.5em',
    },
    formInputLabel: {
      fontSize: '2em',
    },
    formLabel: {
      fontSize: '1.5em',
    },
    formControlLabel: {
      fontSize: '1.5em',
    },
  })
);

const GetGitHub = () => {
  const classes = useStyles();
  // I think this state should be on the parent like the others. not sure. it's up to you Duc.
  const [userAgree, setUserAgree] = useState({
    agree: false,
  });

  // lock the person here until no error exist.
  const error = ['agree'].filter((v) => v).length !== 1;

  const handleChange = () => {};

  const { agree } = userAgree;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1>GitHub and Display Name</h1>
        <h2>Enter your GitHub user name and your display name.</h2>
        <h2>
          Your display name will be your name on Telescope System.
          <br /> It will be displayed in all of your posts and interactions with other users inside
          Telescope’s ecosystem.{' '}
        </h2>

        <div className={classes.infoContainer}>
          <div className={classes.inputsContainer}>
            <TextField
              fullWidth
              id="standard-basic"
              label="GitHub Username"
              className={classes.inputs}
              InputProps={{
                classes: {
                  input: classes.formInput,
                },
              }}
              InputLabelProps={{
                classes: {
                  root: classes.formInputLabel,
                },
              }}
            />
            <TextField
              fullWidth
              id="standard-basic"
              label="Display Name"
              className={classes.inputs}
              InputProps={{
                classes: {
                  input: classes.formInput,
                },
              }}
              InputLabelProps={{
                classes: {
                  root: classes.formInputLabel,
                },
              }}
            />
          </div>

          <div className={classes.avatarPreview}>
            <h1>Avatar Preview</h1>
            {/* DISPLAY THE DISPLAY NAME */}
            {/* <PostAvatar name={displayName} /> */}
            <PostAvatar name="" postURL="" />
          </div>
        </div>
        <FormControl required error={error} component="fieldset">
          <FormLabel component="legend" className={classes.formLabel}>
            I declare that I’m the owner and the maintainer of the GitHub account provided:
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={agree} name="agree" onChange={handleChange} />}
              label={<h1 className={classes.formControlLabel}>Yes</h1>}
            />
          </FormGroup>
          {error && <FormHelperText>Field Required.</FormHelperText>}
        </FormControl>
      </div>
    </div>
  );
};

export default GetGitHub;
