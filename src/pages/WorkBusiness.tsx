import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Layers
} from 'lucide-react';

export const WorkBusiness: React.FC = () => {
  const { 
    workLogs, 
    crmClients, 
    tasks,
    addWorkLog, 
    deleteWorkLog, 
    addCrmClient, 
    updateCrmClientStage, 
    deleteCrmClient,
    addTask,
    updateTask,
    deleteTask
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'internship' | 'business'>('internship');

  // Work Log form states
  const [showLogModal, setShowLogModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [logDesc, setLogDesc] = useState('');
  const [hours, setHours] = useState(6);
  const [deliverables, setDeliverables] = useState('');

  // CRM client form states
  const [showCrmModal, setShowCrmModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dealValue, setDealValue] = useState(1000);
  const [crmStage, setCrmStage] = useState<'lead' | 'contacted' | 'proposal' | 'contract' | 'active'>('lead');

  // Business Task states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubCat, setTaskSubCat] = useState('Marketing'); // Marketing, Sales, Team, Product, Website

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !logDesc.trim()) return;
    addWorkLog({
      date: new Date().toISOString().split('T')[0],
      companyName,
      description: logDesc,
      hoursWorked: hours,
      deliverables: deliverables || undefined
    });
    setCompanyName('');
    setLogDesc('');
    setHours(6);
    setDeliverables('');
    setShowLogModal(false);
  };

  const handleAddCrm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientCompany.trim()) return;
    addCrmClient({
      clientName,
      company: clientCompany,
      email: clientEmail || 'client@zenith.com',
      pipelineStage: crmStage,
      value: dealValue,
      lastContact: new Date().toISOString().split('T')[0]
    });
    setClientName('');
    setClientCompany('');
    setClientEmail('');
    setDealValue(1000);
    setShowCrmModal(false);
  };

  const handleAddBizTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle,
      category: 'business',
      subCategory: taskSubCat,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'not_started',
      subTasks: []
    });
    setTaskTitle('');
    setShowTaskModal(false);
  };

  const bizTasks = tasks.filter(t => t.category === 'business');
  const pipelineStages: { id: any; label: string; color: string }[] = [
    { id: 'lead', label: 'Leads', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
    { id: 'contacted', label: 'Contacted', color: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
    { id: 'proposal', label: 'Proposal', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300' },
    { id: 'contract', label: 'Contract Signed', color: 'bg-purple-500/10 border-purple-500/20 text-purple-300' },
    { id: 'active', label: 'Active Projects', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' }
  ];

  // Pipeline metrics
  const totalPipelineValue = crmClients.reduce((acc, c) => acc + c.value, 0);
  const activeProjectsCount = crmClients.filter(c => c.pipelineStage === 'active').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('internship')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'internship' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Internship Logbook</span>
          </button>
          <button
            onClick={() => setActiveSubTab('business')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'business' ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Business CRM & Tasks</span>
          </button>
        </div>

        {activeSubTab === 'internship' ? (
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Deliverable</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
              <span>Add Startup Task</span>
            </button>
            <button
              onClick={() => setShowCrmModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Add CRM Lead</span>
            </button>
          </div>
        )}
      </div>

      {/* --- Internship Work Log Section --- */}
      {activeSubTab === 'internship' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 p-5 rounded-3xl border border-white/5 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Internship Work Logs</h3>
            <div className="space-y-4">
              {workLogs.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No internship logs recorded. Log your hours to track work history!</p>
              ) : (
                workLogs.map(w => (
                  <div key={w.id} className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 space-y-2.5 transition-all group relative">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                          {w.companyName}
                        </span>
                        <h4 className="text-xs text-gray-400 font-semibold">{w.date}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                          {w.hoursWorked} hrs
                        </span>
                        <button
                          onClick={() => deleteWorkLog(w.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{w.description}</p>
                    {w.deliverables && (
                      <div className="text-[11px] text-gray-500 font-semibold">
                        Deliverable: <span className="text-gray-400 italic">{w.deliverables}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-white/5 glass-panel space-y-4 h-fit">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Work Progress Summary</h3>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-gray-500 font-semibold uppercase">Total Internship Hours</span>
                <span className="text-2xl font-bold text-white">
                  {workLogs.reduce((acc, cur) => acc + cur.hoursWorked, 0)} hrs
                </span>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Maintain daily entries here. This data helps you export clean reports for your college submissions or internship evaluations at the end of the term.
            </p>
          </div>
        </div>
      )}

      {/* --- Business & CRM Section --- */}
      {activeSubTab === 'business' && (
        <div className="space-y-6">
          {/* CRM metrics banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase">Total pipeline Value</span>
                <span className="text-xl font-bold text-gray-200">${totalPipelineValue.toLocaleString()}</span>
              </div>
              <DollarSign className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="p-4 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase">Active Projects</span>
                <span className="text-xl font-bold text-gray-200">{activeProjectsCount} Client Contracts</span>
              </div>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="p-4 rounded-3xl border border-white/5 glass-panel flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-gray-500 font-bold uppercase">Weekly Business Goals</span>
                <span className="text-xl font-bold text-gray-200">
                  {bizTasks.filter(t => t.status === 'completed').length}/{bizTasks.length} Completed
                </span>
              </div>
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          {/* CRM Kanban pipelines */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Sales CRM pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {pipelineStages.map(stage => {
                const clients = crmClients.filter(c => c.pipelineStage === stage.id);
                return (
                  <div key={stage.id} className="p-3 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 min-h-[250px]">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-gray-400 uppercase">{stage.label}</span>
                      <span className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded-full font-bold">
                        {clients.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {clients.map(c => (
                        <div 
                          key={c.id} 
                          className="p-3.5 rounded-xl bg-gray-900/60 border border-white/5 text-xs text-gray-300 space-y-2 group hover:border-blue-500/20"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-200 truncate max-w-[120px]">{c.clientName}</h4>
                              <span className="text-[10px] text-gray-500 block truncate">{c.company}</span>
                            </div>
                            <button
                              onClick={() => deleteCrmClient(c.id)}
                              className="p-1 text-gray-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] font-semibold pt-1 border-t border-white/5">
                            <span className="text-blue-400">${c.value}</span>
                            <span className="text-gray-500">Contacted {c.lastContact.slice(5)}</span>
                          </div>

                          {/* Quick stage toggle */}
                          <div className="flex gap-1 pt-1.5 justify-end">
                            {stage.id !== 'lead' && (
                              <button 
                                onClick={() => {
                                  const stages: any[] = ['lead', 'contacted', 'proposal', 'contract', 'active'];
                                  const idx = stages.indexOf(stage.id);
                                  updateCrmClientStage(c.id, stages[idx - 1]);
                                }}
                                className="px-1 text-[8px] bg-white/5 hover:bg-white/10 rounded"
                              >
                                ◀
                              </button>
                            )}
                            {stage.id !== 'active' && (
                              <button 
                                onClick={() => {
                                  const stages: any[] = ['lead', 'contacted', 'proposal', 'contract', 'active'];
                                  const idx = stages.indexOf(stage.id);
                                  updateCrmClientStage(c.id, stages[idx + 1]);
                                }}
                                className="px-1 text-[8px] bg-white/5 hover:bg-white/10 rounded"
                              >
                                ▶
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- WORK LOG ENTRY MODAL --- */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Log Internship Work Hours</h3>
            <form onSubmit={handleAddLog} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Uber Technologies"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2">
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Hours Logged</label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={hours}
                    onChange={e => setHours(parseInt(e.target.value) || 6)}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="text-center font-bold text-sm text-gray-200 bg-white/5 py-1 px-2.5 rounded-lg border border-white/5 mt-5">
                  {hours} Hours
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Task Description</label>
                <textarea
                  required
                  value={logDesc}
                  onChange={e => setLogDesc(e.target.value)}
                  placeholder="Describe your daily operations, bug fixes, or deliverables..."
                  className="w-full h-24 bg-[#060813] border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Key Deliverable link (Optional)</label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={e => setDeliverables(e.target.value)}
                  placeholder="e.g. PR merged #342"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Log Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD CRM CLIENT MODAL --- */}
      {showCrmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add CRM Pipeline Lead</h3>
            <form onSubmit={handleAddCrm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Alice Green"
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={clientCompany}
                    onChange={e => setClientCompany(e.target.value)}
                    placeholder="e.g. Nexus Retail"
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Deal Value ($)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={dealValue}
                    onChange={e => setDealValue(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Initial Stage</label>
                  <select
                    value={crmStage}
                    onChange={e => setCrmStage(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="lead">Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal">Proposal</option>
                    <option value="contract">Contract Signed</option>
                    <option value="active">Active Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Client Email (Optional)</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="e.g. alice@nexus.io"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCrmModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STARTUP TASK MODAL --- */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/5 glass-panel p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Add Startup Operation Task</h3>
            <form onSubmit={handleAddBizTask} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Create presentation deck for seed round"
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Business Function</label>
                <select
                  value={taskSubCat}
                  onChange={e => setTaskSubCat(e.target.value)}
                  className="w-full bg-[#060813] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50"
                >
                  <option value="Marketing">Marketing Campaign</option>
                  <option value="Sales">Sales Funnel</option>
                  <option value="Team Management">Team Management</option>
                  <option value="Product Development">Product Dev</option>
                  <option value="Website Management">Website & Hosting</option>
                  <option value="Startup Tasks">General Setup</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-2 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-glow"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
