# Playlist Chat Feature - Testing Guide

## Pre-Testing Checklist

- [ ] Environment variables are set (GEMINI_API_KEY, Clerk keys)
- [ ] Development server is running (`pnpm dev`)
- [ ] Supabase is connected and accessible
- [ ] Clerk authentication is configured
- [ ] Spotify OAuth is set up in Clerk

## Test Scenarios

### 1. Unauthenticated User Flow

#### Test 1.1: Landing Page
- [ ] Visit `/playlists` while signed out
- [ ] Verify landing page displays with "Get Started" button
- [ ] Verify "Back to Sam" link works
- [ ] Check responsive layout on mobile

#### Test 1.2: Sign In Flow
- [ ] Click "Get Started" button
- [ ] Verify Clerk sign-in modal appears
- [ ] Sign in with test account
- [ ] Verify redirect to chat interface

### 2. Chat Interface - Initial Generation

#### Test 2.1: Basic Playlist Generation
- [ ] Enter prompt: "Create a chill indie playlist"
- [ ] Click "Generate"
- [ ] Verify loading state appears
- [ ] Verify playlist generates successfully
- [ ] Check playlist has name, description, and tracks
- [ ] Verify playlist appears in chat message

#### Test 2.2: Genre Selection
- [ ] Select 2-3 genres (e.g., "Rock", "Alternative", "Indie")
- [ ] Enter prompt: "Create a playlist for studying"
- [ ] Generate playlist
- [ ] Verify genres influence the results
- [ ] Check that selected genres are reflected in tracks

#### Test 2.3: Era Selection
- [ ] Select era: "1990s"
- [ ] Enter prompt: "Create a nostalgic playlist"
- [ ] Generate playlist
- [ ] Verify tracks are primarily from the 1990s
- [ ] Check era context in AI response

#### Test 2.4: Combined Filters
- [ ] Select genres: "Hip Hop", "R&B"
- [ ] Select eras: "2000s", "2010s"
- [ ] Enter prompt: "Party playlist"
- [ ] Generate and verify results match filters

#### Test 2.5: Playlist Length
- [ ] Set length to "1 hour"
- [ ] Generate playlist
- [ ] Count tracks (should be ~15-20)
- [ ] Set length to "3 hours"
- [ ] Generate playlist
- [ ] Count tracks (should be ~45-60)

### 3. Chat Interface - Refinement

#### Test 3.1: Add More Songs
- [ ] Generate initial playlist
- [ ] Send message: "Add 5 more songs"
- [ ] Verify playlist updates with additional tracks
- [ ] Check conversation history is maintained

#### Test 3.2: Change Mood
- [ ] Generate "chill" playlist
- [ ] Send message: "Make it more upbeat"
- [ ] Verify new playlist has higher energy songs
- [ ] Check playlist name/description updates

#### Test 3.3: Replace Artists
- [ ] Generate playlist with various artists
- [ ] Send message: "Replace the pop songs with rock"
- [ ] Verify genre shift in tracks
- [ ] Check track count remains similar

#### Test 3.4: Specific Modifications
- [ ] Generate playlist
- [ ] Send message: "Add more songs from the 80s"
- [ ] Verify 80s tracks are added
- [ ] Send message: "Remove any slow songs"
- [ ] Verify faster tempo tracks remain

#### Test 3.5: Multiple Refinements
- [ ] Generate initial playlist
- [ ] Make 3-4 sequential modifications
- [ ] Verify each modification builds on previous
- [ ] Check conversation context is maintained

### 4. Playlist Actions - Signed In

#### Test 4.1: View Playlist Details
- [ ] Generate playlist
- [ ] Click "View full playlist" in chat message
- [ ] Verify sidebar opens with full track list
- [ ] Check all tracks display correctly
- [ ] Verify track numbers and artist names

#### Test 4.2: Save to Library
- [ ] Generate playlist
- [ ] Open playlist sidebar
- [ ] Click "Save to Library"
- [ ] Verify success message appears
- [ ] Check playlist appears in sidebar list
- [ ] Refresh page and verify persistence

#### Test 4.3: Create on Spotify (With Connection)
- [ ] Ensure Spotify is connected in Clerk
- [ ] Generate playlist
- [ ] Click "Create on Spotify"
- [ ] Verify loading state
- [ ] Verify success message
- [ ] Check "Open in Spotify" link appears
- [ ] Verify link does NOT auto-open
- [ ] Click link manually
- [ ] Verify playlist exists in Spotify

#### Test 4.4: Create on Spotify (Without Connection)
- [ ] Disconnect Spotify in Clerk
- [ ] Generate playlist
- [ ] Click "Create on Spotify"
- [ ] Verify error message about Spotify connection
- [ ] Check error is user-friendly

### 5. Playlist Actions - Signed Out

