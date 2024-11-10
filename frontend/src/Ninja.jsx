import React from 'react';
import ninja from './assets/moopu.png';

const Ninja = ({onClickHandle}) => {
  const ninjaStyle = {
    width: '100%',
    height: '100%',
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  };

  const imageStyle = {
    paddingtop: '10%',
    width: '100%',
    height: '90%',
    objectFit: 'contain',
    borderRadius: '0'  // If you want no rounded corners
  };

  return <button onClick={onClickHandle} style={ninjaStyle}><img src={ninja} alt="ICP ninja" style={ninjaStyle} /> </button>;
};

export default Ninja;
