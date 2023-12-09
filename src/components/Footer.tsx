import { type CSSProperties, useEffect, useState } from "react";
import HeartIcon from "@assets/heart.svg?react";
import FilledHeartIcon from "@assets/filled-heart.svg?react";
import ShuffleIcon from "@assets/shuffle.svg?react";
import PreviousIcon from "@assets/previous.svg?react";
import PlayIcon from "@assets/play.svg?react";
import PauseIcon from "@assets/pause.svg?react";
import NextIcon from "@assets/next.svg?react";
import RepeatIcon from "@assets/repeat.svg?react";
import NoteIcon from "@assets/note.svg?react";
import SongViewIcon from "@assets/song-view.svg?react";
import LyricsIcon from "@assets/microphone.svg?react";
import SongListIcon from "@assets/song-list.svg?react";
import LowVolumeLevelIcon from "@assets/low-volume-level.svg?react";
import MediumVolumeLevelIcon from "@assets/medium-volume-level.svg?react";
import HighVolumeLevelIcon from "@assets/high-volume-level.svg?react";

export type Props = {
  song?: Song;
  liked: boolean;
  volume: number;
  progress: number;
  playing: boolean;
  onLike?: (liked: boolean) => any;
  onPlayStatusChange?: (song: Song) => any;
  onPrevious?: (song: Song) => any;
  onNext?: (song: Song) => any;
  onShuffle?: (song: Song) => any;
  onRepeat?: (song: Song) => any;
};

function LikeButton({ song, liked, onLike }: Pick<Props, "onLike" | "song" | "liked">) {
  return (
    <button onClick={song ? () => onLike?.(!liked) : undefined}>
      <span className="flex">
        {liked ? (
          <FilledHeartIcon className="w-4 h-4 text-green-500" />
        ) : (
          <HeartIcon className="w-4 h-4 text-zinc-400" />
        )}
      </span>
    </button>
  );
}

