import { createStyles, makeStyles, Theme, FormHelperText } from '@material-ui/core';
import { connect } from 'formik';

import { SignUpForm } from '../../../interfaces';
import PostAvatar from '../../Posts/PostAvatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      width: '100%',
      position: 'relative',
      minHeight: '80%',
      [theme.breakpoints.down(600)]: {
        minHeight: '77%',
      },
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
        gridGap: '1%',
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
      maxWidth: '306px',
      textAlign: 'start',
      padding: '1%',
      minHeight: '60px',
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
    rssContainer: {
      display: 'flex',
    },
    rssContent: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })
);

const Review = connect<{ accountError: string | undefined }, SignUpForm>((props) => {
  const classes = useStyles();

  const { blogs, channels, displayName, firstName, lastName, email, github, blogUrl, channelUrl } =
    props.formik.values;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1 className={classes.titlePage}>Review your Information</h1>
        <div className={classes.contentContainer}>
          <div className={classes.avatar}>
            <PostAvatar name={displayName} githubUsername={github.username} />
            <h2>{displayName}</h2>
          </div>
          <div className={classes.senecaBlogInfo}>
            <h3>
              Full Name: {firstName} {lastName}
            </h3>
            <h3>Email : {email}</h3>
            <h3>Blog URL(s): {blogUrl}</h3>
            <h3>Channel URL(s): {channelUrl}</h3>
          </div>
          <div>
            <div className={classes.gitHubInfo}>
              <h4>GitHub Account</h4>
              <h3>{github.username}</h3>
            </div>
          </div>
          <div>
            <div className={classes.blogRss}>
              <h3 className={classes.titleRss}>Blog RSS:</h3>
              <div>
                {blogs.map(({ feedUrl }) => (
                  <h4 key={feedUrl} className={classes.rssContainer}>
                    <span className={classes.rssContent} title={feedUrl}>
                      {feedUrl}
                    </span>
                  </h4>
                ))}
              </div>
              <h3 className={classes.titleRss}>Twitch/Youtube Channel RSS:</h3>
              <div>
                {channels.map(({ type, feedUrl }) => (
                  <h4 key={feedUrl} className={classes.rssContainer}>
                    <span className={classes.rssContent} title={feedUrl}>
                      {type}: {feedUrl}
                    </span>
                  </h4>
                ))}
              </div>
            </div>
          </div>
        </div>
        <FormHelperText error>{props.accountError}</FormHelperText>
      </div>
    </div>
  );
});

export default Review;
