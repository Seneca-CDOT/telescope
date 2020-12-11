import { FC } from 'react';

interface PostSearchProps {
  text?: string | number;
  onChange?: (event?: any) => void;
  classes: {
    input: string;
  };
}
const PostSearchInput: FC<PostSearchProps> = ({ text, onChange, classes }: PostSearchProps) => {
  return (
    <input
      className={classes.input}
      placeholder="How to Get Started in Open Source"
      // inputProps={{ 'aria-label': 'search telescope' }}
      aria-label="search telescope"
      value={text}
      onChange={onChange}
    />
  );
};

export default PostSearchInput;
