
'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRightIcon,
  UserGroupIcon,
  BoltIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

export default function LibraryDashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'STEM & Mathematics',
    shelf_location: 'Aisle B · Shelf 01',
    total_copies: 20
  });

  const loadLibrary = async () => {
    try {
      const res = await api.get('/v1/campus/library');
      setBooks(res.data?.books || []);
      setLoans(res.data?.loans || []);
    } catch (err) {
      console.error('Failed to load tenant library data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/v1/campus/library', {
        ...newBook,
        total_copies: Number(newBook.total_copies)
      });
      setShowAddBook(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        category: 'STEM & Mathematics',
        shelf_location: 'Aisle B · Shelf 01',
        total_copies: 20
      });
      await loadLibrary();
    } catch (err) {
      console.error('Failed to add book:', err);
    }
  };

  const totalCopies = books.reduce((acc, b) => acc + Number(b.total_copies || 0), 0);
  const activeLoans = loans.filter((l) => l.status !== 'RETURNED').length;
  const overdueLoans = loans.filter((l) => l.status === 'OVERDUE').length;

  return (
    <>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Library System</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tenant-scoped books, shelf catalogs, and student borrowing records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddBook(true)}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Catalog New Book
          </button>
        </div>
      </div>

      {showAddBook && (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add Book to Campus Catalog</h3>
          <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Book Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              required
              placeholder="Author(s)"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="text"
              placeholder="Shelf Location"
              value={newBook.shelf_location}
              onChange={(e) => setNewBook({ ...newBook, shelf_location: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              type="number"
              required
              placeholder="Total Copies"
              value={newBook.total_copies}
              onChange={(e) => setNewBook({ ...newBook, total_copies: Number(e.target.value) })}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-[#146ef5] text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer">
                Save Book
              </button>
              <button type="button" onClick={() => setShowAddBook(false)} className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#146ef5] to-[#0a2e70] rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-between aspect-square text-white">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal">Total Volumes</h3>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight mb-2">{totalCopies}</h2>
            <p className="text-xs text-white/80">Across {books.length} cataloged titles</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Active Loans</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <UserGroupIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{activeLoans}</h2>
            <p className="text-xs text-gray-500">Issued to students & staff</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Overdue Items</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <BoltIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{overdueLoans}</h2>
            <p className="text-xs text-rose-500 font-semibold">Requires return notice</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-normal text-gray-900">Catalog Titles</h3>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-medium tracking-tight text-gray-900 mb-2">{books.length}</h2>
            <p className="text-xs text-gray-500">Verified ISBN records</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Library Book Catalog</h3>
          <span className="text-xs font-semibold text-[#146ef5] bg-blue-50 px-3 py-1 rounded-full">
            {loading ? 'Loading...' : `${books.length} Titles`}
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">ISBN</th>
              <th className="px-6 py-4">Title & Author</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Shelf</th>
              <th className="px-6 py-4">Available / Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map((b: any) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-[#146ef5] font-bold">{b.isbn || 'N/A'}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-sm text-gray-900">{b.title}</div>
                  <div className="text-xs text-gray-500">{b.author}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{b.category}</td>
                <td className="px-6 py-4 text-xs text-gray-600">{b.shelf_location}</td>
                <td className="px-6 py-4 text-xs font-bold text-emerald-700">
                  {b.available_copies} / {b.total_copies}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
