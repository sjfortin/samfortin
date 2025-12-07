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
      const toolPart = message.parts?.find(
        (part: any) =>
          part.type === 'tool-generatePlaylist' &&
          part.state === 'output-available' &&
          part.output
      ) as { output: PlaylistResponse } | undefined;

      if (toolPart?.output) {
        const playlistData = toolPart.output;
        const textContent = message.parts
          ?.filter((p: any) => p.type === 'text' && p.state === 'done')
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
      genres?: string[];
      eras?: string[];
    }
  ) => {
    sendMessage(
      { text: userInput },
      {
        body: {
          playlistLength: options.playlistLength,
          currentPlaylist: options.currentPlaylist || null,
          genres: options.genres,
          eras: options.eras,
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
