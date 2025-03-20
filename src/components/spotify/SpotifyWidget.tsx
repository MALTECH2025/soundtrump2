
import { useEffect, useState } from 'react';
import { getSpotifyTopTracks, getSpotifyRecentlyPlayed } from '@/integrations/spotify/spotifyApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Clock, BarChart } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  explicit: boolean;
}

interface RecentlyPlayedItem {
  track: Track;
  played_at: string;
}

const SpotifyWidget = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('medium_term');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topTracksData, recentlyPlayedData] = await Promise.all([
          getSpotifyTopTracks(timeRange),
          getSpotifyRecentlyPlayed()
        ]);
        
        setTopTracks(topTracksData || []);
        setRecentlyPlayed(recentlyPlayedData || []);
      } catch (error) {
        console.error('Error loading Spotify data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  // Helper to format duration from milliseconds to MM:SS
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper to format date for recently played
  const formatPlayedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Your Spotify Stats
        </CardTitle>
        <CardDescription>
          Explore your listening habits and discover your top tracks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="top" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="top">
              <BarChart className="h-4 w-4 mr-2" />
              Top Tracks
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              Recently Played
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="top">
            <div className="mb-4">
              <TabsList>
                <TabsTrigger 
                  value="short_term" 
                  onClick={() => setTimeRange('short_term')}
                  className={timeRange === 'short_term' ? 'bg-sound-light' : ''}
                >
                  Past Month
                </TabsTrigger>
                <TabsTrigger 
                  value="medium_term" 
                  onClick={() => setTimeRange('medium_term')}
                  className={timeRange === 'medium_term' ? 'bg-sound-light' : ''}
                >
                  Past 6 Months
                </TabsTrigger>
                <TabsTrigger 
                  value="long_term" 
                  onClick={() => setTimeRange('long_term')}
                  className={timeRange === 'long_term' ? 'bg-sound-light' : ''}
                >
                  All Time
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : topTracks.length > 0 ? (
                topTracks.slice(0, 10).map((track, index) => (
                  <div key={track.id} className="flex items-center gap-3">
                    <div className="w-6 text-center font-bold text-muted-foreground">{index + 1}</div>
                    <Avatar className="h-12 w-12 rounded-md">
                      <img 
                        src={track.album.images[0]?.url} 
                        alt={track.album.name}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(track.duration_ms)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No top tracks data available. Connect your Spotify account to see your stats.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="space-y-4">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))
              ) : recentlyPlayed.length > 0 ? (
                recentlyPlayed.slice(0, 10).map((item) => (
                  <div key={`${item.track.id}-${item.played_at}`} className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-md">
                      <img 
                        src={item.track.album.images[0]?.url} 
                        alt={item.track.album.name}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.track.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.track.artists.map(a => a.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {formatPlayedAt(item.played_at)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No recently played tracks available. Connect your Spotify account to see your listening history.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpotifyWidget;
