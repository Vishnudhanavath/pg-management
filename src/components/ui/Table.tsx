import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => {
  return (
    <div className="table-responsive">
      <table className={`table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};
