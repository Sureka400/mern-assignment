import React from 'react';

export default function Pagination({ page, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
    <div>
      {pages.map(p => (
        <button key={p} disabled={p === page} onClick={() => onPageChange(p)}>{p}</button>
      ))}
    </div>
  );
}