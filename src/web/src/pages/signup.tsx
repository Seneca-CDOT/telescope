import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import useAuth from '../hooks/use-auth';
import FirstMessage from '../components/SignUp/WelcomeMessage';
import GetGitHub from '../components/SignUp/GetGitHub';
import GetBlogRSS from '../components/SignUp/GetBlogRSS';
import FinalMessage from '../components/SignUp/FinalMessage';

type UserInfo = {
  id?: string;
  isAdmin?: boolean;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  feeds?: string[];
  github?: {
    username: string;
    avatarUrl: string;
  };
  blogOwnership: boolean;
  githubOwnership: boolean;
};

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
  const { user, login } = useAuth();

  if (!user) {
    login();
  }

  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: user?.id,
    isAdmin: user?.isAdmin,
    displayName: user?.name,
    blogOwnership: false,
    githubOwnership: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

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
        {activeStep === 1 && (
          <GetGitHub handleChange={handleChange} agreement={userInfo.githubOwnership} />
        )}
        {activeStep === 2 && (
          <GetBlogRSS handleChange={handleChange} agreement={userInfo.blogOwnership} />
        )}
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
                <Button
                  className={classes.button}
                  onClick={handleNext}
                  disabled={
                    // eslint-disable-next-line no-nested-ternary
                    activeStep === 1
                      ? !userInfo.githubOwnership
                      : activeStep === 2
                      ? !userInfo.blogOwnership
                      : false
                  }
                >
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
