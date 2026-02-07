
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import QuestEngine from './components/QuestEngine';
import { UserProfile, PersonaType, FinancialGoal, Quest, QuestChoice } from './types';
import { QUESTS, TOOLKIT, DAILY_CHALLENGES } from './data';

const MOCK_LEADERBOARD = [
  { name: 'Arjun S.', xp: 2450, level: 'Wealth Builder', avatar: '🦁' },
  { name: 'Priya K.', xp: 2100, level: 'Wealth Builder', avatar: '🌸' },
  { name: 'Deepak M.', xp: 1850, level: 'Finance Explorer', avatar: '👨‍🌾' },
  { name: 'Meera V.', xp: 1620, level: 'Finance Explorer', avatar: '🎨' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dailyResult, setDailyResult] = useState<{ correct: boolean, explanation: string } | null>(null);
  const [currentDaily, setCurrentDaily] = useState(DAILY_CHALLENGES[0]);

  useEffect(() => {
    // Select daily based on day of month
    const day = new Date().getDate();
    setCurrentDaily(DAILY_CHALLENGES[day % DAILY_CHALLENGES.length]);

    const saved = localStorage.getItem('bharat_money_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      const todayStr = new Date().toDateString();
      if (parsed.lastDailyDate !== todayStr) {
        parsed.hasAnsweredDailyToday = false;
      }
      setUser(parsed);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const saveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('bharat_money_user', JSON.stringify(updatedUser));
  };

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
      completedQuests: [],
      lastDailyDate: null,
      hasAnsweredDailyToday: false
    };
    saveUser(newUser);
    setShowOnboarding(false);
  };

  const checkBadges = (updatedUser: UserProfile) => {
    const badges = [...updatedUser.badges];
    if (updatedUser.completedQuests.length >= 1 && !badges.includes('🏅 Budget Hero')) {
      badges.push('🏅 Budget Hero');
    }
    if (updatedUser.xp >= 500 && !badges.includes('🔥 Savings Streak')) {
      badges.push('🔥 Savings Streak');
    }
    if (updatedUser.healthScore >= 90 && !badges.includes('🛡 Fraud Protector')) {
      badges.push('🛡 Fraud Protector');
    }
    if (updatedUser.completedQuests.length >= QUESTS.length && !badges.includes('📈 Smart Investor')) {
      badges.push('📈 Smart Investor');
    }
    return badges;
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
    if (newXp > 2500) newLevel = 'Bharat Money Champion';

    let updatedUser: UserProfile = {
      ...user,
      xp: newXp,
      coins: user.coins + choice.coinReward,
      healthScore: Math.min(100, Math.max(0, user.healthScore + choice.healthDelta)),
      completedQuests: updatedQuests,
      level: newLevel,
      badges: user.badges
    };
    
    updatedUser.badges = checkBadges(updatedUser);
    saveUser(updatedUser);
    setSelectedQuest(null);
  };

  const handleDailyAnswer = (index: number) => {
    if (!user || user.hasAnsweredDailyToday) return;

    const isCorrect = index === currentDaily.correctIndex;
    const todayStr = new Date().toDateString();
    
    const updatedUser: UserProfile = {
      ...user,
      xp: user.xp + (isCorrect ? currentDaily.reward : 5),
      coins: user.coins + (isCorrect ? 20 : 0),
      lastDailyDate: todayStr,
      hasAnsweredDailyToday: true
    };

    setDailyResult({ correct: isCorrect, explanation: currentDaily.explanation });
    saveUser(updatedUser);
  };

  // For onboarding form
  const [formName, setFormName] = useState('');
  const [formPersona, setFormPersona] = useState<PersonaType>(PersonaType.STUDENT);
  const [formGoal, setFormGoal] = useState<FinancialGoal>(FinancialGoal.SAVE_BETTER);

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm rotate-3">🇮🇳</div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bharat Money Quest</h1>
            <p className="text-gray-500 font-medium mt-3">Ready to master your money?</p>
          </div>
          
          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2 px-1">What's your name?</label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Rajesh or Priya" 
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-2 px-1">Who are you?</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(PersonaType).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormPersona(p)}
                    className={`py-4 rounded-2xl border-2 text-sm font-black transition-all active:scale-95 ${
                      formPersona === p ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
            >
              Start My Journey 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-28 bg-slate-50">
      <Header user={user} />

      <main className="p-5 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        {activeTab === 'home' && (
          <>
            <section className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
               <div className="relative z-10">
                 <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Current Progress</p>
                 <h2 className="text-2xl font-black mb-4">Level Up Your Wallet!</h2>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>XP: {user.xp} / {user.xp < 500 ? 500 : user.xp < 1000 ? 1000 : 2500}</span>
                      <span>Next Rank: {user.xp < 500 ? 'Explorer' : 'Champion'}</span>
                    </div>
                    <div className="w-full h-3 bg-blue-900/30 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-white transition-all duration-1000" 
                        style={{ width: `${(user.xp % 500) / 5}%` }}
                      />
                    </div>
                 </div>
               </div>
               <div className="absolute -right-8 -bottom-8 text-9xl opacity-10">💸</div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-black text-gray-900">Featured Quests</h2>
                <button onClick={() => setActiveTab('quests')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {QUESTS.slice(0, 3).map((quest) => {
                  const isCompleted = user.completedQuests.includes(quest.id);
                  return (
                    <button
                      key={quest.id}
                      onClick={() => setSelectedQuest(quest)}
                      className={`text-left bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all relative overflow-hidden flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]`}
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0">
                        {quest.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                            quest.category === 'Beginner' ? 'bg-green-100 text-green-700' :
                            quest.category === 'Digital' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>{quest.category}</span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight">{quest.title}</h3>
                      </div>
                      {isCompleted && (
                        <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">🏆</span>
                 Finance League
               </h3>
               <div className="space-y-4">
                  {[...MOCK_LEADERBOARD, { name: 'YOU', xp: user.xp, level: user.level, avatar: '👤' }]
                    .sort((a, b) => b.xp - a.xp)
                    .map((player, idx) => (
                      <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl ${player.name === 'YOU' ? 'bg-blue-50 border border-blue-100 ring-2 ring-blue-50' : ''}`}>
                         <span className="w-5 text-xs font-black text-gray-400">#{idx + 1}</span>
                         <span className="text-xl">{player.avatar}</span>
                         <div className="flex-1">
                            <p className="font-black text-sm text-gray-800">{player.name}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{player.level}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-blue-600 text-sm">{player.xp} XP</p>
                         </div>
                      </div>
                    ))}
               </div>
            </section>
          </>
        )}

        {activeTab === 'quests' && (
          <div className="space-y-6">
            <div className="px-1">
              <h2 className="text-2xl font-black text-gray-900">All Quests</h2>
              <p className="text-sm font-medium text-gray-500">Complete challenges to master Indian finance.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {['Beginner', 'Digital', 'Advanced'].map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest px-1 mt-4">{category} Missions</h3>
                  {QUESTS.filter(q => q.category === category).map(quest => {
                    const isCompleted = user.completedQuests.includes(quest.id);
                    const isLocked = category === 'Advanced' && user.xp < 500;
                    return (
                      <button
                        key={quest.id}
                        disabled={isLocked}
                        onClick={() => setSelectedQuest(quest)}
                        className={`text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all flex items-center gap-4 ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-md hover:border-blue-200 active:scale-[0.98]'}`}
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                          {isLocked ? '🔒' : quest.icon}
                        </div>
                        <div className="flex-1">
                           <h4 className="font-black text-gray-800 text-sm">{quest.title}</h4>
                           <p className="text-[10px] text-gray-400 font-bold">{quest.rewardInfo}</p>
                        </div>
                        {isCompleted && <span className="text-green-500 font-black text-xs">DONE</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm">⚡</div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Daily Brainiac</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resets every 24 hours</p>
                </div>
              </div>

              {!user.hasAnsweredDailyToday ? (
                <>
                  <p className="text-xl font-black text-gray-800 leading-snug mb-8">{currentDaily.question}</p>
                  <div className="space-y-3">
                    {currentDaily.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleDailyAnswer(i)}
                        className="w-full p-5 rounded-2xl border-2 border-gray-50 text-left font-black text-gray-700 hover:border-blue-500 hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 font-black">{i + 1}</div>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Challenge Completed!</h3>
                  <p className="text-gray-500 font-medium mb-8 px-4">Come back tomorrow for your next mission. Great work on maintaining your streak!</p>
                  {dailyResult && (
                    <div className="p-6 bg-gray-50 rounded-3xl text-left border border-gray-100">
                       <p className={`font-black uppercase text-[10px] mb-2 ${dailyResult.correct ? 'text-green-600' : 'text-orange-600'}`}>
                         {dailyResult.correct ? 'Correct Answer!' : 'Nice Try!'}
                       </p>
                       <p className="text-gray-700 leading-relaxed font-bold italic">"{dailyResult.explanation}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'toolkit' && (
          <div className="space-y-6">
            <div className="px-1">
              <h2 className="text-2xl font-black text-gray-900">Money Library</h2>
              <p className="text-sm font-medium text-gray-500">Your essential guide to financial freedom.</p>
            </div>
            {TOOLKIT.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex gap-5 items-start shadow-sm hover:shadow-md transition-all">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <button onClick={() => { localStorage.removeItem('bharat_money_user'); window.location.reload(); }} className="text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Reset App</button>
              </div>
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-6xl mx-auto mb-6 shadow-2xl rotate-3">
                👤
              </div>
              <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
              <p className="text-blue-600 font-black uppercase text-xs tracking-[0.2em] mt-2">{user.level}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-gray-100">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1 tracking-wider">Net Worth (XP)</p>
                  <p className="text-3xl font-black text-gray-900">{user.xp}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-gray-100">
                  <p className="text-[10px] uppercase font-black text-gray-400 mb-1 tracking-wider">Achievements</p>
                  <p className="text-3xl font-black text-gray-900">{user.badges.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">✨</span>
                Earned Badges
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {['🏅 Budget Hero', '🔥 Savings Streak', '🛡 Fraud Protector', '📈 Smart Investor'].map((badge) => {
                  const isEarned = user.badges.includes(badge);
                  return (
                    <div key={badge} className="flex flex-col items-center gap-2 group">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl mb-1 shadow-sm transition-all duration-500 ${isEarned ? 'bg-yellow-50 scale-100' : 'bg-gray-50 grayscale opacity-20 scale-90 border-2 border-dashed border-gray-200'}`}>
                        {badge.split(' ')[1]}
                      </div>
                      <span className={`text-[9px] font-black uppercase text-center tracking-tighter ${isEarned ? 'text-gray-800' : 'text-gray-300'}`}>
                        {badge.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  );
                })}
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
