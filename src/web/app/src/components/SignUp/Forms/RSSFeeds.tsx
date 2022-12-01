import { useState, useEffect, useRef } from 'react';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { connect } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import { feedDiscoveryServiceUrl } from '../../../config';
import useAuth from '../../../hooks/use-auth';
import { SignUpForm, DiscoveredFeed, DiscoveredFeeds } from '../../../interfaces';
import { TextInput, CheckBoxInput } from '../FormFields';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      position: 'relative',
      width: '100%',
      minHeight: '80%',
      [theme.breakpoints.down(600)]: {
        minHeight: '75%',
      },
    },
    container: {
      display: 'grid',
      gridTemplateAreas: '1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      position: 'absolute',
      minHeight: '100%',
      width: '100%',
      [theme.breakpoints.down(600)]: {
        width: '95%',
        marginLeft: '2.5%',
      },
    },
    blogPageTitle: {
      fontSize: '1.5em',
    },
    helpText: {
      fontSize: '1.1em',
      lineHeight: '1.8em',
    },
    infoContainer: {
      display: 'grid',
      textAlign: 'center',
      gridGap: '10%',
      justifyItems: 'center',
      alignItems: 'center',
      width: '90%',
    },
    inputsContainer: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '75% 25%',
      '& .MuiFormHelperText-root': {
        fontSize: '0.9em',
        color: 'black',
      },
      '& .MuiFormLabel-root': {
        color: 'black',
      },
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '80% 20%',
      },
    },
    helpMessage: {
      fontSize: '.9em',
      color: 'black',
    },
    button: {
      height: '35px',
      width: '70%',
      padding: '4px',
      alignSelf: 'center',
      fontSize: '1.1em',
      marginLeft: '5%',
      background: '#121D59',
      color: '#A0D1FB',
      '&:hover': {
        color: 'black',
        border: '1px solid #121D59',
      },
      '&.Mui-disabled': {
        backgroundColor: 'inherit',
      },
      [theme.breakpoints.down(600)]: {
        width: 'auto',
      },
    },
    RssButtonContainer: {
      width: '90%',
      padding: '2px',
      display: 'grid',
    },
    infoRSSContainer: {
      minHeight: '120px',
      maxHeight: '120px',
      width: '100%',
      overflowY: 'auto',
    },
    noBlogMessage: {
      fontSize: '1em',
      color: '#474747',
      marginTop: '40px',
    },
    text: {
      fontSize: '0.9em',
      alignSelf: 'end',
      color: '#474747',
    },
    RssButtonWrapper: {
      width: '100%',
    },
    RssButton: {
      width: '101%',
      borderRadius: '0',
      background: '#121D59',
      color: '#A0D1FB',
      '&:hover': {
        color: 'black',
        border: '1px solid #121D59',
      },
    },
    agreeMessage: {
      [theme.breakpoints.down(600)]: {
        alignSelf: 'end',
      },
    },
    formControlLabel: {
      fontSize: '.9em',
      height: '10px',
      color: '#474747',
    },
    helpTextExample: {
      fontSize: '.9em',
      fontWeight: 'normal',
    },
  })
);

type RSSFeedsFormProps = {
  feeds: {
    selected: 'blogs' | 'channels';
    discovered: 'allBlogs' | 'allChannels';
  };
  prompt?: string;
  promptExamples?: Array<string>;
  title: string;
  buttonText: string;
  helperText: string;
  input: {
    name: string;
    label: string;
  };
  agreement: {
    name: string;
    label: string;
  };
  noFeedsSelected?: string;
};

