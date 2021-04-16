import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import Button from '@material-ui/core/Button';

import useAuth from '../hooks/use-auth';
import Overview from '../components/SignUp/Forms/Overview';
import BasicInfo from '../components/SignUp/Forms/BasicInfo';
import GitHubAccount from '../components/SignUp/Forms/GitHubAccount';
import RSSFeeds from '../components/SignUp/Forms/RSSFeeds';
import Review from '../components/SignUp/Forms/Review';
import DynamicImage from '../components/DynamicImage';

import { SignUpForm } from '../interfaces';
import formModels from '../components/SignUp/Schema/FormModel';
import formSchema from '../components/SignUp/Schema/FormSchema';
import { usersServiceUrl } from '../config';

const {
  firstName,
  lastName,
  displayName,
  githubUsername,
  github,
  githubOwnership,
  blogUrl,
  feeds,
  email,
  blogOwnership,
} = formModels;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      position: 'relative',
      fontSize: '1.1rem',
    },
    imageContainer: {
      minHeight: '100vh',
      width: '100vw',
      position: 'absolute',
      top: '0',
      bottom: '0',
      zIndex: -1,
      [theme.breakpoints.down(600)]: {
        display: 'none',
      },
    },
    signUpContainer: {
      margin: '1% 0 1% 0',
      display: 'grid',
      gridTemplateRows: '10% auto 15%',
      gridGap: '2%',
      justifyItems: 'center',
      fontFamily: 'Spartan',
      height: '510px',
      width: '510px',
      padding: '1%',
      borderRadius: '5px',
      boxShadow: '2px 4px 4px 1px rgba(0, 0, 0, 0.1)',
      background: '#ECF5FE',
      '@media (max-height: 500px) and (max-width: 1024px)': {
        margin: '0 0 65px 0',
      },
      [theme.breakpoints.down(600)]: {
        background: 'none',
        boxShadow: 'none',
        minHeight: '650px',
        height: '600px',
        position: 'absolute',
        top: '0px',
        width: '100%',
        margin: '0',
        padding: '0',
        gridTemplateRows: '8% auto 17%',
      },
    },
    title: {
      color: '#121D59',
      fontSize: '22px',
    },
    infoContainer: {
      width: '100%',
      position: 'relative',
    },
    buttonsWrapper: {
      margin: '20px auto',
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      height: '4rem',
      width: '40%',
      fontSize: '1.1em',
      padding: '0.7em',
      margin: '5px',
      background: '#E0C05A',
      '&:hover': {
        color: 'black',
        background: '#EBD898',
      },
    },
    buttonLogin: {
      height: '4rem',
      width: '40%',
      fontSize: '1.1em',
      padding: '0.7em',
      margin: '5px',
      background: '#FF0000',
      color: '#FFF',
      '&:hover': {
        background: '#FF7070',
      },
    },
    text: {
      textAlign: 'center',
      fontSize: '0.9em',
      color: '#474747',
    },
  })
);

const SignUpPage = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentSchema = formSchema[activeStep];
  const { user, token, login } = useAuth();
  const [loggedIn, setLoggedIn] = useState(!!user);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (user) {
      setLoggedIn(!!user);
      handleNext();
    }
  }, []);

  const handleSubmit = async (values: SignUpForm, actions: FormikHelpers<SignUpForm>) => {
    if (activeStep === 4) {
      try {
        const { firstName, lastName, email, displayName, github, feeds } = values;
        const telescopeUser = {
          firstName,
          lastName,
          email,
          displayName,
          github,
          feeds,
        };
        // TODO Update register URL
        const response = await fetch(`${usersServiceUrl}/${user?.id}`, {
          method: 'post',
          headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telescopeUser),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        login();
        return;
      } catch (err) {
        console.error(err, 'Unable to Post');
      }
    } else {
      handleNext();
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return <Overview />;
      case 1:
        return <BasicInfo />;
      case 2:
        return <GitHubAccount />;
      case 3:
        return <RSSFeeds />;
      case 4:
        return <Review />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        <DynamicImage />
      </div>
      <div className={classes.signUpContainer}>
        <h1 className={classes.title}>Telescope Account</h1>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={currentSchema}
          initialValues={
            {
              [firstName.name]: user?.firstName,
              [lastName.name]: user?.lastName,
              [displayName.name]: user?.name,
              [email.name]: user?.email,
              [githubUsername.name]: '',
              [githubOwnership.name]: false,
              [github.name]: {
                username: '',
                avatarUrl: '',
              },
              [blogUrl.name]: 'https://',
              [feeds.name]: [] as Array<string>,
              [blogOwnership.name]: false,
            } as SignUpForm
          }
        >
          {({ isSubmitting }) => (
            <>
              <Form autoComplete="off" className={classes.infoContainer}>
                {renderForm()}
                {!loggedIn && (
                  <div className={classes.text}>
                    <h3>Click LOGIN to start creating your Telescope Account.</h3>
                  </div>
                )}
                <div className={classes.buttonsWrapper}>
                  {!loggedIn && (
                    <Button className={classes.buttonLogin} onClick={() => login('/signup')}>
                      Login
                    </Button>
                  )}
                  {activeStep > 0 && loggedIn && (
                    <Button className={classes.button} onClick={handlePrevious}>
                      Previous
                    </Button>
                  )}
                  {activeStep > 0 && loggedIn && (
                    <Button className={classes.button} type="submit" disabled={isSubmitting}>
                      {activeStep === 4 ? 'Confirm' : 'Next'}
                    </Button>
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpPage;
