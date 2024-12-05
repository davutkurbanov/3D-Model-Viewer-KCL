import React from 'react';

const Card = ({ children, className }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="card-header">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="card-content">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="card-title">
    {children}
  </h2>
);

export { Card, CardHeader, CardContent, CardTitle };
