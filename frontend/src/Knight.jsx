import React from 'react';
import Knight from '../Knight.png';

const Knight = ({ KnightY }) => {
  const KnightStyle = {
    position: 'absolute',
    top: `${PawnY}px`,
    left: '100px',
    width: '100px',
    height: '100px'
  };

  return <img src={Knight} alt="Knight" style={KnightStyle} />;
};

export default Knight;