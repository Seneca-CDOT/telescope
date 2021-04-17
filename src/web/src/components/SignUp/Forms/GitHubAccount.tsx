import { useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { connect } from 'formik';

import { SignUpForm } from '../../../interfaces';
import formModels from '../Schema/FormModel';
import { TextInput, CheckBoxInput } from '../FormFields';
import PostAvatar from '../../Posts/PostAvatar';

const { githubUsername, github, githubOwnership } = formModels;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      width: '100%',
      position: 'relative',
      minHeight: '100%',
    },
    container: {
      display: 'grid',
      gridTemplateAreas: '1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'start',
      width: '100%',
      position: 'absolute',
      minHeight: '100%',
      [theme.breakpoints.down(600)]: {
        width: '90%',
        marginLeft: '5%',
      },
    },
    titlePage: {
      fontSize: '1.5em',
    },
    subtitlePage: {
      fontSize: '1.1em',
      lineHeight: '1.8em',
    },
    infoContainer: {
      display: 'grid',
      gridTemplateColumns: '65% 35%',
      gridGap: '1%',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      width: '90%',
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr',
      },
    },
    inputsContainer: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '80% 20%',
      '& .MuiFormHelperText-root': {
        fontSize: '0.9em',
        color: 'black',
      },
      '& .MuiFormLabel-root': {
        color: 'black',
      },
    },
    button: {
      height: '35px',
      width: '50%',
      alignSelf: 'center',
      fontSize: '0.8em',
      background: '#121D59',
      color: '#A0D1FB',
      marginLeft: '5%',
      '&:hover': {
        color: 'black',
        border: '1px solid #121D59',
      },
      '&.Mui-disabled': {
        backgroundColor: 'inherit',
      },
    },
    avatarPreview: {
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      justifySelf: 'end',
      padding: '6%',
      borderRadius: '5px',
      [theme.breakpoints.down(600)]: {
        justifySelf: 'center',
        padding: '3%',
        marginTop: '5%',
      },
    },
    username: {
      fontSize: '1.1em',
    },
  })
);

const gitHubApiUrl = 'https://api.github.com/users';

const GitHubAccount = connect<{}, SignUpForm>((props) => {
  const classes = useStyles();
  const { values, setFieldValue } = props.formik;
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const controllerRef = useRef<AbortController | null>();

  const validateGit = async () => {
    if (!values.githubUsername) {
      setError('');
      setFieldValue('github', {}, true);
      return;
    }
    try {
      setValidating(true);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      const response = await fetch(`${gitHubApiUrl}/${values.githubUsername}`, {
        signal: controllerRef.current?.signal,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const res = await response.json();

      setFieldValue('github', {
        username: res.login,
        avatarUrl: res.avatar_url,
      });
      setError('');
    } catch (err) {
      console.error(err, 'Unable to get GitHub profile');

      setError('Unable to get GitHub profile');
      setFieldValue('github', {}, true);
    } finally {
      setValidating(false);
      controllerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1 className={classes.titlePage}>GitHub Account</h1>
        <h2 className={classes.subtitlePage}>Enter Github username and verify your profile</h2>
        <div className={classes.infoContainer}>
          <div className={classes.inputsContainer}>
            <TextInput
              label={githubUsername.label}
              name={githubUsername.name}
              error={!!error}
              helperText={error || github.invalidErrorMsg}
            />
            <Button className={classes.button} onClick={validateGit} disabled={validating}>
              Get profile
            </Button>
          </div>
          {!error && (
            <div className={classes.avatarPreview}>
              <PostAvatar
                name={values.github.username || values.displayName}
                blog={values.github.avatarUrl}
                img={values.github?.avatarUrl}
              />
              <h2 className={classes.username}>{values.github.username}</h2>
            </div>
          )}
        </div>
        <CheckBoxInput
          label={githubOwnership.label}
          name={githubOwnership.name}
          checked={values.githubOwnership}
        />
      </div>
    </div>
  );
});

export default GitHubAccount;
