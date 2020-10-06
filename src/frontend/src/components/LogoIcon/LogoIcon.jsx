import React from 'react';
import logoUrl from '../../images/logo.svg';

export default function LogoIcon(props) {
  return <img src={logoUrl} alt="logo" height={props.height} width={props.width} />;
}
