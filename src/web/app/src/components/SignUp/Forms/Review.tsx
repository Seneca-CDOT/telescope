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

  // Make sure only confirmed channel URL(s) are accepted, after data is "submitted" by "Youtube and Twitch" pages
  const channelList = props.formik.values.channelUrl;
  if (channelList && channelList.trim() !== '') {
    // If there is any confirmed channel, match the URL(s) against channel URL list to eliminate unconfirmed ones from the channel URL list
    const confirmedChannels = props.formik.values.channels;
    if (confirmedChannels.length > 0) {
      const confirmedChannelUrls = confirmedChannels.map((channel) => channel.feedUrl);

      let channelListArray = channelList.split(/\s+/);
      // This skips any youtube channel URL at the moment
      channelListArray = channelListArray.filter((channel) =>
        confirmedChannelUrls.find(
          (confirmedChannel) =>
            confirmedChannel.includes(channel) || channel.includes('www.youtube.com')
        )
      );
      props.formik.values.channelUrl = channelListArray.join(' ');

      // Match selected feeds against discovered feeds too, for consistency in case users backtrack to make changes
      props.formik.values.allChannels = props.formik.values.allChannels.filter((discoveredFeed) =>
        confirmedChannels.find((selectedFeed) => selectedFeed.feedUrl === discoveredFeed.feedUrl)
      );
    } else {
      props.formik.values.channelUrl = ''; // Otherwise, the channel URL list and discovered feeds set to be empty
      props.formik.values.allChannels = [];
    }
  }

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
        <div>
          By submitting these information, you confirm you are the owner and/or maintainer of the
          accounts entered.
        </div>
        <FormHelperText error>{props.accountError}</FormHelperText>
      </div>
    </div>
  );
});

export default Review;
