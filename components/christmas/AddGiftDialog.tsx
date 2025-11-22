'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AddGiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
}

export default function AddGiftDialog({ open, onOpenChange, personId }: AddGiftDialogProps) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('idea');
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/christmas/gifts', {
        method: 'POST',
        body: JSON.stringify({
            person_id: personId,
            name,
            link,
            cost: parseFloat(cost) || 0,
            status
        }),
      });
      if (!res.ok) throw new Error('Failed to add gift');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['christmas-people'] });
      onOpenChange(false);
      setName('');
      setLink('');
      setCost('');
      setStatus('idea');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Gift Idea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label htmlFor="gift-name" className="block text-sm font-medium mb-1">
              Gift Name
            </label>
            <input
              id="gift-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              placeholder="e.g. Socks"
            />
          </div>
          <div>
            <label htmlFor="gift-link" className="block text-sm font-medium mb-1">
              Link (Optional)
            </label>
            <input
              id="gift-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://amazon.com/..."
            />
          </div>
          <div>
            <label htmlFor="gift-cost" className="block text-sm font-medium mb-1">
              Est. Cost ($)
            </label>
            <input
              id="gift-cost"
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0.00"
            />
          </div>
           <div>
            <label htmlFor="gift-status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="gift-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <option value="idea">Idea</option>
                <option value="bought">Bought</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Gift
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
