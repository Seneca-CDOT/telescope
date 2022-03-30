import { Dispatch, SetStateAction } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '20px',
    },
    inputGrid: {
      marginTop: '1rem',
    },
    customInput: {
      borderRadius: `4rem 4rem 4rem 4rem`,
      borderColor: theme.palette.info.main,
      borderWidth: `2px`,
      transition: theme.transitions.create(['background-color', 'border-color'], {
        duration: '.5s',
      }),
      fontSize: '14px',
      display: 'block',
      color: theme.palette.text.primary,
    },
    customInputText: {
      color: theme.palette.text.primary,
      fontSize: '14px',
    },
    iconButton: {
      backgroundColor: theme.palette.info.main,
      '&:hover': {
        backgroundColor: theme.palette.info.light,
      },
      '& * > .MuiSvgIcon-root': {
        fontSize: '2rem',
        color: theme.palette.primary.contrastText,
      },
      margin: 0,
      position: 'absolute',
      top: '20px',
      padding: '13px',
      color: '#A0D1FA',
      marginRight: '0.5rem',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },
  })
);

interface SearchInputInterface {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  labelFor: string;
  clickEvent?: any;
}

const SearchInput = ({ text, setText, labelFor, clickEvent }: SearchInputInterface) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <TextField
        variant="outlined"
        size="medium"
        fullWidth
        label={labelFor}
        onChange={(event) => setText(event.target.value)}
        value={text}
        InputProps={{
          classes: {
            root: classes.customInput,
            focused: classes.customInput,
            notchedOutline: classes.customInput,
          },
        }}
        InputLabelProps={{
          classes: {
            root: classes.customInputText,
            focused: classes.customInputText,
          },
        }}
      />
      {clickEvent && (
        <IconButton
          className={classes.iconButton}
          type="submit"
          onClick={clickEvent}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      )}
    </div>
  );
};

export default SearchInput;
