import { useField } from 'formik';

import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() =>
  createStyles({
    formInputLabel: {
      fontSize: '1.4em',
      color: 'black',
    },
    formControlLabel: {
      fontSize: '1em',
      color: '#474747',
    },
  })
);

type CheckboxProps = {
  name: string;
  label: string;
  checked: boolean;
};

const CheckBoxInput = (props: CheckboxProps) => {
  const classes = useStyles();

  const { label, name, checked, ...rest } = props;
  const [field, meta] = useField(props);

  return (
    <FormControl {...rest} error={!!meta.error && meta.touched}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...field} checked={checked} />}
          label={<span className={classes.formControlLabel}>{label}</span>}
          name={name}
        />
      </FormGroup>
      <FormHelperText>{meta.error && meta.touched ? meta.error : ''}</FormHelperText>
    </FormControl>
  );
};

export default CheckBoxInput;
