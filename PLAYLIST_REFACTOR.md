# Playlist Components Refactoring

## Summary

Extracted shared playlist generation logic into a reusable custom hook while keeping components separate for their distinct purposes.

## Architecture Decision

### ✅ Chosen Approach: Custom Hook Pattern
- **Created**: `usePlaylistChat` hook to encapsulate shared logic
- **Kept**: Separate `PlaylistCreator` and `PlaylistDetailView` components

### ❌ Rejected: Single Combined Component
- Different user flows (create vs modify)
- Different UI requirements (form vs chat interface)
- Different data dependencies (new vs existing playlist)

## What Was Extracted

### `usePlaylistChat` Hook (`hooks/usePlaylistChat.ts`)

**Responsibilities:**
- Manages AI SDK `useChat` integration
- Handles tool result extraction from message parts
- Provides clean callback interface for playlist generation
- Encapsulates body parameter passing logic

**API:**
```typescript
const { 
  messages,           // Chat message history
  isGenerating,       // Loading state
  generatePlaylist,   // Function to trigger generation
  setMessages         // For loading history
} = usePlaylistChat({
  playlistId,         // Optional: for existing playlists
  onPlaylistGenerated // Callback with (playlist, messageText)
});
```

## Benefits

1. **DRY Principle**: No duplicated AI SDK integration code
2. **Separation of Concerns**: Components focus on UI, hook handles AI logic
3. **Testability**: Hook can be tested independently
4. **Maintainability**: AI SDK changes only need updates in one place
5. **Type Safety**: Shared types ensure consistency
6. **Flexibility**: Each component can customize the callback behavior

## Component Responsibilities

### `PlaylistCreator`
- User input form with genre/era selectors
- New playlist creation flow
- Saves and redirects to detail view
- No chat history display

### `PlaylistDetailView`
- Full chat interface with message history
- Playlist modification flow
- Track list display with Spotify integration
- Delete functionality
- Stays on same page after updates

## Files Modified

1. ✨ **Created**: `components/playlists/hooks/usePlaylistChat.ts`
2. 🔄 **Refactored**: `components/playlists/PlaylistCreator.tsx`
3. 🔄 **Refactored**: `components/playlists/PlaylistDetailView.tsx`

## Code Reduction

- **Before**: ~80 lines of duplicated AI SDK logic
- **After**: ~70 lines in shared hook, ~10 lines per component
- **Net Savings**: ~60 lines of code + improved maintainability

## Future Improvements

- Add error handling to the hook
- Add retry logic for failed generations
- Consider extracting message saving logic
- Add loading states for individual operations
