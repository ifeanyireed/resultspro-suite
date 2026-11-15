'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  BuildingOffice2Icon,
  ArchiveBoxIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import api, { getActiveTenantContext } from '@/lib/api';

export interface LibraryBookRecord {
  id: string;
  tenant_id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  shelf_location: string;
  total_copies: number;
  available_copies: number;
  status: string;
}

export interface LibraryLoanRecord {
  id: string;
  tenant_id: string;
  book_id: string;
  book_title: string;
  borrower_name: string;
  borrower_id?: string;
  borrower_role: 'student' | 'staff' | string;
  class_name?: string;
  issued_date: string;
  due_date: string;
  returned_date?: string;
  fine_amount: number;
  status: 'BORROWED' | 'OVERDUE' | 'RETURNED' | string;
}

export interface AvailableBorrowerStudent {
  id: string;
  student_name: string;
  admission_number: string;
  arm_name: string;
}

export interface AvailableBorrowerStaff {
  id: string;
  full_name: string;
  staff_number: string;
  designation: string;
}

const CATEGORIES = [
  'All Categories',
  'STEM & Mathematics',
  'African Literature (WAEC/NECO)',
  'Physical Sciences',
  'Chemical & Biological Sciences',
  'Languages & Humanities',
  'Commercial Studies',
  'ICT & Computer Science',
  'General Reference & Dictionaries',
];

