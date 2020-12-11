import { FC } from 'react';

interface AuthorSearchProps {
  text?: string | number;
  onChange: (event?: any) => void;
  classes: {
    input: string;
  };
}

const AuthorSearchInput: FC<AuthorSearchProps> = ({
  text,
  onChange,
  classes,
}: AuthorSearchProps) => {
  return (
    <>
      <input
        className={classes.input}
        list="search-suggestions"
        placeholder="How to Get Started in Open Source"
        // inputProps={{ 'aria-label': 'search telescope' }}
        aria-label="search telescope"
        value={text}
        onChange={onChange}
      />
      <datalist id="search-suggestions" />
    </>
  );
};
export default AuthorSearchInput;
