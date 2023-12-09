#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate ffmpeg_the_third as ffmpeg;

use anyhow::Error as AnyError;
use rayon::prelude::*;
use song::Song;
use std::{env, fs::File, io::Read, path::PathBuf};
use walkdir::{DirEntry, WalkDir};
// use ignore::{WalkBuilder, WalkState};
// use tokio::sync::oneshot;

mod player;
mod song;

fn parse_path(path: &str) -> String {
  let home_dir = if cfg!(target_os = "windows") {
    env::var("USERPROFILE")
  } else {
    env::var("HOME")
  }
  .unwrap_or_default();

  println!("{home_dir}");

  path.replacen('~', home_dir.as_parallel_string(), 1)
}

#[tauri::command]
async fn get_songs_from_path(path: &str) -> Result<Vec<Song>, String> {
  let path = parse_path(path);
  let files: Vec<DirEntry> = WalkDir::new(path)
    .into_iter()
    .filter_map(Result::ok)
    .filter(|e| {
      !e.file_type().is_dir()
        && e.path().extension().is_some_and(|e| {
          song::FILE_EXTENSIONS.contains(&e.to_str().unwrap().to_lowercase().as_str())
        })
    })
    .collect();

  Ok(
    (0..files.clone().len())
      .into_par_iter()
      .filter_map(|i| song::get_song(files[i].path().as_os_str().to_str().unwrap()))
      .collect(),
  )
}

#[tauri::command]
async fn get_song_data_from_path(path: PathBuf) -> Vec<u8> {
  let path = parse_path(path.to_str().unwrap_or_default());
  let mut file = File::open(path).unwrap();
  let mut buffer: Vec<u8> = Vec::new();
  file.read_to_end(&mut buffer).unwrap();

  buffer
}

#[tauri::command]
fn set_song(song: Song) -> Result<(), String> {
  let result = player::set_song(song);
  if let Err(error) = result {
    Err(error.to_string())
  } else {
    result.unwrap();
    Ok(())
  }
}

#[tauri::command]
fn play(song: Song) -> Result<(), String> {
  let result = player::play(song);
  if let Err(error) = result {
    Err(error.to_string())
  } else {
    result.unwrap();
    Ok(())
  }
}

#[tauri::command]
fn resume() {
  player::resume()
}

#[tauri::command]
fn pause() {
  player::pause()
}

#[tauri::command]
fn set_volume(volume: f32) {
  player::set_volume(volume)
}

fn main() -> Result<(), AnyError> {
  ffmpeg::init()?;
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      get_songs_from_path,
      get_song_data_from_path,
      set_song,
      play,
      resume,
      pause,
      set_volume
    ])
    .run(tauri::generate_context!())?;

  player::destroy();

  Ok(())
}
