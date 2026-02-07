
export enum PersonaType {
  STUDENT = 'Student',
  WOMAN = 'Woman',
  FARMER = 'Farmer',
  YOUNG_ADULT = 'Young Adult'
}

export enum FinancialGoal {
  SAVE_BETTER = 'Save Better',
  BUDGET_SMARTER = 'Budget Smarter',
  LEARN_CREDIT = 'Learn Credit',
  START_INVESTING = 'Start Investing',
  STAY_SAFE = 'Stay Safe from Scams'
}

export interface UserProfile {
  name: string;
  persona: PersonaType;
  goal: FinancialGoal;
  xp: number;
  coins: number;
  level: string;
  healthScore: number;
  badges: string[];
  completedQuests: string[];
  lastDailyDate: string | null;
  hasAnsweredDailyToday: boolean;
}

export interface QuestChoice {
  text: string;
  feedback: string;
  xpReward: number;
  coinReward: number;
  healthDelta: number;
  isCorrect: boolean;
}

export interface Quest {
  id: string;
  title: string;
  category: 'Beginner' | 'Digital' | 'Advanced';
  description: string;
  scenario: string;
  options: QuestChoice[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardInfo: string;
  icon: string;
}

export interface ToolkitItem {
  id: string;
  title: string;
  content: string;
  icon: string;
  color: string;
}

export interface DailyChallenge {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  reward: number;
}
