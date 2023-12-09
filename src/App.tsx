import { useState, useEffect } from "react";
import useAsyncEffect from "@hooks/useAsyncEffect";
import { getSongsFromPath, play, pause, resume, setSong } from "./playlist";
import Footer from "@components/Footer";
import Menu from "@components/Menu";
import MainView from "@components/MainView";

// const playlists: Playlist[] = await invoke("get_playlists");

const LayoutResizer = () => (
  <div className="w-1 h-full cursor-e-resize [background:linear-gradient(hsla(0,0%,100%,0.3),hsla(0,0%,100%,0.3))_no-repeat_50%/1px_100%] opacity-0 hover:opacity-100" />
);

export default function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songData, setSongData] = useState<SongData>({
    playlistIndex: 0,
    songId: 0,
    liked: false,
    playing: false,
    progress: 0,
    volume: 1,
    lastStartTime: undefined,
    lastPauseTime: undefined,
  });
  const playlist: Playlist | undefined = playlists[songData.playlistIndex];
  const song = playlist?.songs[songData.songId];
  const previousSong = () => {
    setSongData((data) => ({
      ...data,
      progress: 0,
      lastStartTime: undefined,
      songId: data.progress <= 5 && data.songId > 0 ? data.songId - 1 : data.songId,
    }));
  };
  const nextSong = () => {
    setSongData((data) => ({
      ...data,
      progress: 0,
      lastStartTime: undefined,
      songId: data.songId + 1 < (playlist?.songs?.length || 0) ? data.songId + 1 : data.songId,
    }));
  };

  useAsyncEffect(async () => {
    const songs = await getSongsFromPath("~\\Music");
    setPlaylists((playlists) => [
      ...playlists.filter((playlist) => playlist.id != "liked"),
      {
        id: "liked",
        index: 0,
        name: "Liked songs",
        path: "C:\\Users\\kagan\\Music",
        songs,
        image: "https://misc.scdn.co/liked-songs/liked-songs-64.png",
      },
    ]);
  }, []);

  useAsyncEffect(async () => {
    if (song) {
      console.log("song changed");
      await pause();
      await (songData.playing ? play(song) : setSong(song)).catch(nextSong);
    }
  }, [song]);

  useAsyncEffect(async () => {
    if (songData.playing) {
      console.log("Resume");
      await resume();
    } else {
      console.log("Pause");
      await pause();
    }
  }, [songData.playing]);

  useEffect(() => {
    if (song && songData.playing && songData.progress < song.duration) {
      let timeoutId: NodeJS.Timeout | undefined;
      let intervalId: NodeJS.Timeout | undefined;

      const clear = () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
      const cb = () => {
        setSongData((data) => {
          if (data.progress < song.duration) {
            return { ...data, progress: data.progress + 1 };
          } else {
            console.log("next song");
            clear();
            nextSong();

            return data;
          }
        });
      };

      if (songData.lastStartTime && songData.lastPauseTime && songData.lastPauseTime > 0) {
        timeoutId = setTimeout(() => {
          cb();

          intervalId = setInterval(cb, 1000);
        }, 1000 - ((songData.lastStartTime - songData.lastPauseTime) % 1000));
      } else {
        intervalId = setInterval(cb, 1000);
      }

      return clear;
    }
  }, [songData.playing, song]); // Use when song playing and song changes

  return (
    <>
      <div className="relative grid h-screen max-h-screen min-h-full grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-2 p-2">
        <div className="flex flex-row max-h-[100vh-88px] overflow-hidden">
          <Menu
            playlists={playlists}
            onPlaylistClick={(playlist) =>
              setSongData((data) => ({ ...data, playlistIndex: playlist.index }))
            }
          />
          <LayoutResizer />
        </div>
        <MainView />
        <Footer
          song={song}
          liked={songData.liked}
          volume={songData.volume}
          progress={songData.progress}
          playing={songData.playing}
          // onLike={() => {
          //   // TODO: Add this song to liked songs
          // }}
          onPrevious={previousSong}
          onNext={nextSong}
          onPlayStatusChange={async () => {
            if (song.duration > 0) {
              const playing = !songData.playing;

              setSongData({
                ...songData,
                playing,
                [songData.playing ? "lastStartTime" : "lastPauseTime"]: Date.now(),
              });
            }
          }}
        />
      </div>
    </>
  );
}
