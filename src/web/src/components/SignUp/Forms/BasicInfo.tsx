import { ReactNode } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { connect } from 'formik';

import { SignUpForm } from '../../../interfaces';
import useAuth from '../../../hooks/use-auth';
import formModels from '../Schema/FormModel';
import { TextInput } from '../FormFields';

const { firstName, lastName, displayName } = formModels;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      width: '100%',
      position: 'relative',
      minHeight: '80%',
      [theme.breakpoints.down(600)]: {
        minHeight: '75%',
      },
    },
    container: {
      display: 'grid',
      gridGap: '5px',
      gridTemplateColumns: '1fr',
      justifyItems: 'center',
      textAlign: 'center',
      alignItems: 'center',
      width: '100%',
      position: 'absolute',
      minHeight: '100%',
      [theme.breakpoints.down(600)]: {
        width: '95%',
        marginLeft: '2.5%',
      },
    },
    helloMessage: {
      fontSize: '0.8em',
    },
    userInfo: {
      color: '#292929',
      margin: '0',
      padding: '.5%',
      width: '90%',
      height: '80%',
      fontSize: '0.8em',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #C5EB98',
      background: 'rgba(197, 235, 152, 0.2)',
      borderRadius: '5px',
      [theme.breakpoints.down(600)]: {
        gridTemplateColumns: '1fr',
      },
      '& span': {
        color: '#525252',
      },
    },
    userInfoLabel: {
      gridColumnStart: '1',
      gridColumnEnd: '3',
      [theme.breakpoints.down(600)]: {
        gridColumnStart: '1',
        gridColumnEnd: '2',
      },
    },
    displayNameTitle: {
      fontSize: '0.85em',
    },
    button: {
      fontSize: '0.8em',
      height: '35px',
      width: '50%',
      background: '#121D59',
      color: '#A0D1FB',
      marginLeft: '5%',
      '&:hover': {
        color: 'black',
        border: '1px solid #121D59',
      },
    },
    displayNameInfo: {
      textAlign: 'start',
      gridColumnStart: '1',
      gridColumnEnd: '3',
      fontSize: '1em',
    },
    inputContainer: {
      display: 'grid',
      alignItems: 'center',
      justifyItems: 'center',
      width: '90%',
      fontSize: '1.2em',
      gridTemplateColumns: '80% 20%',
      '& .MuiFormLabel-root': {
        color: 'black',
      },
      '& .MuiInputBase-input': {
        marginTop: '16px',
        fontSize: '1.2em',
      },
    },
  })
);

type Props = {
  children: ReactNode;
};

const InputContainer = ({ children }: Props) => {
  const classes = useStyles();

  return <div className={classes.inputContainer}>{children}</div>;
};

const BasicInfo = connect<{}, SignUpForm>((props) => {
  const classes = useStyles();
  const { values } = props.formik;
  const { user } = useAuth();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.helloMessage}>
          <h2>Hello {user?.name}</h2>
        </div>
        <div className={classes.userInfo}>
          <h3 className={classes.userInfoLabel}>
            The following information is what we already have:
          </h3>
          <h3>
            <b>Name: </b>
            <span>{user?.name}</span>
          </h3>
          <h3>
            <b>Email: </b>
            <span>{values.email}</span>
          </h3>
        </div>
        <InputContainer>
          <TextInput label={firstName.label} name={firstName.name} />
        </InputContainer>
        <InputContainer>
          <TextInput label={lastName.label} name={lastName.name} />
        </InputContainer>
        <InputContainer>
          <TextInput label={displayName.label} name={displayName.name} />
        </InputContainer>
        <h4>Your display name will be used in all your interactions within Telescope</h4>
      </div>
    </div>
  );
});

export default BasicInfo;
