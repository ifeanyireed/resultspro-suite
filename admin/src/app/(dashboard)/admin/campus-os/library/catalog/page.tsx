'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Library,
  BookMarked,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  BookOpen
} from 'lucide-react';
import { fetchLibraryBooks, LibraryBook } from '@/lib/campus-api';

const CATEGORIES = ['All Categories', 'African Literature', 'Mathematics & STEM', 'Physical Sciences', 'Chemical Sciences', 'African Fiction'];

export default function LibraryCatalogPage() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'African Literature',
    total_copies: 30,
    shelf_location: 'Aisle 1 / Bay A',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);
    const data = await fetchLibraryBooks();
    setBooks(data);
    setLoading(false);
  }

  function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    const created: LibraryBook = {
      id: `bk-${Date.now()}`,
      tenant_id: 'tenant_default',
      ...newBook,
      available_copies: newBook.total_copies,
    };

    setBooks((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      category: 'African Literature',
      total_copies: 30,
      shelf_location: 'Aisle 1 / Bay A',
    });
  }

  const filteredBooks = books.filter((b) => {
    const matchesCat = selectedCat === 'All Categories' || b.category === selectedCat;
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.isbn && b.isbn.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book to Catalog</span>
        </button>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Book Directory & ISBN Registry</h3>
            <p className="text-xs text-slate-500">Track book copies, physical shelf locations, and circulation availability</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            {filteredBooks.length} Titles Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3 px-4">Book Title & Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4">Shelf / Bay</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBooks.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{bk.title}</div>
                    <div className="text-[11px] text-slate-500">{bk.author}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{bk.category}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{bk.isbn || '—'}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                      {bk.shelf_location}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{bk.available_copies}</span>
                      <span className="text-slate-400">/ {bk.total_copies} available</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/admin/campus-os/library/loans"
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#146ef5] font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Issue Loan</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Book to Catalog</h3>
            <p className="text-xs text-slate-500 mb-4">Register new library accession and shelf allocation</p>

            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Things Fall Apart"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinua Achebe"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">ISBN</label>
                  <input
                    type="text"
                    placeholder="978-0385474542"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Shelf Location</label>
                  <input
                    type="text"
                    placeholder="Aisle 3 / Bay B"
                    value={newBook.shelf_location}
                    onChange={(e) => setNewBook({ ...newBook, shelf_location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#146ef5] hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
