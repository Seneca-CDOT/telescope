import React from 'react';
import logoUrl from '../../images/logo.svg';

function LogoIcon(height: number, width: number) {
  return <img src={logoUrl} alt="logo" height={height} width={width} />;
}

export default LogoIcon;
