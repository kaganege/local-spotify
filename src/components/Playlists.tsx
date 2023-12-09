import PlaylistIcon from "@assets/playlist.svg?react";

export type Props = {
  playlists: Playlist[];
  onPlaylistClick?: (playlist: Playlist) => any;
};

export default function Playlists({ playlists, onPlaylistClick }: Props) {
  return (
    <div className="flex flex-col h-full px-1 overflow-hidden rounded-lg bg-background-light">
      <header className="flex items-center justify-center w-full px-4 py-2">
        <button className="flex justify-center w-full py-2">
          <PlaylistIcon className="text-zinc-400 hover:text-white" width={24} height={24} />
        </button>
      </header>
      <ul className="w-full pb-2 overflow-y-auto scrollbar">
        {playlists.map((playlist, index) => (
          <li key={index}>
            <button
              className="flex justify-center w-full py-2 rounded hover:bg-background-lightest"
              onClick={() => onPlaylistClick?.(playlist)}
            >
              <img src={playlist.image} alt={playlist.name} className="w-auto h-12 rounded" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