export default function Footer({
  song,
  volume,
  progress,
  playing,
  liked,
  onLike,
  onPlayStatusChange,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
}: Props) {
  const [image, setImage] = useState<string>();
  useEffect(() => {
    if (song && song.pictures.length > 0) {
      setImage(
        `data:${song.pictures[0].mime_type};base64,` +
          // @ts-ignore
          btoa(
            new Uint8Array(song.pictures[0].data).reduce(function (data, byte) {
              return data + String.fromCharCode(byte);
            }, "")
          )
      );
    }
  }, [song?.pictures[0]]);

  return (
    <footer className="row-start-2 col-span-3 w-full z-10 flex flex-row items-center justify-between h-auto my-2 min-w-[620px]">
      {/* Song info */}
      <div className="min-w-[180px] w-[30%] ps-2">
        <div className="relative flex flex-row items-center justify-start space-x-2">
          {/* Thumbnail */}
          <div className="relative overflow-hidden rounded select-none isolate shrink-0 me-2">
            <a href="#">
              <div className="flex items-center justify-center bg-background-light w-14 h-14">
                {song ? (
                  <img src={image} alt="song" className="w-full h-full bg-no-repeat bg-contain" />
                ) : (
                  <NoteIcon className="w-4 h-4" />
                )}
              </div>
            </a>
          </div>
          {/* Song */}
          <div className="grid items-center grid-rows-2">
            <div className="relative w-full pl-1 pr-3 overflow-x-hidden text-sm scrollbar whitespace-nowrap">
              <span draggable>
                <a href="#" className="text-white hover:underline">
                  {song?.title || "Song"}
                </a>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-l from-transparent to-black" />
                <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-r from-transparent to-black" />
              </span>
            </div>
            {(!song || song.artists.length > 0) && (
              <div className="relative w-full pl-1 pr-3 overflow-x-hidden text-xs whitespace-nowrap">
                <span className="inline" draggable>
                  <button className="hover:underline hover:text-white">
                    {song?.artists[0] || "Artist"}
                  </button>
                  {song?.artists.slice(1).map((artist) => (
                    <>
                      , <button className="hover:underline hover:text-white">{artist}</button>
                    </>
                  ))}
                </span>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-l from-transparent to-black" />
                <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-r from-transparent to-black" />
              </div>
            )}
          </div>
          <LikeButton song={song} onLike={onLike} liked={liked} />
        </div>
      </div>
      {/* Controller */}
      <div className="w-2/5 max-w-[722px]">
        <div className="flex flex-col items-center justify-center">
          {/* Control buttons */}
          <div className="flex flex-row w-full gap-4 mb-2 flex-nowrap">
            <div className="flex justify-end flex-1 gap-2">
              <button
                onClick={song ? () => onShuffle?.(song) : undefined}
                disabled={!song}
                className="disabled:brightness-50 w-8 h-8 flex relative text-zinc-400 justify-center items-center min-w-[32px] transition-all duration-[33ms] ease-[cubic-bezier(0.3,0,0.7,1)]"
              >
                <ShuffleIcon className="w-4 h-4" />
              </button>
              <button
                onClick={song ? () => onPrevious?.(song) : undefined}
                disabled={!song}
                className="disabled:brightness-50 w-8 h-8 flex relative text-zinc-400 justify-center items-center min-w-[32px] transition-all duration-[33ms] ease-[cubic-bezier(0.3,0,0.7,1)]"
              >
                <PreviousIcon className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={song ? () => onPlayStatusChange?.(song) : undefined}
              disabled={!song}
              className="disabled:brightness-50 w-8 h-8 rounded-full flex relative text-black bg-white justify-center items-center min-w-[32px] transition-all duration-[33ms] ease-[cubic-bezier(0.3,0,0.7,1)]"
            >
              {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>
            <div className="flex justify-start flex-1 gap-2">
              <button
                onClick={song ? () => onNext?.(song) : undefined}
                disabled={!song}
                className="disabled:brightness-50 w-8 h-8 flex relative text-zinc-400 justify-center items-center min-w-[32px] transition-all duration-[33ms] ease-[cubic-bezier(0.3,0,0.7,1)]"
              >
                <NextIcon className="w-4 h-4" />
              </button>
              <button
                onClick={song ? () => onRepeat?.(song) : undefined}
                disabled={!song}
                className="disabled:brightness-50 w-8 h-8 flex relative text-zinc-400 justify-center items-center min-w-[32px] transition-all duration-[33ms] ease-[cubic-bezier(0.3,0,0.7,1)]"
              >
                <RepeatIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Playback bar */}
          <div className="flex flex-row items-center justify-between w-full gap-2">
            <div className="min-w-[40px] text-right text-xs select-none">
              {song
                ? `${Math.floor(progress / 60)}:${(progress % 60).toString().padStart(2, "0")}`
                : "-:--"}
            </div>
            <div className="relative w-full h-3">
              <label className="hidden-visually">
                <input
                  type="range"
                  min={0}
                  max={song?.duration || 0}
                  step={5}
                  defaultValue={progress || 0}
                />
              </label>
              <div className="w-full h-full overflow-hidden rounded-full group touch-none">
                <div className="absolute flex w-full h-1 -translate-y-1/2 bg-white rounded-full group-hover:bg-green-500 top-1/2">
                  <div className="w-full h-full overflow-hidden rounded-full">
                    <div
                      className="w-full h-1 translate-x-0 bg-neutral-600"
                      style={
                        {
                          "--tw-translate-x": `${((progress || 0) * 100) / (song?.duration || 0)}%`,
                        } as CSSProperties
                      }
                    />
                  </div>
                  <div
                    className="-ml-[6px] absolute z-50 bg-white border-0 rounded-full hidden group-hover:block h-3 w-3 top-1/2 -translate-y-1/2"
                    style={{ left: `${((progress || 0) * 100) / (song?.duration || 0)}%` }}
                  />
                </div>
                <div className="w-full" />
              </div>
            </div>
            <div className="min-w-[40px] text-left text-xs select-none">
              {song
                ? `${Math.floor((song?.duration || 0) / 60)}:${((song?.duration || 0) % 60)
                    .toFixed(0)
                    .padStart(2, "0")}`
                : "-:--"}
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-row justify-end w-[30%] min-w-[180px]">
        <div className="flex items-center justify-end flex-grow">
          {/* Song info view */}
          <button className="p-2 cursor-pointer select-none hover:text-white focus-visible:text-white touch-manipulation">
            <SongViewIcon className="w-4 h-4" />
          </button>
          {/* Lyrics */}
          {(song?.lyrics?.length || 0) > 0 && (
            <button className="p-2 cursor-pointer select-none hover:text-white focus-visible:text-white touch-manipulation">
              <LyricsIcon className="w-4 h-4" />
            </button>
          )}
          {/* Song List */}
          <button className="p-2 cursor-pointer select-none hover:text-white focus-visible:text-white touch-manipulation">
            <SongListIcon className="w-4 h-4" />
          </button>
          {/* Volume level bar */}
          <div className="relative flex flex-[0_1_125px] items-center mr-2">
            {/* Mute button */}
            <button className="relative flex items-center justify-center min-w-[32px] w-8 h-8 hover:text-white focus-visible:text-white">
              {volume <= 1 / 3 ? (
                <LowVolumeLevelIcon className="w-4 h-4" />
              ) : volume <= (1 / 3) * 2 ? (
                <MediumVolumeLevelIcon className="w-4 h-4" />
              ) : (
                <HighVolumeLevelIcon className="w-4 h-4" />
              )}
            </button>
            {/* Bar */}
            <div className="w-full">
              <div className="relative w-full h-3">
                <label className="hidden-visually">
                  <input type="range" min={0} max={1} step={0.1} defaultValue={volume} />
                </label>
                <div className="w-full h-full overflow-hidden rounded-full group touch-none">
                  <div className="absolute flex w-full h-1 -translate-y-1/2 bg-white rounded-full group-hover:bg-green-500 top-1/2">
                    <div className="w-full h-full overflow-hidden rounded-full">
                      <div
                        className="w-full h-1 translate-x-0 bg-neutral-600"
                        style={
                          {
                            "--tw-translate-x": `${volume * 100}%`,
                          } as CSSProperties
                        }
                      />
                    </div>
                    <div
                      className="-ml-[6px] absolute z-50 bg-white border-0 rounded-full hidden group-hover:block h-3 w-3 top-1/2 -translate-y-1/2"
                      style={{ left: `${volume * 100}%` }}
                    />
                  </div>
                  <div className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
