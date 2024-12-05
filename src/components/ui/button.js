import React from 'react';

const Button = ({ onClick, children }) => (
  <button onClick={onClick} className="btn">
    {children}
  </button>
);

export { Button };
