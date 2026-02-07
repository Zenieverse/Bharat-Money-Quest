
import { Quest, ToolkitItem, DailyChallenge } from './types';

export const QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Monthly Budget Basics',
    category: 'Beginner',
    description: 'Master the 50-30-20 rule for your first salary.',
    scenario: 'You just received your first salary of ₹30,000. Your rent and bills are ₹15,000. You really want to buy a new pair of shoes for ₹5,000.',
    options: [
      {
        text: 'Buy the shoes immediately to celebrate!',
        feedback: 'Celebrating is good, but spending 16% of your salary on shoes before saving can lead to a debt trap.',
        xpReward: 5,
        coinReward: 0,
        healthDelta: -10,
        isCorrect: false
      },
      {
        text: 'Save ₹6,000 first, then see if you can afford the shoes.',
        feedback: 'Excellent! The "Pay Yourself First" rule (saving 20% first) is the foundation of wealth.',
        xpReward: 50,
        coinReward: 20,
        healthDelta: 15,
        isCorrect: true
      },
      {
        text: 'Put the shoes on a Credit Card EMI.',
        feedback: 'EMI for lifestyle items adds interest costs. It is better to save and buy.',
        xpReward: 10,
        coinReward: 5,
        healthDelta: -5,
        isCorrect: false
      }
    ],
    difficulty: 'Easy',
    rewardInfo: '50 XP • 20 Coins',
    icon: '🧾'
  },
  {
    id: 'q2',
    title: 'The UPI Scam Shield',
    category: 'Digital',
    description: 'Learn to identify fraudulent payment requests.',
    scenario: 'You receive a WhatsApp message from "KBC Rewards" saying you won ₹25 Lakhs. They send a UPI QR code and ask you to scan it and enter your PIN to "receive" the prize.',
    options: [
      {
        text: 'Scan it immediately! It is a huge prize.',
        feedback: 'DANGER! Scanned QR codes are for PAYING, not receiving. You would have lost your money!',
        xpReward: 0,
        coinReward: 0,
        healthDelta: -30,
        isCorrect: false
      },
      {
        text: 'Report the number and delete the message.',
        feedback: 'Brilliant! Real prizes never require you to enter a UPI PIN to receive money. Stay safe!',
        xpReward: 60,
        coinReward: 30,
        healthDelta: 20,
        isCorrect: true
      }
    ],
    difficulty: 'Medium',
    rewardInfo: '60 XP • 30 Coins',
    icon: '🛡'
  },
  {
    id: 'q3',
    title: 'Emergency Fund Mission',
    category: 'Beginner',
    description: 'Prepare for the unexpected rainy day.',
    scenario: 'Your laptop suddenly breaks down and repairs cost ₹10,000. You have ₹15,000 in your savings account.',
    options: [
      {
        text: 'Use your savings to fix it and start rebuilding.',
        feedback: 'Good use of savings, but this is why an Emergency Fund of 3-6 months of expenses is vital!',
        xpReward: 40,
        coinReward: 10,
        healthDelta: 10,
        isCorrect: true
      },
      {
        text: 'Take an instant high-interest personal loan.',
        feedback: 'Bad idea! Small loans for repairs often have predatory interest rates. Use your buffer instead.',
        xpReward: 5,
        coinReward: 0,
        healthDelta: -15,
        isCorrect: false
      }
    ],
    difficulty: 'Easy',
    rewardInfo: '40 XP • 10 Coins',
    icon: '🚨'
  },
  {
    id: 'q4',
    title: 'SIP Investing Adventure',
    category: 'Advanced',
    description: 'Understand the power of compounding.',
    scenario: 'You have ₹2,000 extra every month. You are deciding between keeping it in a zero-interest locker or starting a Mutual Fund SIP.',
    options: [
      {
        text: 'Keep it in the locker for safety.',
        feedback: 'While safe, inflation will reduce the value of your money over time.',
        xpReward: 10,
        coinReward: 5,
        healthDelta: 0,
        isCorrect: false
      },
      {
        text: 'Start an Equity SIP for long-term goals.',
        feedback: 'Great choice! Compounding works best over long periods. You are on your way to becoming a Wealth Builder!',
        xpReward: 80,
        coinReward: 50,
        healthDelta: 25,
        isCorrect: true
      }
    ],
    difficulty: 'Hard',
    rewardInfo: '80 XP • 50 Coins',
    icon: '📈'
  }
];

export const TOOLKIT: ToolkitItem[] = [
  {
    id: 't1',
    title: 'Budgeting 101',
    content: 'The 50/30/20 rule: 50% for Needs, 30% for Wants, and 20% for Savings. Always track your expenses using an app or a diary.',
    icon: '📊',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 't2',
    title: 'UPI Safety',
    content: 'Never enter your UPI PIN to receive money. Only enter your PIN when you are making a payment. QR codes are for scanning to PAY.',
    icon: '📲',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 't3',
    title: 'Credit Score',
    content: 'A score above 750 is considered good. Pay your credit card bills in full and on time to maintain a healthy score.',
    icon: '💳',
    color: 'bg-purple-100 text-purple-600'
  }
];

export const DAILY_CHALLENGE: DailyChallenge = {
  question: 'What is the maximum amount covered by deposit insurance (DICGC) per bank account in India?',
  options: ['₹1 Lakh', '₹5 Lakhs', '₹10 Lakhs', 'Unlimited'],
  correctIndex: 1,
  explanation: 'Since 2020, the DICGC covers up to ₹5 Lakhs per depositor, per bank, including principal and interest.',
  reward: 20
};
