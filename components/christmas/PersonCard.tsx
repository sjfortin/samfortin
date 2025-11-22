'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Gift, ExternalLink, CheckCircle, Circle, Plus } from 'lucide-react';
import type { ChristmasPerson, ChristmasGift } from '@/lib/supabase/types';
import AddGiftDialog from './AddGiftDialog';

interface PersonCardProps {
  person: ChristmasPerson;
}

export default function PersonCard({ person }: PersonCardProps) {
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const queryClient = useQueryClient();

  const spent = person.gifts?.reduce((acc, gift) => {
    return acc + (gift.status === 'bought' ? (Number(gift.cost) || 0) : 0);
  }, 0) || 0;
  
  const budget = Number(person.budget) || 0;
  const remaining = budget - spent;
  const percentUsed = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const deletePerson = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/christmas/people/${person.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete person');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['christmas-people'] });
    },
  });

  const toggleGiftStatus = useMutation({
    mutationFn: async (gift: ChristmasGift) => {
        const newStatus = gift.status === 'idea' ? 'bought' : 'idea';
        const res = await fetch('/api/christmas/gifts', {
            method: 'PUT',
            body: JSON.stringify({ ...gift, status: newStatus }),
        });
        if (!res.ok) throw new Error('Failed to update gift');
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['christmas-people'] });
    }
  });

  const deleteGift = useMutation({
    mutationFn: async (giftId: string) => {
        const res = await fetch(`/api/christmas/gifts?id=${giftId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete gift');
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['christmas-people'] });
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-red-100 dark:border-red-900 overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <div className="p-5 border-b border-red-50 dark:border-red-900 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/10">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{person.name}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Budget: ${budget.toFixed(2)}
                </div>
            </div>
            <button 
                onClick={() => {
                    if (window.confirm(`Are you sure you want to remove ${person.name}?`)) {
                        deletePerson.mutate();
                    }
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1" 
                title="Remove person"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
        
        <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>${spent.toFixed(2)} spent</span>
                <span className={remaining < 0 ? 'text-red-500' : 'text-green-600'}>${remaining.toFixed(2)} left</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${remaining < 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${percentUsed}%` }}
                />
            </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Gifts
            </h4>
        </div>

        <div className="space-y-3 flex-1">
            {person.gifts?.map((gift) => (
                <div key={gift.id} className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                        <button 
                            onClick={() => toggleGiftStatus.mutate(gift)}
                            className={`flex-shrink-0 ${gift.status === 'bought' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                            title={gift.status === 'bought' ? "Mark as idea" : "Mark as bought"}
                        >
                            {gift.status === 'bought' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div className="min-w-0">
                            <div className={`font-medium truncate ${gift.status === 'bought' ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                {gift.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>${Number(gift.cost).toFixed(2)}</span>
                                {gift.link && (
                                    <a 
                                        href={gift.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline flex items-center gap-0.5"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Link <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => deleteGift.mutate(gift.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                        title="Remove gift"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            
            {(!person.gifts || person.gifts.length === 0) && (
                <p className="text-sm text-gray-400 italic text-center py-4">No gift ideas yet.</p>
            )}
        </div>

        <button 
            onClick={() => setIsAddGiftOpen(true)}
            className="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:text-green-600 hover:border-green-500 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
            <Plus className="w-4 h-4" /> Add Gift Idea
        </button>
      </div>

      <AddGiftDialog 
        open={isAddGiftOpen} 
        onOpenChange={setIsAddGiftOpen} 
        personId={person.id} 
      />
    </div>
  );
}
