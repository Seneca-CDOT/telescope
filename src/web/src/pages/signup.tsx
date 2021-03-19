import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import Link from 'next/link';
import FirstMessage from '../components/SignUp/WelcomeMessage';
import GetGitHub from '../components/SignUp/GetGitHub';
import GetBlogRSS from '../components/SignUp/GetBlogRSS';
import FinalMessage from '../components/SignUp/FinalMessage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      backgroundColor: theme.palette.background.default,
      width: '100%',
      display: 'grid',
      justifyItems: 'center',
      fontFamily: 'Spartan',
    },
    title: {
      marginTop: '1em',
      color: theme.palette.text.secondary,
      fontSize: '35px',
    },
    infoContainer: {
      width: '100%',
      height: '70vh',
    },
    buttonsContainer: {},
    stepper: {
      width: '80%',
      margin: '5px 0',
    },
    button: {
      fontSize: '1.3em',
      padding: '1.5em',
      margin: '5px 10px',
      background: '#DDDBCB',
    },
  })
);

const SignUpPage = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState({ email: '', name: '' });
  const [userGitHub, setUserGitHub] = useState('');
  const [userRSS, setUserRSS] = useState({});
  const [userAgree, setUserAgree] = useState(0);
  const steps = ['Start', 'Get GitHub', 'Get Blog', 'End'];

  const handleNext = () => {
    setActiveStep(activeStep < 3 ? activeStep + 1 : 3);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Create your Telescope Account</h1>
      <div className={classes.infoContainer}>
        {activeStep === 0 && <FirstMessage />}
        {activeStep === 1 && <GetGitHub />}
        {activeStep === 2 && <GetBlogRSS />}
        {activeStep === 3 && <FinalMessage />}
      </div>

      <div className={classes.buttonsContainer}>
        {activeStep === 0 ? (
          <Button className={classes.button} onClick={handleNext}>
            Start
          </Button>
        ) : (
          <>
            {activeStep <= 2 ? (
              <>
                <Button className={classes.button} onClick={handlePrevious}>
                  Previous
                </Button>
                <Button className={classes.button} onClick={handleNext}>
                  {activeStep < 2 ? 'Next' : 'Finish'}
                </Button>
              </>
            ) : (
              <Button className={classes.button} onClick={handleNext}>
                <Link href="/" passHref>
                  HOME
                </Link>
              </Button>
            )}
          </>
        )}
      </div>

      <div className={classes.stepper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default SignUpPage;