#### Test 5.1: Save Attempt (Signed Out)
- [ ] Sign out
- [ ] Generate playlist (should still work)
- [ ] Try to save to library
- [ ] Verify sign-in prompt modal appears
- [ ] Check modal explains why sign-in is needed
- [ ] Click "Cancel" - modal closes
- [ ] Click "Sign In" - Clerk modal opens

#### Test 5.2: Spotify Creation (Signed Out)
- [ ] While signed out
- [ ] Generate playlist
- [ ] Try to create on Spotify
- [ ] Verify sign-in prompt appears
- [ ] Sign in through modal
- [ ] Verify action completes after sign-in

### 6. UI/UX Testing

#### Test 6.1: Empty State
- [ ] Visit chat interface (signed in)
- [ ] Verify empty state displays
- [ ] Check example prompts are shown
- [ ] Verify AI icon and welcome message
- [ ] Test responsive layout

#### Test 6.2: Message Display
- [ ] Generate playlist
- [ ] Verify user message displays correctly
- [ ] Check AI message has proper styling
- [ ] Verify icons (user vs AI) are distinct
- [ ] Check timestamps (if shown)

#### Test 6.3: Loading States
- [ ] Submit prompt
- [ ] Verify "Curating your playlist..." message
- [ ] Check loading spinner appears
- [ ] Verify button is disabled during generation
- [ ] Check smooth transition to result

#### Test 6.4: Error Handling
- [ ] Disconnect internet
- [ ] Try to generate playlist
- [ ] Verify error message displays
- [ ] Check error is user-friendly
- [ ] Reconnect and verify recovery

#### Test 6.5: Mobile Responsiveness
- [ ] Test on mobile viewport (375px width)
- [ ] Verify sidebar hamburger menu works
- [ ] Check genre/era selectors wrap properly
- [ ] Test chat input on mobile
- [ ] Verify playlist sidebar is full-width on mobile

### 7. Integration Testing

#### Test 7.1: Sidebar Navigation
- [ ] Generate and save multiple playlists
- [ ] Click on saved playlist in sidebar
- [ ] Verify navigation to detail page
- [ ] Click "New Playlist" button
- [ ] Verify return to chat interface
- [ ] Check state resets properly

#### Test 7.2: Playlist Detail Page
- [ ] Navigate to saved playlist detail
- [ ] Verify all tracks display
- [ ] Check stats are accurate
- [ ] Test "Create on Spotify" from detail page
- [ ] Verify no auto-open behavior
- [ ] Test delete functionality

#### Test 7.3: Cross-Session Persistence
- [ ] Generate and save playlist
- [ ] Close browser
- [ ] Reopen and sign in
- [ ] Verify saved playlist still exists
- [ ] Check all data is intact

### 8. Edge Cases

#### Test 8.1: Very Long Prompts
- [ ] Enter 500+ character prompt
- [ ] Verify it processes correctly
- [ ] Check UI handles long text

#### Test 8.2: Special Characters
- [ ] Use emojis in prompt: "Create a 🔥 playlist"
- [ ] Use quotes: "Create a 'chill vibes' playlist"
- [ ] Verify proper handling

#### Test 8.3: Rapid Submissions
- [ ] Submit prompt
- [ ] Immediately submit another
- [ ] Verify proper queuing/handling
- [ ] Check no race conditions

#### Test 8.4: Empty Prompt
- [ ] Try to submit empty prompt
- [ ] Verify button is disabled
- [ ] Check validation works

#### Test 8.5: API Failures
- [ ] Simulate API timeout
- [ ] Verify error handling
- [ ] Check user can retry

### 9. Performance Testing

#### Test 9.1: Generation Speed
- [ ] Time initial playlist generation
- [ ] Should complete in < 10 seconds
- [ ] Check for any delays

#### Test 9.2: Refinement Speed
- [ ] Time playlist modification
- [ ] Should complete in < 10 seconds
- [ ] Verify no performance degradation

#### Test 9.3: Large Playlists
- [ ] Generate 3-hour playlist (60+ tracks)
- [ ] Verify UI remains responsive
- [ ] Check scrolling performance
- [ ] Test sidebar with many tracks

### 10. Accessibility Testing

#### Test 10.1: Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Test Enter key to submit
- [ ] Check Escape closes modals

#### Test 10.2: Screen Reader
- [ ] Test with screen reader (if available)
- [ ] Verify labels are announced
- [ ] Check button purposes are clear
- [ ] Verify playlist content is accessible

## Bug Reporting Template

If you find issues, document them as:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari]
**Device**: [Desktop/Mobile]
**Screenshots**: [If applicable]
```

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth user experience
- ✅ Fast response times (< 10s)
- ✅ Proper error handling
- ✅ Mobile responsive
- ✅ Accessible interface
- ✅ Data persistence works
- ✅ Spotify integration works

## Post-Testing

After testing:
1. Document any bugs found
2. Verify all critical paths work
3. Test on multiple browsers
4. Get user feedback
5. Monitor production errors
6. Track usage analytics
