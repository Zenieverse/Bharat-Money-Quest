
import React, { useState } from 'react';
import { Quest, QuestChoice } from '../types';
import { getFinancialInsight } from '../services/geminiService';

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

  const handleSelect = async (index: number) => {
    if (feedback) return;
    setSelectedOption(index);
    setLoading(true);
    
    const choice = quest.options[index];
    setFeedback(choice.feedback);

    // Call Gemini for dynamic insight
    const insight = await getFinancialInsight(user, `chose: ${choice.text} in quest ${quest.title}`);
    setAiInsight(insight);
    setLoading(false);
  };

  const handleFinish = () => {
    if (selectedOption !== null) {
      onComplete(quest.options[selectedOption]);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-bold text-gray-800">{quest.title}</h2>
        <button onClick={onClose} className="p-2 text-gray-400">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 uppercase tracking-wider">
            Scenario
          </div>
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            "{quest.scenario}"
          </p>
        </div>

        {!feedback ? (
          <div className="space-y-3">
            {quest.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className="w-full p-4 text-left border-2 border-gray-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-gray-700 font-medium">{option.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className={`p-5 rounded-2xl ${quest.options[selectedOption!].isCorrect ? 'bg-green-50 border border-green-100' : 'bg-orange-50 border border-orange-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{quest.options[selectedOption!].isCorrect ? '✅' : '💡'}</span>
                <h3 className={`font-bold ${quest.options[selectedOption!].isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                  {quest.options[selectedOption!].isCorrect ? 'Smart Choice!' : 'Learning Moment'}
                </h3>
              </div>
              <p className="text-gray-700">{feedback}</p>
            </div>

            {loading ? (
              <div className="p-5 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : aiInsight && (
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl relative">
                <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Buddy Insight
                </div>
                <p className="text-blue-800 italic">"{aiInsight}"</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-2xl grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">XP</p>
                <p className={`font-bold ${quest.options[selectedOption!].xpReward >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {quest.options[selectedOption!].xpReward >= 0 ? '+' : ''}{quest.options[selectedOption!].xpReward}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Coins</p>
                <p className="text-yellow-600 font-bold">+{quest.options[selectedOption!].coinReward}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Health</p>
                <p className={`font-bold ${quest.options[selectedOption!].healthDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {quest.options[selectedOption!].healthDelta >= 0 ? '+' : ''}{quest.options[selectedOption!].healthDelta}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Back to Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestEngine;
