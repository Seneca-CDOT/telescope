import { FC } from 'react';

// This interface specifies that the props passed in can only be of type number
type LogoIconProps = {
  height: number;
  width: number;
};

const LogoIcon: FC<LogoIconProps> = ({ height, width }) => {
  return (
    <>
      <img src="/logo.svg" alt="Telescope Logo" height={height} width={width} />
    </>
  );
};

export default LogoIcon;
