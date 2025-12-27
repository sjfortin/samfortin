import { useChat } from '@ai-sdk/react';
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
    onFinish: async ({ message }) => {
      console.log('onFinish called, message:', JSON.stringify(message, null, 2));
      
      // Try to find tool result with various possible states
      const toolPart = message.parts?.find(
        (part: any) =>
          part.type?.startsWith('tool-') &&
          (part.output || part.result)
      ) as { output?: PlaylistResponse; result?: PlaylistResponse } | undefined;

      console.log('toolPart found:', toolPart);

      const playlistData = toolPart?.output || toolPart?.result;
      if (playlistData) {
        const textContent = message.parts
          ?.filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('') || `Generated playlist: ${playlistData.name}`;

        console.log('Calling onPlaylistGenerated with:', playlistData.name);
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
