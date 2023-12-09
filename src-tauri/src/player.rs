use crate::song::Song;
use anyhow::Result;
use once_cell::sync::Lazy;
use rodio::{Decoder, OutputStream, OutputStreamHandle, Sink};
use std::io::BufReader;

// TODO: Drop on exit
thread_local!(static STREAM: (OutputStream, OutputStreamHandle) = OutputStream::try_default().unwrap());
pub static PLAYER: Lazy<Sink> = Lazy::new(|| {
  let player = Sink::try_new(&STREAM.with(|(_stream, handle)| handle.clone())).unwrap();
  player.pause();

  player
});

pub fn set_song(song: Song) -> Result<()> {
  PLAYER.clear();
  let song_file = song.get_file()?;
  let decoder = Decoder::new(BufReader::new(song_file))?;
  PLAYER.append(decoder);

  Ok(())
}

pub fn play(song: Song) -> Result<()> {
  if PLAYER.is_paused() {
    set_song(song)?;
    PLAYER.play();
  }

  Ok(())
}

pub fn resume() {
  if PLAYER.is_paused() && !PLAYER.empty() {
    PLAYER.play();
  }
}

pub fn pause() {
  PLAYER.pause();
}

pub fn set_volume(volume: f32) {
  PLAYER.set_volume(volume);
}

pub fn destroy() {
  drop(STREAM);
}
