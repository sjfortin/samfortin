import { render, screen } from '@testing-library/react';
import ChatMessage from '@/components/playlists/ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/components/playlists/types';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const userMessage: ChatMessageType = {
      id: '1',
      role: 'user',
      content: 'Create a chill playlist for studying',
      timestamp: new Date(),
    };

    render(<ChatMessage message={userMessage} />);

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Create a chill playlist for studying')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const assistantMessage: ChatMessageType = {
      id: '2',
      role: 'assistant',
      content: 'Here is your playlist!',
      timestamp: new Date(),
    };

    render(<ChatMessage message={assistantMessage} />);

    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Here is your playlist!')).toBeInTheDocument();
  });
});
