import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { connect } from 'formik';
import PostAvatar from '../../Posts/PostAvatar';

import { SignUpForm } from '../../../interfaces';

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
      gridTemplateRows: '10% auto 10%',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
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
    contentContainer: {
      width: '90%',
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gridTemplateRows: 'auto auto',
      gridGap: '5%',
      alignSelf: 'start',
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr',
        height: '100%',
        alignItems: 'center',
      },
    },
    avatar: {
      height: '110px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      padding: '6%',
      fontSize: '0.7em',
      [theme.breakpoints.down(600)]: {
        height: '85px',
        padding: '0',
      },
    },
    gitHubInfo: {
      marginTop: '8%',
      [theme.breakpoints.down(600)]: {
        marginTop: '0',
        textAlign: 'start',
      },
    },
    senecaBlogInfo: {
      textAlign: 'start',
    },
    blogUrl: {
      textAlign: 'start',
    },
    titleRss: {
      textAlign: 'start',
    },
    blogRss: {
      textAlign: 'start',
      padding: '1%',
      minHeight: '60px',
      maxHeight: '60px',
      overflowY: 'auto',
      [theme.breakpoints.down(600)]: {
        width: '90%',
      },
    },
    text: {
      fontSize: '0.9em',
      alignSelf: 'end',
      color: '#474747',
    },
  })
);

const Review = connect<{}, SignUpForm>((props) => {
  const classes = useStyles();

  const { feeds, displayName, firstName, lastName, email, github, blogUrl } = props.formik.values;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1 className={classes.titlePage}>Review your Information</h1>
        <div className={classes.contentContainer}>
          <div className={classes.avatar}>
            <PostAvatar name={displayName} blog={blogUrl} img={github.avatarUrl} />
            <h2>
              Display Name:
              <h3>{displayName}</h3>
            </h2>
          </div>
          <div className={classes.senecaBlogInfo}>
            <h2>From seneca:</h2>
            <h3>Full Name: {displayName || `${firstName} ${lastName}`}</h3>
            <h3>Email : {email}</h3>
            <h3>Blog URL:</h3>
            <h3>{blogUrl}</h3>
          </div>
          <div>
            <div className={classes.gitHubInfo}>
              <h4>GitHub Account:</h4>
              <h3>{github.username}</h3>
            </div>
          </div>
          <div>
            <h3 className={classes.titleRss}>Blog RSS:</h3>
            <div className={classes.blogRss}>
              <div>
                {feeds.map((rss) => (
                  <h4 key={rss}>{rss}</h4>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Review;