const RSSFeeds = connect<RSSFeedsFormProps, SignUpForm>(
  ({
    feeds: { selected, discovered },
    prompt,
    promptExamples,
    title,
    buttonText,
    helperText,
    noFeedsSelected,
    agreement,
    input,
    formik,
  }) => {
    const classes = useStyles();
    const { values, errors, setFieldValue } = formik;
    const { token } = useAuth();

    const [urlError, setUrlError] = useState('');
    const [validating, setValidating] = useState(false);
    const controllerRef = useRef<AbortController | null>();
    const name = input.name as keyof SignUpForm;

    const validateBlog = async () => {
      if (errors[name]) {
        setFieldValue(selected, [], true);
        return;
      }
      try {
        setValidating(true);
        controllerRef?.current?.abort();
        controllerRef.current = new AbortController();
        // Allow a list of URLs, separated by spaces
        const urls = (values[name] as string).split(/ +/);
        const response = await fetch(`${feedDiscoveryServiceUrl}`, {
          signal: controllerRef.current?.signal,
          method: 'post',
          headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(urls),
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const { feedUrls }: DiscoveredFeeds = await response.json();

        if (feedUrls.length === 1) {
          setFieldValue(selected, [feedUrls[0]], true);
        }

        setUrlError('');
        setFieldValue(discovered, feedUrls);
      } catch (err) {
        console.error(err, 'Unable to discover feeds');

        setUrlError('Unable to discover feeds');
        setFieldValue(discovered, []);
      } finally {
        // eslint-disable-next-line require-atomic-updates
        controllerRef.current = null;
        setValidating(false);
      }
    };

    const handleCheck = ({ feedUrl, type }: DiscoveredFeed) => {
      const selectedValues = values[selected];
      const selectedFeeds = selectedValues.find((feed) => feed.feedUrl === feedUrl)
        ? selectedValues.filter((feed) => feed.feedUrl !== feedUrl)
        : [...selectedValues, { feedUrl, type }];

      setFieldValue(selected, selectedFeeds, true);
    };

    // Parse FeedUrl by Type to produce desired output for confirmation
    const parseFeedUrlByType = ({ feedUrl, type }: DiscoveredFeed) => {
      // For twitch URL on channel feed page, parse the feed url to find the twitch URL
      if (type === 'twitch') {
        const result = feedUrl.match(/https?:\/\/www.twitch.tv\/\w+/);
        return result ? result[0] : feedUrl;
      }
      // By default, return the original feed url
      return feedUrl;
    };

    useEffect(() => {
      if (errors[input.name as keyof SignUpForm]) {
        validateBlog();
      }

      return () => {
        controllerRef?.current?.abort();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <h1 className={classes.blogPageTitle}>{title}</h1>
          <h2 className={classes.helpText}>
            {prompt}
            {promptExamples?.map((example) => (
              <div className={classes.helpTextExample}>{example}</div>
            ))}
          </h2>

          <div className={classes.infoContainer}>
            <div className={classes.inputsContainer}>
              <TextInput
                name={input.name}
                label={input.label}
                helperText={urlError || helperText}
                error={!!urlError}
              />
              <Button className={classes.button} onClick={validateBlog} disabled={validating}>
                {buttonText}
              </Button>
            </div>
            <div className={classes.RssButtonContainer}>
              <div className={classes.infoRSSContainer}>
                {values[discovered].length ? (
                  <FormControl required component="fieldset">
                    <FormGroup>
                      {values[discovered].map((feed) => (
                        <FormControlLabel
                          key={feed.feedUrl}
                          control={
                            <Checkbox
                              checked={!!values[selected].find((f) => f.feedUrl === feed.feedUrl)}
                              onChange={() => handleCheck(feed)}
                            />
                          }
                          label={
                            <h1 className={classes.formControlLabel}>
                              {feed.type}: {parseFeedUrlByType(feed)}
                            </h1>
                          }
                        />
                      ))}
                    </FormGroup>
                    <FormHelperText className={classes.helpMessage} error>
                      {errors[selected] || ''}
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <>
                    {noFeedsSelected && (
                      <h3 className={classes.noBlogMessage}>{noFeedsSelected}</h3>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <CheckBoxInput
            label={agreement.label}
            name={agreement.name}
            checked={values[agreement.name as keyof SignUpForm] as boolean}
          />
        </div>
      </div>
    );
  }
);

export default RSSFeeds;
