/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { connect } from 'formik';
import useSWR from 'swr';

import { SignUpForm } from '../../../interfaces';
import formModels from '../Schema/FormModel';
import { TextInput, CheckBoxInput } from '../FormFields';
import PostAvatar from '../../Posts/PostAvatar';

const { githubUsername, github: githubModel, githubOwnership } = formModels;

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
      gridTemplateColumns: '100%',
      '& .MuiFormHelperText-root': {
        fontSize: '0.9em',
        color: 'black',
      },
      '& .MuiFormLabel-root': {
        color: 'black',
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
  const [username, setUsername] = useState(values.githubUsername);
  const [inputTimeout, setInputTimeout] = useState(setTimeout(() => {}, 0));

  const { data: github, error } = useSWR(
    values.githubUsername ? `${gitHubApiUrl}/${values.githubUsername}` : null,
    async (u) => {
      try {
        const response = await fetch(u);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      } catch (err) {
        throw err;
      }
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    clearTimeout(inputTimeout);

    // Update githubUsername 1000ms after input change
    setInputTimeout(
      setTimeout(() => {
        setFieldValue('githubUsername', e.target.value);
      }, 1000)
    );
  };

  useEffect(() => {
    if (error) {
      setFieldValue('github', {}, true);
    }

    if (github) {
      setFieldValue(
        'github',
        {
          username: github.login,
          avatarUrl: github.avatar_url,
        },
        true
      );
    }
  }, [github, error, setFieldValue]);

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
              helperText={!!error && githubModel.invalidErrorMsg}
              onChange={handleInputChange}
              value={username}
            />
          </div>
          {!error && github && (
            <div className={classes.avatarPreview}>
              <PostAvatar name={github.login} blog={github.avatar_url} img={github.avatar_url} />
              <h2 className={classes.username}>{github.login}</h2>
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
