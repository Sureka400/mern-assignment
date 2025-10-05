import React, { useEffect, useState } from 'react';
import API from '../api/api';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';

export default function BookList(){
  const [booksData, setBooksData] = useState({ books: [], page:1, totalPages:1 });
  const [search, setSearch] = useState('');

  const fetchPage = async (page=1) => {
    try {
      const res = await API.get('/books', { params: { page, search }});
      setBooksData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchPage(1); }, [search]);

  return (
    <div>
      <div>
        <input placeholder="Search title/author" value={search} onChange={e=>setSearch(e.target.value)} />
        <Link to="/add-book">Add Book</Link>
      </div>
      <div>
        {booksData.books.map(b => <BookCard key={b._id} book={b} />)}
      </div>
      <Pagination page={booksData.page} totalPages={booksData.totalPages} onPageChange={fetchPage} />
    </div>
  );
}