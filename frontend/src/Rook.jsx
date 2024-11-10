import React from 'react';
import Rook from '../Rook.png';

const Rook = ({ RookY }) => {
  const RookStyle = {
    position: 'absolute',
    top: `${RookY}px`,
    left: '100px',
    width: '100px',
    height: '100px'
  };

  return <img src={Rook} alt="Pawn" style={RooknStyle} />;
};

export default Rook;
