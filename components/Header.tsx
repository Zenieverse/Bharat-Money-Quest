
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
          🇮🇳
        </div>
        <div>
          <h1 className="font-bold text-gray-900 leading-tight">Bharat Money</h1>
          <p className="text-xs text-gray-500">{user.level}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-gray-400">Health Score</span>
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  user.healthScore > 70 ? 'bg-green-500' : user.healthScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${user.healthScore}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-700">{user.healthScore}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
          <span className="text-sm">🪙</span>
          <span className="text-sm font-bold text-yellow-700">{user.coins}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
