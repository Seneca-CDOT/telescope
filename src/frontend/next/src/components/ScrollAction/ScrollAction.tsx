import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const ScrollAction: FC<Props> = ({ children }) => {
  const handleClick = (event: any) => {
    const mobile = window.innerWidth <= 1065;
    const anchor = mobile
      ? (event.target.ownerDocument || document).querySelector('#back-to-top-anchor-mobile')
      : (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div onClick={handleClick} role="presentation">
      {children}
    </div>
  );
};

export default ScrollAction;
