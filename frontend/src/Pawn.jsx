import React from 'react';
import pawn from './assets/pawn.png';

const Pawn = () => {
  const PawnStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  };

  return <img src={pawn} alt="Pawn" style={PawnStyle} />;
};

export default Pawn;
