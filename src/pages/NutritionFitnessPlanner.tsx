import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Flame, 
  Plus, 
  Trash2, 
  Utensils, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  PieChart
} from 'lucide-react';

interface MealLog {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number;
}

export const NutritionFitnessPlanner: React.FC = () => {
  const currentDateStr = new Date().toISOString().split('T')[0];

  // Water Glasses state (12 glasses max, 250ml each)
  const [glassesDrunk, setGlassesDrunk] = useState<number>(() => {
    const saved = localStorage.getItem(`z_water_${currentDateStr}`);
    return saved ? Number(saved) : 5;
  });

  // Meals state
  const [meals, setMeals] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem(`z_meals_${currentDateStr}`);
    return saved ? JSON.parse(saved) : [
      { id: 'm1', name: 'Oats with Milk & Banana', type: 'Breakfast', calories: 420, protein: 18 },
      { id: 'm2', name: 'Grilled Chicken / Paneer Rice Bowl', type: 'Lunch', calories: 650, protein: 45 },
      { id: 'm3', name: 'Organic Whey Protein Shake', type: 'Snack', calories: 140, protein: 26 }
    ];
  });

  // Target Macros
  const targetCal = 2200;
  const targetProtein = 120; // grams

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [mealCal, setMealCal] = useState(350);
  const [mealProt, setMealProt] = useState(20);

  useEffect(() => {
    localStorage.setItem(`z_water_${currentDateStr}`, glassesDrunk.toString());
  }, [glassesDrunk, currentDateStr]);

  useEffect(() => {
    localStorage.setItem(`z_meals_${currentDateStr}`, JSON.stringify(meals));
  }, [meals, currentDateStr]);

  const totalCal = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    setMeals(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: mealName.trim(),
        type: mealType,
        calories: Number(mealCal),
        protein: Number(mealProt)
      }
    ]);

    setMealName('');
    setShowAddMeal(false);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleGlass = (idx: number) => {
    if (glassesDrunk === idx + 1) {
      setGlassesDrunk(idx);
    } else {
      setGlassesDrunk(idx + 1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#0B0F19] to-amber-950/40 border border-white/10 glass-panel shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-glow">
              <Utensils className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Nutrition, Macros & Hydration Tracker
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Track daily water intake, calorie budgets, protein targets, and meal logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddMeal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold shadow-glow transition-all z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meal / Protein</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Calories Progress */}
        <div className="p-5 rounded-2xl glass-panel border border-rose-500/20 bg-rose-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calories Consumption</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalCal}</span>
            <span className="text-xs text-rose-400 font-bold">/ {targetCal} kcal</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" style={{ width: `${Math.min(100, (totalCal / targetCal) * 100)}%` }} />
          </div>
        </div>

        {/* Protein Target */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Protein Goal</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalProtein}g</span>
            <span className="text-xs text-amber-400 font-bold">/ {targetProtein}g</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }} />
          </div>
        </div>

        {/* Water Hydration */}
        <div className="p-5 rounded-2xl glass-panel border border-blue-500/20 bg-blue-500/[0.02] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hydration Intake</span>
            <Droplet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{(glassesDrunk * 0.25).toFixed(2)}L</span>
            <span className="text-xs text-blue-400 font-bold">/ 3.0L Target</span>
          </div>
          <p className="text-[10px] text-gray-500">{glassesDrunk} of 12 glasses drunk today</p>
        </div>

      </div>

      {/* Water Hydration Glass Grid */}
      <div className="p-6 rounded-3xl glass-panel border border-blue-500/20 bg-blue-500/[0.01] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Droplet className="w-4 h-4 text-blue-400" />
          Interactive 3-Litre Hydration Tracker (Tap glass to log water)
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
          {Array.from({ length: 12 }).map((_, idx) => {
            const isFull = idx < glassesDrunk;
            return (
              <button
                key={idx}
                onClick={() => handleToggleGlass(idx)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                  isFull 
                    ? 'bg-blue-600/30 border-blue-500 text-blue-400 shadow-glow scale-105' 
                    : 'bg-white/5 border-white/5 text-gray-600 hover:border-blue-400/40'
                }`}
              >
                <Droplet className={`w-6 h-6 ${isFull ? 'fill-blue-400' : ''}`} />
                <span className="text-[9px] font-bold">250 ml</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Meal Log Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Utensils className="w-4 h-4 text-rose-400" />
          Today's Food & Meal Log ({meals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meals.map(meal => (
            <div 
              key={meal.id}
              className="p-4 rounded-2xl glass-panel border border-white/5 bg-white/[0.01] flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-gray-400 uppercase">
                  {meal.type}
                </span>
                <h4 className="text-xs font-bold text-white">{meal.name}</h4>
                <p className="text-[10px] text-gray-400">
                  🔥 {meal.calories} kcal • 💪 {meal.protein}g Protein
                </p>
              </div>

              <button
                onClick={() => handleDeleteMeal(meal.id)}
                className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 bg-[#070b14] space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-400" />
              Log Meal / Protein Shake
            </h3>

            <form onSubmit={handleAddMeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Meal Description</label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={e => setMealName(e.target.value)}
                  placeholder="e.g. Eggs & Whole Wheat Toast"
                  className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={e => setMealType(e.target.value as any)}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={mealCal}
                    onChange={e => setMealCal(Number(e.target.value))}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={mealProt}
                    onChange={e => setMealProt(Number(e.target.value))}
                    className="w-full bg-[#060813] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMeal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-glow"
                >
                  Save Meal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
