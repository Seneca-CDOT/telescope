import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { FormEvent, useEffect, useState } from 'react';
import SearchInput from './SearchInput/SearchInput';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'visible',
      maxWidth: '785px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing(4, 2, 0, 2),
      marginBottom: theme.spacing(12),
    },
    card: {
      padding: theme.spacing(0, 0, 0, 2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '50px',
      background: theme.palette.background.default,
      border: `2px solid ${theme.palette.info.main}`,
      transition: 'background-color .5s',
    },
    header: {
      padding: 0,
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    h1: {
      display: 'block',
      transition: 'all linear 350ms',
      fontWeight: 600,
      color: theme.palette.text.secondary,
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '3rem',
      },
      [theme.breakpoints.between('md', 'lg')]: {
        fontSize: '4rem',
      },
      [theme.breakpoints.up('xl')]: {
        fontSize: '5rem',
      },
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
      top: '10px',
      padding: '8px',
      color: '#A0D1FA',
    },
    selectControl: {
      '& > *': {
        width: 'auto',
        transform: 'translateY(2px)',
        fontSize: '1.5rem',
        textTransform: 'capitalize',
        paddingLeft: '2rem',
        [theme.breakpoints.down('xs')]: {
          paddingLeft: '1rem',
          width: '10rem',
          transform: 'translateY(15px)',
        },
      },
    },
    selectItem: {
      fontSize: '1.4rem',
      textTransform: 'capitalize',
    },
    advanceSearchButton: {
      float: 'right',
      width: 'auto',
      padding: '5px 10px',
      outline: 'none',
      border: 'none',
      background: 'transparent',
      color: theme.palette.info.main,
      fontSize: '10px',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    backButton: {
      float: 'left',
      width: 'auto',
      padding: '5px 10px',
      outline: 'none',
      border: 'none',
      background: 'transparent',
      color: theme.palette.info.main,
      fontSize: '10px',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    advancedSearchInputDiv: {
      margin: '2.5rem 0px',
    },
    searchButton: {
      float: 'right',
      borderRadius: '50px',
      '&:hover': {
        backgroundColor: theme.palette.info.light,
      },
    },
  })
);

const SearchBar = () => {
  const classes = useStyles();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [author, setAuthor] = useState('');
  const [post, setPost] = useState('');
  const [title, setTitle] = useState('');

  const postParam = Array.isArray(router.query.post)
    ? router.query.post[0]
    : router.query.post || '';

  const authorParam = Array.isArray(router.query.author)
    ? router.query.author[0]
    : router.query.author || '';

  const titleParam = Array.isArray(router.query.title)
    ? router.query.title[0]
    : router.query.title || '';

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    // creates url params out of key/value pairs
    const parameters = new URLSearchParams();

    if (author) parameters.append('author', author);
    if (post) parameters.append('post', post);
    if (title) parameters.append('title', title);

    router.push(`/search?${parameters}`);
  };

  // Function to clear out old fields when collapsing the advanced search.
  const resetAdvancedFields = () => {
    setAuthor('');
    setTitle('');
  };

  useEffect(() => {
    setPost(postParam);
    setAuthor(authorParam);
    setTitle(titleParam);
  }, [postParam, authorParam, titleParam]);

  return (
    <form className={classes.root} onSubmit={onSubmitHandler}>
      <SearchInput
        text={post}
        setText={setPost}
        clickEvent={!openDialog ? onSubmitHandler : null}
        labelFor="Browse for a post"
      />

      {openDialog && (
        <>
          <div className={classes.advancedSearchInputDiv}>
            <SearchInput text={title} setText={setTitle} labelFor="The blog title was..." />
          </div>
          <div className={classes.advancedSearchInputDiv}>
            <SearchInput text={author} setText={setAuthor} labelFor="Look for an Author" />
          </div>
        </>
      )}
      <Button
        type="button"
        className={!openDialog ? classes.advanceSearchButton : classes.backButton}
        onClick={() => {
          setOpenDialog(!openDialog);
          resetAdvancedFields();
        }}
      >
        {!openDialog ? 'Advanced Search' : 'Regular search'}
      </Button>
      {openDialog && (
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          color="primary"
          size="large"
          className={classes.searchButton}
        >
          Search
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
