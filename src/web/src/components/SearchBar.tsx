import { useState, MouseEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useRouter } from 'next/router';

import {
  FormControl,
  Box,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'visible',
      maxWidth: '785px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing(2, 2, 2, 2),
      marginBottom: theme.spacing(6),
    },
    input: {
      fontSize: '1.5rem',
      background: 'white',
      padding: '15px 25px',
      boxSizing: 'border-box',
      borderRadius: '9px',
      outline: 'none',
      width: '100%',
      border: 'solid 1px grey',
      '&:focus': {
        border: 'solid 1px grey',
      }
    },
    dropdownBox: {
      background: 'white',
      width: '100%',
      position: 'absolute',
      transform: 'translateY(40px)',
      zIndex: 999,
      boxSizing: 'border-box',
      border: 'solid 1px grey',
      borderTop: 0
    },
    listSearch: {
      padding: '0 0px',
      '& li': {
        listStyleType: 'none',
        fontSize: '1.5rem',
        padding: '6px 25px',
      },
      '&li div': {
        display: 'inline'
      },
      '& li:hover': {
        background: '#C1F1FF'
      }
    },
    searchDropdownBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      background: '#eeeeee',
      height: '50px'
    },
    advancedSearchButton: {
      border: 'none',
      marginRight: '10px',
      outline: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#BABABA',
      '&:hover': {
        color: '#5D5D5D'
      }
    }, 
    searchButton: {
      marginRight: '10px',
      background: '#5EB8EC',
      border: 'none',
      borderRadius: '4px',
      color: 'white',
      padding: '10px 18px',
      cursor: 'pointer',
      '&:hover': {
        background: '#569DD7'
      }
    },
    xxx: {
      
      top: '10px',
      right: '10px',
    }
  })
);

type searchBarProps = {
  text: string;
  onTextChange: Function;
  filter: string;
  onFilterChange: Function;
  onSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const SearchBar = ({ text, onTextChange, onFilterChange, filter, onSubmit }: searchBarProps) => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState('');
  const [dropdownVisible, setdropdownVisible] = useState(false);
  const router = useRouter();

  const handleSearch = (searchType: string) => {
    if (searchType) {
      if(searchType.toUpperCase() === 'AUTHOR') {
        router.push(`/search?text=${keyword}&filter=author`);
        setdropdownVisible(false);
      } else {
        router.push(`/search?text=${keyword}&filter=post`);
        setdropdownVisible(false);
      }
    } else {
      router.push(`/search?text=${keyword}&filter=post`);
      setdropdownVisible(false);
    }
  }

  return (
    <Box className={classes.root}>
      <FormControl fullWidth>

              <form onSubmit={e => {
                  e.preventDefault();
                  handleSearch('');
                }
              }
              >
                <input 
                  className={classes.input} 
                  value={keyword} 
                  placeholder='Search...' 
                  onChange={e => setKeyword(e.target.value)}
                  onFocus={() => setdropdownVisible(true)}
                  onBlur={() => {
                    if(keyword) {
                      setdropdownVisible(true);
                    } else {
                      setdropdownVisible(false);
                    }
                  }} 
                />
              </form>
              
              {Boolean(dropdownVisible && keyword) && (
                <div className={classes.dropdownBox}>
                  <ul className={classes.listSearch}>
                    <li onClick={() => handleSearch('POST')}>
                      <div><SearchIcon /> {keyword} (in posts) - ENTER <span className={classes.xxx}>Search in Posts</span></div>
                    </li>
                    <li onClick={() => handleSearch('AUTHOR')}>
                      <div><SearchIcon /> {keyword} (in authors) <span className={classes.xxx}>Search in Authors</span></div>
                    </li>
                  </ul>


                  <div className={classes.searchDropdownBottom}>
                    <button className={classes.advancedSearchButton}>Advanced Search</button>
                    <button className={classes.searchButton} onClick={()=>handleSearch('')}>Search</button>
                  </div>

                </div>
              )}
      </FormControl>
    </Box>
  )
};

export default SearchBar;
