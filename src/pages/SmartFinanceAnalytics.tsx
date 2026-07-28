import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  CircleDollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Wallet, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const SmartFinanceAnalytics: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, getBudgetSummary } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState(500);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<'food' | 'rent' | 'bills' | 'investments' | 'sip' | 'salary' | 'business' | 'other'>('food');

  const summary = getBudgetSummary();

  // Category Breakdown Calculations
  const categoryTotals: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const totalExpense = summary.expenses || 1;

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    addTransaction({
      description: desc.trim(),
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0]
    });

    setDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/60 via-[#0B0F19] to-emerald-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-glow">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Smart Financial Analytics & Budgeting
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Real-time category spending distribution, monthly savings target meters, and expense limits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Monthly Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">₹{summary.income.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-rose-500/20 bg-rose-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">₹{summary.expenses.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-teal-500/20 bg-teal-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Monthly Savings</span>
            <Wallet className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">₹{summary.savings.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Category Spending Breakdown */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4 bg-white/[0.01]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-teal-400" />
          Category Spending Distribution Breakdown
        </h3>

        <div className="space-y-3">
          {Object.keys(categoryTotals).length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500">No expense records logged yet.</div>
          ) : (
            Object.entries(categoryTotals).map(([cat, total]) => {
              const percent = Math.round((total / totalExpense) * 100);
              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-300">{cat}</span>
                    <span className="text-teal-400">₹{total.toLocaleString()} ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          Recent Financial Transactions ({transactions.length})
        </h3>

        <div className="space-y-2">
          {transactions.slice(0, 10).map(tx => (
            <div key={tx.id} className="p-4 rounded-2xl glass-panel border border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-gray-400 uppercase">
                  {tx.category}
                </span>
                <h4 className="text-xs font-bold text-white">{tx.description}</h4>
                <p className="text-[10px] text-gray-500">{tx.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-extrabold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </span>

                <button onClick={() => deleteTransaction(tx.id)} className="text-gray-500 hover:text-rose-400 p-1 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-teal-400" />
              Add Transaction Record
            </h3>

            <form onSubmit={handleAddTx} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="e.g. Monthly Broadband Bill"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="food">Food & Dining</option>
                  <option value="rent">Rent</option>
                  <option value="bills">Bills & Utilities</option>
                  <option value="investments">Investments</option>
                  <option value="sip">SIP / Savings</option>
                  <option value="salary">Salary</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-glow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
