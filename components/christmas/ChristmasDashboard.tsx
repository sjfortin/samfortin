'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Gift, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ChristmasPerson } from '@/lib/supabase/types';
import PersonCard from './PersonCard';
import AddPersonDialog from './AddPersonDialog';

export default function ChristmasDashboard() {
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);

  const { data: people, isLoading, error } = useQuery<ChristmasPerson[]>({
    queryKey: ['christmas-people'],
    queryFn: async () => {
      const res = await fetch('/api/christmas/people');
      if (!res.ok) throw new Error('Failed to fetch people');
      const data = await res.json();
      return data.people;
    },
  });

  const totalBudget = people?.reduce((acc, person) => acc + (Number(person.budget) || 0), 0) || 0;
  const totalSpent = people?.reduce((acc, person) => {
    return acc + (person.gifts?.reduce((gAcc, gift) => {
        return gAcc + (gift.status === 'bought' ? (Number(gift.cost) || 0) : 0);
    }, 0) || 0);
  }, 0) || 0;

  const remainingBudget = totalBudget - totalSpent;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex h-screen items-center justify-center flex-col gap-4">
            <p className="text-red-600">Something went wrong getting your list.</p>
            <button onClick={() => window.location.reload()} className="text-sm underline">Try again</button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-red-700 dark:text-red-400 mb-4 font-serif tracking-tight">
          Holiday Gift Tracker
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-6 text-lg">
            <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-red-100 dark:border-red-900">
                <span className="text-gray-500 dark:text-gray-400 block text-sm uppercase tracking-wider">Total Budget</span>
                <span className="font-bold text-2xl text-green-600 dark:text-green-400">${totalBudget.toFixed(2)}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-red-100 dark:border-red-900">
                <span className="text-gray-500 dark:text-gray-400 block text-sm uppercase tracking-wider">Spent So Far</span>
                <span className="font-bold text-2xl text-red-600 dark:text-red-400">${totalSpent.toFixed(2)}</span>
            </div>
             <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-red-100 dark:border-red-900">
                <span className="text-gray-500 dark:text-gray-400 block text-sm uppercase tracking-wider">Remaining</span>
                <span className={`font-bold text-2xl ${remainingBudget < 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                    ${remainingBudget.toFixed(2)}
                </span>
            </div>
        </div>
      </header>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">My List</h2>
        <button 
            onClick={() => setIsAddPersonOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md cursor-pointer"
        >
            <Plus className="w-5 h-5" />
            Add Person
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people?.map((person) => (
            <PersonCard key={person.id} person={person} />
        ))}
        
        {people?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <Gift className="w-12 h-12 mb-4 text-red-300" />
                <p className="text-lg">No one on your list yet!</p>
                <button 
                    onClick={() => setIsAddPersonOpen(true)}
                    className="mt-2 text-green-600 hover:underline cursor-pointer"
                >
                    Add your first person
                </button>
            </div>
        )}
      </div>

      <AddPersonDialog open={isAddPersonOpen} onOpenChange={setIsAddPersonOpen} />
    </div>
  );
}
