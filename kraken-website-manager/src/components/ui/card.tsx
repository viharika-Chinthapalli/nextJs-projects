import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`rounded-lg pt-5 text-card-foreground bg-card-bg ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
