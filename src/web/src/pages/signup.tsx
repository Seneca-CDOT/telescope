import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { useState, SyntheticEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import useAuth from '../hooks/use-auth';
import Overview from '../components/SignUp/Overview';
import GetGitHub from '../components/SignUp/GetGitHub';
import GetBlogRSS from '../components/SignUp/GetBlogRSS';
import Review from '../components/SignUp/Review';

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
      height: '100vh',
      display: 'grid',
      gridTemplateRows: '10% 70% 10% 10%',
      justifyItems: 'center',
      fontFamily: 'Spartan',
      position: 'relative',
    },
    title: {
      marginTop: '1em',
      color: theme.palette.text.secondary,
      fontSize: '35px',
    },
    infoContainer: {
      width: '100%',
    },
    button: {
      fontSize: '1.3em',
      padding: '1.5em',
      margin: '5px 10px',
      background: '#E0C05A',
    },
    stepper: {
      position: 'absolute',
      bottom: '0',
      width: '80%',
      margin: '5px 0',
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

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log(userInfo);
  };

  const steps = ['Start', 'GitHub', 'Blog', 'Review'];

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const renderContent = () => {
    switch (activeStep) {
      case 0:
        return <Overview />;
      case 1:
        return <GetGitHub handleChange={handleChange} agreement={userInfo.githubOwnership} />;
      case 2:
        return <GetBlogRSS handleChange={handleChange} agreement={userInfo.blogOwnership} />;
      case 3:
        return <Review />;
      default:
        return null;
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit} autoComplete="off">
      <h1 className={classes.title}>Telescope Account</h1>
      <div className={classes.infoContainer}>{renderContent()}</div>

      <div>
        {activeStep > 0 && (
          <Button className={classes.button} onClick={handlePrevious}>
            Previous
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
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
            Next
          </Button>
        ) : (
          <Link href="/" passHref>
            <Button
              className={classes.button}
              onClick={() => {
                console.log(userInfo);
              }}
            >
              Confirm
            </Button>
          </Link>
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
    </form>
  );
};

export default SignUpPage;
