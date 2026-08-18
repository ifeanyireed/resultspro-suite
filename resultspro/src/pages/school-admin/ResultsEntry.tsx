import React, { useState } from 'react';
import { Plus } from '@/lib/hugeicons-compat';

const ResultsEntry: React.FC = () => {
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    student: '',
    score: '',
  });

  const recentEntries = [
    { student: 'Chioma Okafor', class: 'SS3A', subject: 'Mathematics', score: 87, time: '2 hours ago' },
    { student: 'Tunde Adeyemi', class: 'SS3A', subject: 'English', score: 92, time: '3 hours ago' },
    { student: 'Amara Nwosu', class: 'SS3B', subject: 'Physics', score: 78, time: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Results Entry</h2>
        <p className="text-gray-400 text-sm mt-1">Manually enter student results</p>
      </div>

      {/* Entry Form */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Enter New Result</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Class</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option>Select Class</option>
              <option>SS3A</option>
              <option>SS3B</option>
              <option>SS2A</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option>Select Subject</option>
              <option>Mathematics</option>
              <option>English Language</option>
              <option>Physics</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Student</label>
            <select
              value={formData.student}
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option>Select Student</option>
              <option>Chioma Okafor</option>
              <option>Tunde Adeyemi</option>
              <option>Amara Nwosu</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Score (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              placeholder="Enter score"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-colors">
            Clear
          </button>
          <button className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors">
            Save Result
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Today's Entries</p>
          <p className="text-3xl font-bold text-white">24</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">This Week</p>
          <p className="text-3xl font-bold text-white">128</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(255,255,255,0.07)] p-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">This Month</p>
          <p className="text-3xl font-bold text-white">487</p>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Entries</h3>
        <div className="space-y-3">
          {recentEntries.map((entry, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-white/5 hover:bg-white/5">
              <div>
                <p className="text-white font-medium">{entry.student}</p>
                <p className="text-gray-500 text-xs">
                  {entry.class} • {entry.subject}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{entry.score}</p>
                <p className="text-gray-500 text-xs">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsEntry;
