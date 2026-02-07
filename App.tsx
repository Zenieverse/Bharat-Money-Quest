
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import QuestEngine from './components/QuestEngine';
import { UserProfile, PersonaType, FinancialGoal, Quest, QuestChoice } from './types';
import { QUESTS, TOOLKIT, DAILY_CHALLENGE } from './data';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // For onboarding form
  const [formName, setFormName] = useState('');
  const [formPersona, setFormPersona] = useState<PersonaType>(PersonaType.STUDENT);
  const [formGoal, setFormGoal] = useState<FinancialGoal>(FinancialGoal.SAVE_BETTER);

  useEffect(() => {
    const saved = localStorage.getItem('bharat_money_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      name: formName || 'Guest User',
      persona: formPersona,
      goal: formGoal,
      xp: 0,
      coins: 100,
      level: 'Beginner Saver',
      healthScore: 50,
      badges: [],
      completedQuests: []
    };
    setUser(newUser);
    localStorage.setItem('bharat_money_user', JSON.stringify(newUser));
    setShowOnboarding(false);
  };

  const handleQuestComplete = (choice: QuestChoice) => {
    if (!user || !selectedQuest) return;

    const updatedQuests = [...user.completedQuests];
    if (!updatedQuests.includes(selectedQuest.id)) {
      updatedQuests.push(selectedQuest.id);
    }

    const newXp = user.xp + choice.xpReward;
    let newLevel = user.level;
    if (newXp > 500) newLevel = 'Finance Explorer';
    if (newXp > 1000) newLevel = 'Wealth Builder';

    const updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      coins: user.coins + choice.coinReward,
      healthScore: Math.min(100, Math.max(0, user.healthScore + choice.healthDelta)),
      completedQuests: updatedQuests,
      level: newLevel
    };

    setUser(updatedUser);
    localStorage.setItem('bharat_money_user', JSON.stringify(updatedUser));
    setSelectedQuest(null);
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🇮🇳</div>
            <h1 className="text-2xl font-bold text-gray-800">Bharat Money Quest</h1>
            <p className="text-gray-500 mt-2">Start your financial journey!</p>
          </div>
          
          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What is your name?</label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Rajesh" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select your track</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(PersonaType).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormPersona(p)}
                    className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      formPersona === p ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your main goal?</label>
              <select 
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value as FinancialGoal)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                {Object.values(FinancialGoal).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Enter the Quest
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24">
      <Header user={user} />

      <main className="p-4 max-w-2xl mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Quest Map</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUESTS.map((quest) => {
                  const isCompleted = user.completedQuests.includes(quest.id);
                  return (
                    <button
                      key={quest.id}
                      onClick={() => setSelectedQuest(quest)}
                      className="text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{quest.icon}</span>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          quest.category === 'Beginner' ? 'bg-green-100 text-green-700' :
                          quest.category === 'Digital' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {quest.category}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600">{quest.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{quest.description}</p>
                      
                      <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <span className="text-xs font-semibold text-gray-400">{quest.rewardInfo}</span>
                        {isCompleted ? (
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            ✅ Done
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                            Play Now →
                          </span>
                        )}
                      </div>
                      {isCompleted && (
                        <div className="absolute top-0 right-0 w-12 h-12 bg-green-500 rotate-45 translate-x-6 -translate-y-6 flex items-end justify-center pb-1">
                          <span className="text-white text-[8px] font-bold -rotate-45">SAVED</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">NCFE Learning Path</h3>
                <p className="text-sm text-blue-100 mb-4">Aligned with India's National Strategy for Financial Education.</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <div className="bg-white/20 px-2 py-1 rounded">Financial Planning</div>
                  <div className="bg-white/20 px-2 py-1 rounded">Risk Protection</div>
                  <div className="bg-white/20 px-2 py-1 rounded">Responsible Borrowing</div>
                  <div className="bg-white/20 px-2 py-1 rounded">Digital Safety</div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-20">🏛️</div>
            </section>
          </div>
        )}

        {activeTab === 'quests' && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-gray-800">Advanced Missions</h2>
             <p className="text-gray-500 text-sm">Unlock these by reaching "Finance Explorer" level.</p>
             <div className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-4">🔒</span>
                <p className="font-bold text-gray-400">Locked Quests</p>
                <p className="text-xs text-gray-400 mt-1">Keep playing beginner quests to earn more XP!</p>
             </div>
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h2 className="text-xl font-bold text-gray-800">Daily Challenge</h2>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-6">{DAILY_CHALLENGE.question}</p>
              <div className="space-y-3">
                {DAILY_CHALLENGE.options.map((opt, i) => (
                  <button key={i} className="w-full p-4 rounded-xl border border-gray-200 text-left font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                <p className="text-xs font-bold text-yellow-700">Win 20 Bonus Coins!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'toolkit' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Money Toolkit</h2>
            {TOOLKIT.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-4 items-start shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 border-white shadow-lg">
                👤
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-blue-600 font-semibold">{user.level}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Total XP</p>
                  <p className="text-2xl font-bold text-gray-800">{user.xp}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Quests Done</p>
                  <p className="text-2xl font-bold text-gray-800">{user.completedQuests.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Your Badges</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-2xl mb-1 grayscale opacity-30 border-2 border-dashed border-gray-300">🏅</div>
                  <span className="text-[10px] font-bold text-gray-400">Budget Hero</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-1 grayscale opacity-30 border-2 border-dashed border-gray-300">🔥</div>
                  <span className="text-[10px] font-bold text-gray-400">Streak King</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-1 grayscale opacity-30 border-2 border-dashed border-gray-300">🛡️</div>
                  <span className="text-[10px] font-bold text-gray-400">Fraud Shield</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedQuest && (
        <QuestEngine 
          quest={selectedQuest} 
          user={user}
          onComplete={handleQuestComplete}
          onClose={() => setSelectedQuest(null)}
        />
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
