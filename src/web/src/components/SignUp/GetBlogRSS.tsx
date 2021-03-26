import { createStyles, makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

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
    },
    infoContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      textAlign: 'center',
      justifyItems: 'center',
      alignItems: 'center',
    },
    inputsContainer: {
      width: '90%',
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
    helpMessage: {
      fontSize: '1.5em',
    },
  })
);

type GetBlogRssProps = {
  handleChange: Function;
  agreement: boolean;
};

const GetBlogRSS = ({ handleChange, agreement }: GetBlogRssProps) => {
  const classes = useStyles();
  const rssExample = ['www.test1.feed.com', 'www.test2.feed.com', 'www.test3.feed.com'];

  const dumbHandleChange = () => null;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1>Blog RSS</h1>
        <h2>
          Please enter your personal blog URL then select the RSS that you want to use in Telescope
          ecosystem.
        </h2>
        <div className={classes.infoContainer}>
          <div className={classes.inputsContainer}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Enter blog URL"
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
          <div className={classes.infoContainer}>
            <FormControl required component="fieldset">
              <FormGroup>
                {rssExample.map((rss) => (
                  <FormControlLabel
                    key={rss}
                    control={<Checkbox checked name={rss} onChange={dumbHandleChange} />}
                    label={<h1 className={classes.formControlLabel}>{rss}</h1>}
                  />
                ))}
              </FormGroup>
              <FormHelperText className={classes.helpMessage}>
                You must select at least one RSS
              </FormHelperText>
            </FormControl>
          </div>
        </div>
        <div>
          <FormControl required component="fieldset">
            <FormLabel component="legend" className={classes.formLabel}>
              I declare that I’m the owner and the maintainer of the Blog account provided:
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreement}
                    name="blogOwnership"
                    onChange={(e) => handleChange(e)}
                  />
                }
                label={<h1 className={classes.formControlLabel}>Yes</h1>}
              />
            </FormGroup>
            <FormHelperText>Field Required.</FormHelperText>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default GetBlogRSS;
