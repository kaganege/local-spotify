/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

enum PictureType {
  Other,
  Icon,
  OtherIcon,
  CoverFront,
  CoverBack,
  Leaflet,
  Media,
  LeadArtist,
  Artist,
  Conductor,
  Band,
  Composer,
  Lyricist,
  RecordingLocation,
  DuringRecording,
  DuringPerformance,
  ScreenCapture,
  BrightFish,
  Illustration,
  BandLogo,
  PublisherLogo,
  Undefined,
}

declare type Picture = {
  mime_type: "image/png" | "image/jpeg";
  picture_type: PictureType;
  description: string;
  data: Iterable<number>;
};

declare enum TimestampFormat {
  Mpeg,
  Ms,
}

declare enum SynchronisedLyricsType {
  // Is other.
  Other,
  // Is lyrics.
  Lyrics,
  // Is text transcription.
  Transcription,
  // Is movement/part name (e.g. "Adagio").
  PartName,
  // Is events (e.g. "Don Quijote enters the stage").
  Event,
  // Is chord (e.g. "Bb F Fsus").
  Chord,
  // Is trivia/'pop up' information.
  Trivia,
}

declare type Lyrics = {
  lang: string;
  description: string;
  text: string;
};

declare type SynchronisedLyrics = {
  lang: string;
  timestamp_format: TimestampFormat;
  content_type: SynchronisedLyricsType;
  description: string;
  content: [number, string][];
};

declare type Song = {
  album?: string;
  title: string;
  artists: string[];
  duration: number;
  pictures: Picture[];
  lyrics: (Lyrics | SynchronisedLyrics)[];
  path: string;
};

declare type Playlist = {
  id: "liked" | string;
  index: number;
  name: string;
  image?: string;
  songs: Song[];
  path: string;
};

declare type SongData = {
  playlistIndex: number;
  songId: number;
  liked: boolean;
  volume: number;
  playing: boolean;
  progress: number;
  lastStartTime?: number;
  lastPauseTime?: number;
};
