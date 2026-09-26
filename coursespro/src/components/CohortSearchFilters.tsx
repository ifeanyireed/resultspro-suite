'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';

export default function CohortSearchFilters({ 
  difficulties = [], 
  statuses = [] 
}: { 
  difficulties?: string[],
  statuses?: string[]
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  // Synchronize state with URL search params when they change
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setStatus(searchParams.get('status') || '');
    setDifficulty(searchParams.get('difficulty') || '');
  }, [searchParams]);

  const handleFilter = (q: string, s: string, d: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set('q', q); else params.delete('q');
    if (s) params.set('status', s); else params.delete('status');
    if (d) params.set('difficulty', d); else params.delete('difficulty');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilter(query, status, difficulty);
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-8 items-center">
      <div className="relative flex-1 w-full">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search cohorts by title or description..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Auto submit can be annoying for typing, but let's allow search button or enter
          }}
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        {statuses.length > 0 && (
          <select 
            className="w-full md:w-40 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              handleFilter(query, e.target.value, difficulty);
            }}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        
        {difficulties.length > 0 && (
          <select 
            className="w-full md:w-40 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              handleFilter(query, status, e.target.value);
            }}
          >
            <option value="">All Levels</option>
            {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}

        <button type="submit" className="btn btn-navy py-2 px-6 rounded-xl hidden md:block" disabled={isPending}>
          Search
        </button>
      </div>
    </form>
  );
}
