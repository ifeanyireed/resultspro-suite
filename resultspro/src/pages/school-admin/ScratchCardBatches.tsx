import React, { useState, useEffect } from 'react';
import { Eye, Download, Edit, X, AlertCircle } from 'lucide-react';

interface Card {
  id: string;
  pin: string;
  isActive: boolean;
  usesRemaining: number;
  usageCount: number;
  lastUsedAt?: string;
}

interface Batch {
  id: string;
  batchCode: string;
  quantity: number;
  status: string;
  cards: Card[];
}

interface BatchStats {
  total: number;
  active: number;
  used: number;
  depleted: number;
}

const ScratchCardBatches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [totals, setTotals] = useState<{
    totalCards: number;
    activeCards: number;
    usedCards: number;
    depletedCards: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cardFilter, setCardFilter] = useState('all');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/school/scratch-cards/batches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBatches(data.data.batches);
        setTotals(data.data.totals);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportBatch = async (batchId: string, batchCode: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/school/scratch-cards/export?format=csv`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cards_${batchCode}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleToggleCard = async (cardId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/school/scratch-cards/cards/${cardId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isActive: !currentStatus })
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchBatches();
      }
    } catch (error) {
      console.error('Error toggling card:', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Scratch Card Batches</h1>
        <p className="text-gray-400">Manage and dispense your allocated card batches</p>
      </div>

      {/* Totals */}
      {totals && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Total Cards</p>
            <p className="text-2xl font-bold">{totals.totalCards}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Active</p>
            <p className="text-2xl font-bold text-green-400">{totals.activeCards}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Used</p>
            <p className="text-2xl font-bold text-orange-400">{totals.usedCards}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-gray-400 text-xs mb-1">Depleted</p>
            <p className="text-2xl font-bold text-red-400">{totals.depletedCards}</p>
          </div>
        </div>
      )}

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((batch) => (
          <div key={batch.id} className="rounded-[20px] border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{batch.batchCode}</h3>
                <p className="text-sm text-gray-400">{batch.quantity} cards</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                batch.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {batch.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Cards:</span>
                <span className="text-white font-medium">{batch.cards.filter(c => c.isActive && c.usesRemaining > 0).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Used:</span>
                <span className="text-white font-medium">{batch.cards.filter(c => c.usageCount > 0).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Depleted:</span>
                <span className="text-white font-medium">{batch.cards.filter(c => c.usesRemaining === 0).length}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setSelectedBatch(batch);
                  setShowDetailsModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View Cards
              </button>
              <button
                onClick={() => handleExportBatch(batch.id, batch.batchCode)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-[20px] border border-white/10 p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{selectedBatch.batchCode} - Cards</h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {['all', 'active', 'used', 'depleted'].map((f) => (
                <button
                  key={f}
                  onClick={() => setCardFilter(f)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors ${
                    cardFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Cards Table */}
            <div className="rounded-lg border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">PIN</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Uses Remaining</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Used</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBatch.cards
                    .filter((card) => {
                      if (cardFilter === 'active') return card.isActive && card.usesRemaining > 0;
                      if (cardFilter === 'used') return card.usageCount > 0;
                      if (cardFilter === 'depleted') return card.usesRemaining === 0;
                      return true;
                    })
                    .map((card) => (
                      <tr key={card.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white font-mono">{card.pin}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            card.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {card.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white">{card.usesRemaining}</td>
                        <td className="py-3 px-4 text-white">{card.usageCount}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchCardBatches;
