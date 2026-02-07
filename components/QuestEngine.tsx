
import React, { useState } from 'react';
import { Quest, QuestChoice } from '../types';
import { getFinancialInsight, narrateText } from '../services/geminiService';

interface QuestEngineProps {
  quest: Quest;
  user: any;
  onComplete: (choice: QuestChoice) => void;
  onClose: () => void;
}

const QuestEngine: React.FC<QuestEngineProps> = ({ quest, user, onComplete, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  const handleSelect = async (index: number) => {
    if (feedback) return;
    setSelectedOption(index);
    setLoading(true);
    
    const choice = quest.options[index];
    setFeedback(choice.feedback);

    const insight = await getFinancialInsight(user, `chose: ${choice.text} in quest ${quest.title}`);
    setAiInsight(insight);
    setLoading(false);
  };

  const handleNarrate = async () => {
    setIsNarrating(true);
    await narrateText(quest.scenario);
    setIsNarrating(false);
  };

  const handleFinish = () => {
    if (selectedOption !== null) {
      onComplete(quest.options[selectedOption]);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0">
        <div className="flex items-center gap-2">
           <span className="text-xl">{quest.icon}</span>
           <h2 className="font-bold text-gray-800">{quest.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              Quest Scenario
            </div>
            <button 
              onClick={handleNarrate}
              disabled={isNarrating}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${isNarrating ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
            >
              {isNarrating ? '🔊 Reading...' : '🔈 Read Aloud'}
            </button>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-lg font-medium text-gray-800 leading-relaxed italic">
              "{quest.scenario}"
            </p>
          </div>
        </div>

        {!feedback ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Select your decision</p>
            {quest.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className="w-full p-5 text-left border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all active:scale-[0.98] flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-gray-700 font-semibold pt-1">{option.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
            <div className={`p-6 rounded-2xl border-2 ${quest.options[selectedOption!].isCorrect ? 'bg-green-50 border-green-100 shadow-sm shadow-green-100' : 'bg-orange-50 border-orange-100 shadow-sm shadow-orange-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${quest.options[selectedOption!].isCorrect ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                  {quest.options[selectedOption!].isCorrect ? '✓' : '!'}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${quest.options[selectedOption!].isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                    {quest.options[selectedOption!].isCorrect ? 'Excellent Choice!' : 'Important Lesson'}
                  </h3>
                  <p className="text-xs text-gray-500">Choice Impact</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">{feedback}</p>
            </div>

            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center gap-3 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-xs font-bold text-blue-400 uppercase">Consulting Finance Buddy...</p>
              </div>
            ) : aiInsight && (
              <div className="p-6 bg-white border border-blue-200 rounded-2xl relative shadow-sm border-l-4 border-l-blue-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">🤖</div>
                  <h4 className="font-bold text-blue-900 text-sm">Bharat Buddy's Tip</h4>
                </div>
                <p className="text-blue-800 italic leading-relaxed">"{aiInsight}"</p>
              </div>
            )}

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm grid grid-cols-3 gap-4 text-center divide-x">
              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">XP Points</span>
                <p className={`text-xl font-bold ${quest.options[selectedOption!].xpReward >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {quest.options[selectedOption!].xpReward >= 0 ? '+' : ''}{quest.options[selectedOption!].xpReward}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">Coin Bonus</span>
                <p className="text-xl text-yellow-600 font-bold">+{quest.options[selectedOption!].coinReward}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">Health Score</span>
                <p className={`text-xl font-bold ${quest.options[selectedOption!].healthDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {quest.options[selectedOption!].healthDelta >= 0 ? '+' : ''}{quest.options[selectedOption!].healthDelta}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
            >
              Collect Rewards & Finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestEngine;
