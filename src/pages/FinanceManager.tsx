import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  CircleDollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend
} from 'recharts';

export const FinanceManager: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, getBudgetSummary } = useData();

  // Form states
  const [showTxModal, setShowTxModal] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState(100);
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<any>('food');

  const budget = getBudgetSummary();
  const warningActive = budget.budgetUsedPercent >= 80;

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || amount <= 0) return;
    addTransaction({
      description: desc,
      amount,
      type: txType,
      category,
      date: new Date().toISOString().split('T')[0]
    });
    setDesc('');
    setAmount(100);
    setShowTxModal(false);
  };

  // Pie chart calculation
  const categoriesList = ['food', 'rent', 'bills', 'investments', 'sip', 'salary', 'business', 'other'];
  const pieData = categoriesList.map(cat => {
    const val = transactions
      .filter(t => t.category === cat && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: cat.toUpperCase(), value: val };
  }).filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#6b7280'];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Total Income */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Income</span>
            <h3 className="text-2xl font-extrabold text-emerald-400">${budget.income}</h3>
            <span className="text-[10px] text-gray-500 font-medium block">Current Month</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Expenses</span>
            <h3 className="text-2xl font-extrabold text-rose-400">${budget.expenses}</h3>
            <span className="text-[10px] text-gray-500 font-medium block">/ $1,500 Cap Limit</span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Net Savings */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Net Savings</span>
            <h3 className="text-2xl font-extrabold text-blue-400">${budget.savings}</h3>
            <span className="text-[10px] text-gray-500 font-medium block">Saved or Invested</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>

        {/* Action panel */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between">
          <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quick Actions</span>
          <button
            onClick={() => setShowTxModal(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-1 transition-all mt-3"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

      </div>

      {/* Row 2: Budget Warning */}
      {warningActive ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold">Monthly Budget Threshold Alert!</h4>
            <p className="text-[11px] text-rose-400/80 leading-relaxed mt-0.5">
              You have spent ${budget.expenses} which corresponds to {budget.budgetUsedPercent}% of your maximum monthly target threshold ($1500). Consider minimizing luxury purchases.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold">Spending is on track</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
              Budget utilization is safe. You have saved ${budget.savings} this month. Excellent discipline!
            </p>
          </div>
        </div>
      )}

      {/* Row 3: Transaction List & Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent transaction list */}
        <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Transaction Ledger</h3>
          <div className="overflow-x-auto max-h-96 pr-1 scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-gray-500">
                      No transactions recorded. Click "Add Transaction" to start.
                    </td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} className="text-xs text-gray-300 hover:bg-white/[0.01]">
                      <td className="py-3 text-gray-500 font-semibold">{t.date}</td>
                      <td className="font-semibold text-gray-200">{t.description}</td>
                      <td>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-white/5 rounded text-gray-400 uppercase">
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <span className={`font-bold ${
                          t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1 text-gray-500 hover:text-rose-400 rounded hover:bg-white/5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses distribution chart */}
        <div className="p-5 rounded-3xl border border-white/5 glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Expenses Distribution</h3>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Summary of expenses by categories.</p>
          </div>
          
          <div className="h-60 mt-4 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No expenses logged to display chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* --- ADD TRANSACTION MODAL --- */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Transaction Ledger</h3>
            <form onSubmit={handleAddTx} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="e.g. Freelance Design Client Payment"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={e => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={e => setTxType(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Budget Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="food">Food & Dinings</option>
                  <option value="rent">Rent / Accommodations</option>
                  <option value="sip">SIP Mutual Funds</option>
                  <option value="investments">Investments</option>
                  <option value="bills">Utility Bills</option>
                  <option value="salary">Salary Payment</option>
                  <option value="business">Freelance Business</option>
                  <option value="other">Other Outflow</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Log Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
