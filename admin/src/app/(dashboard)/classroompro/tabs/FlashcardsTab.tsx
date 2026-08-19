import React from 'react';
import { Badge } from '@/components/Badge';
import { Layers, Search, Plus, TrendingUp } from 'lucide-react';

export default function FlashcardsTab() {
  const decks = [
    { id: '1', title: 'Periodic Table Elements', subject: 'Chemistry', cards: 118, masteries: 450, status: 'PUBLISHED' },
    { id: '2', title: 'French Vocabulary - Beginner', subject: 'Languages', cards: 50, masteries: 320, status: 'PUBLISHED' },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search SRS decks..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          />
        </div>
        <button className="bg-purple-600 text-white px-3.5 py-2 rounded-full text-xs font-bold hover:bg-purple-700 transition-colors flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Create SRS Deck</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Deck Title</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Total Cards</th>
              <th className="px-4 py-3">Student Masteries</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {decks.map((deck) => (
              <tr key={deck.id} className="hover:bg-purple-50/30 transition-colors group">
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>{deck.title}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-semibold">{deck.subject}</td>
                <td className="px-4 py-3.5 text-slate-800">{deck.cards} Cards</td>
                <td className="px-4 py-3.5 font-medium text-slate-800 text-xs flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>{deck.masteries}</span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge status={deck.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button className="text-purple-600 hover:underline font-semibold">Edit Deck</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
