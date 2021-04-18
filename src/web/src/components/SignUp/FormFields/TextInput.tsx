import { useField, FieldHookConfig } from 'formik';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    formInput: {
      fontSize: '1.1em',
      color: 'black',
    },
    formInputLabel: {
      fontSize: '1.2em',
      color: 'black',
    },
  })
);

const TextInput = (props: TextFieldProps & FieldHookConfig<string>) => {
  const classes = useStyles();

  const { helperText, error, ...rest } = props;
  const [field, meta] = useField(props);

  const renderHelperText = () =>
    error || (meta.touched && meta.error) ? meta.error || helperText : '';

  return (
    <TextField
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
      fullWidth
      type="text"
      error={error || (meta.touched && !!meta.error)}
      helperText={renderHelperText()}
      {...field}
      {...rest}
    />
  );
};

export default TextInput;
