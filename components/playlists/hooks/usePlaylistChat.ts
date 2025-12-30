import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { PlaylistResponse } from '../types';

interface UsePlaylistChatOptions {
  playlistId?: string;
  onPlaylistGenerated: (playlist: PlaylistResponse, messageText: string) => void | Promise<void>;
}

export function usePlaylistChat({ playlistId, onPlaylistGenerated }: UsePlaylistChatOptions) {
  const {
    messages,
    status,
    sendMessage,
    setMessages,
  } = useChat({
    id: playlistId,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onFinish: async ({ message }) => {
      // AI SDK v5: tool parts have state property, output is available when state === 'output-available'
      const toolPart = message.parts?.find(
        (part: any) =>
          part.type?.startsWith('tool-') &&
          part.state === 'output-available' &&
          part.output
      ) as { output?: PlaylistResponse; state?: string } | undefined;

      const playlistData = toolPart?.output;
      if (playlistData) {
        const textContent = message.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('') || `Generated playlist: ${playlistData.name}`;

        await onPlaylistGenerated(playlistData, textContent);
      }
    },
  });

  const isGenerating = (status as string) === 'submitted' || (status as string) === 'streaming';

  const generatePlaylist = (
    userInput: string,
    options: {
      playlistLength: string;
      currentPlaylist?: PlaylistResponse | null;
    }
  ) => {
    sendMessage(
      { text: userInput },
      {
        body: {
          playlistLength: options.playlistLength,
          currentPlaylist: options.currentPlaylist || null,
        },
      }
    );
  };

  return {
    messages,
    status,
    isGenerating,
    generatePlaylist,
    setMessages,
  };
}