export default function LibraryManager({ onBooksCountChange }: { onBooksCountChange?: (count: number) => void }) {
  const [books, setBooks] = useState<LibraryBookRecord[]>([]);
  const [loans, setLoans] = useState<LibraryLoanRecord[]>([]);
  const [availableStudents, setAvailableStudents] = useState<AvailableBorrowerStudent[]>([]);
  const [availableStaff, setAvailableStaff] = useState<AvailableBorrowerStaff[]>([]);

  const [activeSubtab, setActiveSubtab] = useState<'catalog' | 'circulation'>('catalog');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('ALL');
  const [selectedLoanStatus, setSelectedLoanStatus] = useState<string>('ALL');

  // Modals state
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<LibraryBookRecord | null>(null);
  const [deleteBookTarget, setDeleteBookTarget] = useState<LibraryBookRecord | null>(null);
  const [isIssueLoanModalOpen, setIsIssueLoanModalOpen] = useState<boolean>(false);
  const [preselectedBookForLoan, setPreselectedBookForLoan] = useState<LibraryBookRecord | null>(null);

  // Book Form State
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'STEM & Mathematics',
    shelf_location: 'Aisle B · Shelf 01',
    total_copies: 25,
  });

  // Loan Form State
  const [loanForm, setLoanForm] = useState({
    book_id: '',
    book_title: '',
    borrower_type: 'student',
    borrower_id: '',
    borrower_name: '',
    class_name: '',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  // Preload students & staff for borrower selector
  const fetchBorrowerRosters = useCallback(async () => {
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      const qs = params.toString() ? `?${params.toString()}` : '';

      // Students
      const sRes = await api.get(`/v1/campus/students${qs}`).catch(async () => {
        return await api.get(`/campus/students${qs}`);
      });
      if (sRes.data && Array.isArray(sRes.data)) {
        setAvailableStudents(sRes.data);
      }

      // Staff
      const stRes = await api.get(`/v1/campus/staff${qs}`).catch(async () => {
        return await api.get(`/campus/staff${qs}`);
      });
      if (stRes.data && stRes.data.staff && Array.isArray(stRes.data.staff)) {
        setAvailableStaff(stRes.data.staff);
      }
    } catch (err) {
      console.warn('Could not preload borrower rosters:', err);
    }
  }, []);

  // Fetch library books and loans with strict tenant isolation and zero fake fallbacks
  const fetchLibrary = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams();
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);
      if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const qs = params.toString() ? `?${params.toString()}` : '';

      const res = await api.get(`/v1/campus/library${qs}`).catch(async () => {
        return await api.get(`/campus/library${qs}`);
      });

      if (res.data) {
        const fetchedBooks: LibraryBookRecord[] = res.data.books || [];
        const fetchedLoans: LibraryLoanRecord[] = res.data.loans || [];

        setBooks(fetchedBooks);
        setLoans(fetchedLoans);

        if (onBooksCountChange) {
          onBooksCountChange(fetchedBooks.length);
        }
      } else {
        setBooks([]);
        setLoans([]);
      }
    } catch (err: any) {
      console.error('Failed to load library catalog:', err);
      // STRICT REQUIREMENT: No fallbacks! Report authoritative error to user
      setError(
        err?.response?.data?.error ||
        err?.message ||
        'Unable to load library records from the database. Please verify tenant database connection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchTerm, onBooksCountChange]);

  useEffect(() => {
    fetchBorrowerRosters();
  }, [fetchBorrowerRosters]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  // Open Add Book Modal
  const handleOpenAddBook = () => {
    setBookForm({
      title: '',
      author: '',
      isbn: '',
      category: 'STEM & Mathematics',
      shelf_location: 'Aisle B · Shelf 01',
      total_copies: 25,
    });
    setFormError(null);
    setIsAddBookModalOpen(true);
  };

  // Open Edit Book Modal
  const handleOpenEditBook = (book: LibraryBookRecord) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      category: book.category,
      shelf_location: book.shelf_location || '',
      total_copies: book.total_copies,
    });
    setFormError(null);
  };

  // Open Issue Loan Modal
  const handleOpenIssueLoan = (book?: LibraryBookRecord) => {
    const targetBook = book || books[0];
    setPreselectedBookForLoan(targetBook || null);
    const firstStudent = availableStudents[0];

    setLoanForm({
      book_id: targetBook ? targetBook.id : '',
      book_title: targetBook ? targetBook.title : '',
      borrower_type: 'student',
      borrower_id: firstStudent ? firstStudent.id : '',
      borrower_name: firstStudent ? firstStudent.student_name : '',
      class_name: firstStudent ? firstStudent.arm_name : '',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setFormError(null);
    setIsIssueLoanModalOpen(true);
  };

  // Submit Create Book
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      setFormError('Book title and author are required');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        ...bookForm,
        total_copies: Number(bookForm.total_copies) || 1,
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.post('/v1/campus/library', payload).catch(async () => {
        return await api.post('/campus/library', payload);
      });

      setIsAddBookModalOpen(false);
      setBannerSuccess(`Successfully cataloged "${bookForm.title}".`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchLibrary(true);
    } catch (err: any) {
      console.error('Failed to catalog book:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to catalog book.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Edit Book
  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      setFormError('Book title and author are required');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        record_type: 'book',
        id: editingBook.id,
        ...bookForm,
        total_copies: Number(bookForm.total_copies) || 1,
        available_copies: Math.min(editingBook.available_copies, Number(bookForm.total_copies) || 1),
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.put('/v1/campus/library', payload).catch(async () => {
        return await api.put('/campus/library', payload);
      });

      setEditingBook(null);
      setBannerSuccess(`Updated details for "${bookForm.title}".`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchLibrary(true);
    } catch (err: any) {
      console.error('Failed to update book:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to update book.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Delete Book
  const handleDeleteBook = async () => {
    if (!deleteBookTarget) return;
    setFormSubmitting(true);
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const params = new URLSearchParams({ id: deleteBookTarget.id });
      if (tenantId) params.append('tenant_id', tenantId);
      if (tenantSlug) params.append('tenant', tenantSlug);

      await api.delete(`/v1/campus/library?${params.toString()}`).catch(async () => {
        return await api.delete(`/campus/library?${params.toString()}`);
      });

      setBannerSuccess(`Book "${deleteBookTarget.title}" has been removed from catalog.`);
      setTimeout(() => setBannerSuccess(null), 5000);
      setDeleteBookTarget(null);
      fetchLibrary(true);
    } catch (err: any) {
      console.error('Failed to delete book:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to delete book.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Issue Loan
  const handleIssueLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanForm.book_id || !loanForm.borrower_name) {
      setFormError('Please select both a book and a borrower');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        record_type: 'loan',
        book_id: loanForm.book_id,
        book_title: loanForm.book_title,
        borrower_name: loanForm.borrower_name,
        borrower_id: loanForm.borrower_id,
        borrower_role: loanForm.borrower_type,
        class_name: loanForm.class_name,
        due_date: loanForm.due_date,
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.post('/v1/campus/library', payload).catch(async () => {
        return await api.post('/campus/library', payload);
      });

      setIsIssueLoanModalOpen(false);
      setBannerSuccess(`Issued "${loanForm.book_title}" to ${loanForm.borrower_name}. Due on ${loanForm.due_date}.`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchLibrary(true);
    } catch (err: any) {
      console.error('Failed to issue loan:', err);
      setFormError(err?.response?.data?.error || err?.message || 'Failed to issue book loan.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Return Book Action
  const handleReturnLoan = async (loan: LibraryLoanRecord) => {
    setFormSubmitting(true);
    try {
      const { tenantSlug, tenantId } = getActiveTenantContext();
      const payload = {
        loan_id: loan.id,
        status: 'RETURNED',
        tenant_id: tenantId,
        tenant: tenantSlug,
      };

      await api.put('/v1/campus/library', payload).catch(async () => {
        return await api.put('/campus/library', payload);
      });

      setBannerSuccess(`Book "${loan.book_title}" returned successfully. Copies updated.`);
      setTimeout(() => setBannerSuccess(null), 5000);
      fetchLibrary(true);
    } catch (err: any) {
      console.error('Failed to return book:', err);
      alert(err?.response?.data?.error || err?.message || 'Failed to process book return.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Aggregates
  const totalVolumes = books.reduce((acc, b) => acc + (b.total_copies || 0), 0);
  const totalAvailableVolumes = books.reduce((acc, b) => acc + (b.available_copies || 0), 0);
  const activeLoans = loans.filter((l) => l.status === 'BORROWED').length;
  const overdueLoans = loans.filter((l) => l.status === 'OVERDUE').length;

  // Filtered lists
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (selectedStockFilter === 'AVAILABLE' && (b.available_copies || 0) <= 0) return false;
      if (selectedStockFilter === 'BORROWED' && (b.available_copies || 0) === (b.total_copies || 0)) return false;
      return true;
    });
  }, [books, selectedStockFilter]);

  const filteredLoans = useMemo(() => {
    return loans.filter((l) => {
      if (selectedLoanStatus !== 'ALL' && l.status !== selectedLoanStatus) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesBorrower = l.borrower_name.toLowerCase().includes(q);
        const matchesBook = l.book_title.toLowerCase().includes(q);
        const matchesClass = (l.class_name || '').toLowerCase().includes(q);
        return matchesBorrower || matchesBook || matchesClass;
      }
      return true;
    });
  }, [loans, selectedLoanStatus, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Banner Notifications */}
      {bannerSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchLibrary(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-50"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Library &amp; Media Resource Center</h2>
          <p className="text-sm text-gray-500 mt-1">
            Institutional book accessioning, shelf catalog, student &amp; faculty borrowing ledger, and late penalties.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => fetchLibrary(true)}
            disabled={loading || refreshing}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#146ef5]' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => handleOpenIssueLoan()}
            className="bg-white border border-[#146ef5] text-[#146ef5] hover:bg-blue-50 text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all flex items-center gap-2"
          >
            <ArrowsRightLeftIcon className="w-4 h-4" />
            Issue Book Loan
          </button>
          <button
            onClick={handleOpenAddBook}
            className="bg-[#146ef5] hover:bg-[#105bd1] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#146ef5]/20 transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Catalog New Book
          </button>
        </div>
      </div>

      {/* Executive KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Volumes</span>
            <BookOpenIcon className="w-4 h-4 text-[#146ef5]" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalVolumes}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {totalAvailableVolumes} currently on shelf
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Catalog Titles</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{books.length}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Verified ISBN accessions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Loans</span>
            <ArrowsRightLeftIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{activeLoans}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Checked out to pupils &amp; staff</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue Items</span>
            <ClockIcon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{overdueLoans}</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">
            {overdueLoans > 0 ? 'Requires return notice' : 'Zero late returns'}
          </div>
        </div>
      </div>

      {/* Subtab Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveSubtab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubtab === 'catalog'
              ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <BookOpenIcon className="w-4 h-4" />
          <span>Book Catalog &amp; Shelf Inventory ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveSubtab('circulation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubtab === 'circulation'
              ? 'bg-[#146ef5] text-white shadow-sm shadow-[#146ef5]/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ArrowsRightLeftIcon className="w-4 h-4" />
          <span>Circulation &amp; Borrowing Ledger ({loans.length})</span>
          {overdueLoans > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold ml-1">
              {overdueLoans}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Live Search */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                activeSubtab === 'catalog'
                  ? 'Search by title, author, ISBN, or shelf location...'
                  : 'Search by borrower name, book title, or class...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5] text-gray-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {activeSubtab === 'catalog' ? (
              <>
                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Stock Filter */}
                <select
                  value={selectedStockFilter}
                  onChange={(e) => setSelectedStockFilter(e.target.value)}
                  aria-label="Filter by stock availability"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                >
                  <option value="ALL">All Stock Levels</option>
                  <option value="AVAILABLE">Available on Shelf</option>
                  <option value="BORROWED">Currently On Loan</option>
                </select>
              </>
            ) : (
              <>
                {/* Loan Status Filter */}
                <select
                  value={selectedLoanStatus}
                  onChange={(e) => setSelectedLoanStatus(e.target.value)}
                  aria-label="Filter by loan status"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#146ef5]/20 focus:border-[#146ef5]"
                >
                  <option value="ALL">All Loan Records</option>
                  <option value="BORROWED">Active Borrowings</option>
                  <option value="OVERDUE">Overdue Only</option>
                  <option value="RETURNED">Returned Log</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SUBTAB 1: BOOK CATALOG */}
      {activeSubtab === 'catalog' && (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-24 text-center">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-[#146ef5] mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">Loading library book catalog...</p>
              <p className="text-xs text-gray-400 mt-1">Single-database multi-tenant query</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="py-20 text-center px-4">
              <BookOpenIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No books found in catalog</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {searchTerm || selectedCategory !== 'All Categories'
                  ? 'No book titles match your search criteria. Try resetting the filters.'
                  : 'Your campus library has no cataloged books yet. Click "Catalog New Book" to start accessioning.'}
              </p>
              <button
                onClick={handleOpenAddBook}
                className="mt-4 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Catalog First Book
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Book Title &amp; Author</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">ISBN</th>
                    <th className="px-6 py-4">Shelf Allocation</th>
                    <th className="px-6 py-4">Available / Total</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredBooks.map((b) => {
                    const available = b.available_copies || 0;
                    const total = b.total_copies || 1;
                    const pct = Math.min(100, Math.round((available / total) * 100));

                    return (
                      <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Title & Author */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>{b.title}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">by {b.author}</div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#146ef5] border border-blue-100">
                            {b.category}
                          </span>
                        </td>

                        {/* ISBN */}
                        <td className="px-6 py-4 font-mono font-semibold text-gray-700 text-[11px]">
                          {b.isbn || '—'}
                        </td>

                        {/* Shelf Location */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                            <TagIcon className="w-3 h-3 text-gray-400" />
                            {b.shelf_location || 'General Stacks'}
                          </span>
                        </td>

                        {/* Availability */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className={`font-bold ${available > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                {available}
                              </span>
                              <span className="text-gray-400">/ {total} available</span>
                            </div>
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-[#146ef5]' : 'bg-rose-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenIssueLoan(b)}
                              disabled={available <= 0}
                              title={available <= 0 ? 'No copies available to loan' : 'Issue Book Loan'}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#146ef5] font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ArrowsRightLeftIcon className="w-3 h-3" />
                              <span>Loan</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditBook(b)}
                              title="Edit Book Details"
                              className="p-1.5 text-gray-400 hover:text-[#146ef5] hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteBookTarget(b)}
                              title="Delete Book"
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CIRCULATION & BORROWING LEDGER */}
      {activeSubtab === 'circulation' && (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-24 text-center">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-[#146ef5] mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">Loading circulation log...</p>
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="py-20 text-center px-4">
              <ArrowsRightLeftIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No circulation records found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {searchTerm || selectedLoanStatus !== 'ALL'
                  ? 'No loan records match your search filter.'
                  : 'No books are currently issued out. Click "Issue Book Loan" to check out a volume.'}
              </p>
              <button
                onClick={() => handleOpenIssueLoan()}
                className="mt-4 bg-[#146ef5] hover:bg-[#105bd1] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5"
              >
                <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                Issue First Loan
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Book Title</th>
                    <th className="px-6 py-4">Borrower Details</th>
                    <th className="px-6 py-4">Issued Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Loan Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredLoans.map((loan) => {
                    const isOverdue = loan.status === 'OVERDUE';
                    const isReturned = loan.status === 'RETURNED';

                    return (
                      <tr key={loan.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Book Title */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <BookOpenIcon className="w-4 h-4 text-[#146ef5] shrink-0" />
                            <span>{loan.book_title || 'Library Text'}</span>
                          </div>
                        </td>

                        {/* Borrower */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{loan.borrower_name}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                            <span className="uppercase text-[10px] bg-gray-100 px-1.5 py-0.2 rounded font-mono">
                              {loan.borrower_role}
                            </span>
                            {loan.class_name && <span>· {loan.class_name}</span>}
                          </div>
                        </td>

                        {/* Issued Date */}
                        <td className="px-6 py-4 font-mono text-[11px] text-gray-500">
                          {loan.issued_date || '—'}
                        </td>

                        {/* Due Date */}
                        <td className="px-6 py-4 font-mono text-[11px]">
                          <span className={isOverdue ? 'font-bold text-rose-600' : 'text-gray-700'}>
                            {loan.due_date}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isReturned
                                ? 'bg-gray-100 text-gray-700'
                                : isOverdue
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-blue-50 text-[#146ef5] border border-blue-100'
                            }`}
                          >
                            {isOverdue ? `OVERDUE (₦${loan.fine_amount || 500} fine)` : loan.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          {!isReturned ? (
                            <button
                              onClick={() => handleReturnLoan(loan)}
                              disabled={formSubmitting}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                            >
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              <span>Mark Returned</span>
                            </button>
                          ) : (
                            <span className="text-gray-400 text-[11px]">
                              Returned {loan.returned_date || ''}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Catalog New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Catalog New Book</h3>
                <p className="text-xs text-gray-500 mt-0.5">Register new library accession and shelf allocation</p>
              </div>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New General Mathematics for Senior Secondary Schools"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Author(s) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.F. Macrae et al. / Chinua Achebe"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    placeholder="978-0198422006"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Aisle B · Shelf 04"
                    value={bookForm.shelf_location}
                    onChange={(e) => setBookForm({ ...bookForm, shelf_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Copies Received</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={bookForm.total_copies}
                    onChange={(e) => setBookForm({ ...bookForm, total_copies: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-full shadow-sm shadow-[#146ef5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Catalog Book'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Book Accession</h3>
                <p className="text-xs text-gray-500 mt-0.5">Update shelf bay and inventory volume for {editingBook.title}</p>
              </div>
              <button
                onClick={() => setEditingBook(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateBook} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Author(s) *</label>
                <input
                  type="text"
                  required
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={bookForm.shelf_location}
                    onChange={(e) => setBookForm({ ...bookForm, shelf_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={bookForm.total_copies}
                    onChange={(e) => setBookForm({ ...bookForm, total_copies: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-full shadow-sm shadow-[#146ef5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Loan Modal */}
      {isIssueLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Issue Book Loan</h3>
                <p className="text-xs text-gray-500 mt-0.5">Check out library book to student pupil or teaching staff</p>
              </div>
              <button
                onClick={() => setIsIssueLoanModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleIssueLoan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Book from Catalog *</label>
                <select
                  required
                  value={loanForm.book_id}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const b = books.find((item) => item.id === selId);
                    setLoanForm({
                      ...loanForm,
                      book_id: selId,
                      book_title: b ? b.title : '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 font-semibold"
                >
                  <option value="">Select book...</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={(b.available_copies || 0) <= 0}>
                      {b.title} (Available: {b.available_copies || 0}/{b.total_copies})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Borrower Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoanForm({ ...loanForm, borrower_type: 'student', borrower_name: '', borrower_id: '', class_name: '' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      loanForm.borrower_type === 'student'
                        ? 'bg-blue-50 text-[#146ef5] border border-blue-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    Student Pupil
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanForm({ ...loanForm, borrower_type: 'staff', borrower_name: '', borrower_id: '', class_name: 'Faculty' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      loanForm.borrower_type === 'staff'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    Teaching Faculty
                  </button>
                </div>
              </div>

              {loanForm.borrower_type === 'student' ? (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Student Borrower *</label>
                  <select
                    required
                    value={loanForm.borrower_id}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const st = availableStudents.find((item) => item.id === selId);
                      setLoanForm({
                        ...loanForm,
                        borrower_id: selId,
                        borrower_name: st ? st.student_name : '',
                        class_name: st ? st.arm_name : '',
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="">Choose student from roster...</option>
                    {availableStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.student_name} ({s.arm_name || 'Enrolled'}) · {s.admission_number}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Staff Member *</label>
                  <select
                    required
                    value={loanForm.borrower_id}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const sf = availableStaff.find((item) => item.id === selId);
                      setLoanForm({
                        ...loanForm,
                        borrower_id: selId,
                        borrower_name: sf ? sf.full_name : '',
                        class_name: sf ? sf.designation : 'Faculty',
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="">Choose faculty from HR directory...</option>
                    {availableStaff.map((sf) => (
                      <option key={sf.id} value={sf.id}>
                        {sf.full_name} ({sf.designation || 'Staff'}) · {sf.staff_number}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Class / Department</label>
                  <input
                    type="text"
                    placeholder="e.g. SSS 2 Science A"
                    value={loanForm.class_name}
                    onChange={(e) => setLoanForm({ ...loanForm, class_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Return Due Date *</label>
                  <input
                    type="date"
                    required
                    value={loanForm.due_date}
                    onChange={(e) => setLoanForm({ ...loanForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsIssueLoanModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || !loanForm.book_id || !loanForm.borrower_name}
                  className="px-6 py-2 bg-[#146ef5] hover:bg-[#105bd1] text-white font-semibold rounded-full shadow-sm shadow-[#146ef5]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Issuing...
                    </>
                  ) : (
                    'Check Out Volume'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Book Confirmation */}
      {deleteBookTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Remove Book from Catalog?</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{deleteBookTarget.title}</span> ({deleteBookTarget.isbn || 'No ISBN'})? Any loan history associated with this accession will also be deleted.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                disabled={formSubmitting}
                onClick={() => setDeleteBookTarget(null)}
                className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={formSubmitting}
                onClick={handleDeleteBook}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-rose-600/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
