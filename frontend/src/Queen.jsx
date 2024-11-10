import React from 'react';
import Queen from '../Queen.png';

const Queen = ({ QueenY }) => {
  const QueenStyle = {
    position: 'absolute',
    top: `${QueenY}px`,
    left: '100px',
    width: '100px',
    height: '100px'
  };

  return <img src={Queen} alt="Queen" style={QueenStyle} />;
};

export default Queen;
