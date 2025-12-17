import { render, screen } from '@testing-library/react';
import TrackList from '@/components/playlists/TrackList';
import type { Track } from '@/components/playlists/types';

describe('TrackList', () => {
  const mockTracks: Track[] = [
    { name: 'Bohemian Rhapsody', artist: 'Queen' },
    { name: 'Stairway to Heaven', artist: 'Led Zeppelin' },
    { name: 'Hotel California', artist: 'Eagles' },
  ];

  it('renders track count correctly', () => {
    render(<TrackList tracks={mockTracks} />);

    expect(screen.getByText('Tracks (3)')).toBeInTheDocument();
  });

  it('renders all tracks with names and artists', () => {
    render(<TrackList tracks={mockTracks} />);

    expect(screen.getByText('Bohemian Rhapsody')).toBeInTheDocument();
    expect(screen.getByText('Queen')).toBeInTheDocument();
    expect(screen.getByText('Stairway to Heaven')).toBeInTheDocument();
    expect(screen.getByText('Led Zeppelin')).toBeInTheDocument();
    expect(screen.getByText('Hotel California')).toBeInTheDocument();
    expect(screen.getByText('Eagles')).toBeInTheDocument();
  });

  it('renders empty list when no tracks provided', () => {
    render(<TrackList tracks={[]} />);

    expect(screen.getByText('Tracks (0)')).toBeInTheDocument();
  });
});
