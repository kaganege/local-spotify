import { invoke } from "@tauri-apps/api/tauri";
// import Database from "tauri-plugin-sql-api";

// const db = await Database.load("sqlite:data.db");
// await db.execute("Create TABLE if not exists playlists(track_id, name, artists)");

// export async function savePlaylist({ id, name, image, path }: Playlist) {
//   await db.execute("INTERT into playlists (id, name, image, path) VALUES ($1, $2, $3, $4)", [
//     id,
//     name,
//     image,
//     path,
//   ]);
// }

export async function getSongsFromPath(path: string): Promise<Song[]> {
  return await invoke<Song[]>("get_songs_from_path", { path });
}

export async function setSong(song: Song) {
  await invoke("set_song", { song });
}

export async function play(song: Song) {
  await invoke("play", { song });
}

export async function resume() {
  await invoke("resume");
}

export async function pause() {
  await invoke("pause");
}

// export async function skip() {
//   await invoke("skip");
// }

export async function setVolume(volume: number) {
  await invoke("set_volume", { volume });
}
