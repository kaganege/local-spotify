extern crate directories;
// extern crate unqlite;

// use super::song::Song;
use convert_case::{Case, Casing};
use directories::ProjectDirs;
// use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

pub fn get_database_path() -> PathBuf {
  let application_name = env!("CARGO_PKG_NAME").to_case(Case::Title);
  let project_dir =
    ProjectDirs::from("", "", application_name.as_str()).expect("Cannot access to project dir!");

  if !project_dir.data_local_dir().exists() {
    println!("Creating config dir!");
    fs::create_dir_all(project_dir.data_local_dir()).expect("Cannot create the config dir!");
  }

  project_dir.data_local_dir().join("playlists.db")
}

// use unqlite::{Cursor, UnQLite, KV};

// static mut DB: Option<UnQLite> = None;

// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub struct Playlist {
//   pub name: &'static str,
//   pub index: isize,
//   pub image: Option<&'static str>,
//   pub songs: Vec<Song>,
// }

// impl AsRef<[u8]> for Playlist {
//   fn as_ref(&self) -> &[u8] {
//     unsafe {
//       ::core::slice::from_raw_parts(
//         (self as *const Playlist) as *const u8,
//         ::core::mem::size_of::<Playlist>(),
//       )
//     }
//   }
// }

// impl Playlist {
//   pub fn save(&self) {
//     unsafe {
//       if DB.is_none() {
//         prepare_database();
//       }

//       DB.as_ref()
//         .unwrap()
//         .kv_store(self.name, &self)
//         .expect("Does not successful when saving playlist!");
//     }
//   }
// }

// pub static PLAYLISTS: Lazy<Playlists> = vec![Playlist {
//   name: "Liked songs",
//   index: 0,
//   image: Some("https://misc.scdn.co/liked-songs/liked-songs-64.png"),
//   songs: vec![Song {
//     name: "Proportions (Karabiber Duası 2) (feat. Toolz)",
//     authors: vec!["Sagopa Kajmer"],
//     image: Some("https://i.scdn.co/image/ab67616d000048515cf8c954e1bb69c28623db75"),
//     duration: 180,
//     path: Path::new(""),
//   }],
// }];

// pub fn prepare_database() {
//   let application_name = env!("CARGO_PKG_NAME").to_case(Case::Title);
//   let project_dir =
//     ProjectDirs::from("", "", application_name.as_str()).expect("Cannot access to project dir!");

//   if !project_dir.data_local_dir().exists() {
//     println!("Creating config dir!");
//     fs::create_dir_all(project_dir.data_local_dir()).expect("Cannot create the config dir!");
//   }

//   let database_path = project_dir.data_local_dir().join("playlists.db");

//   unsafe {
//     DB = Some(UnQLite::create(
//       database_path.to_str().expect("Cannot convert string"),
//     ));
//   };

//   let liked_songs = Playlist {
//     name: "Liked songs",
//     index: 0,
//     image: Some("https://misc.scdn.co/liked-songs/liked-songs-64.png"),
//     songs: vec![Song {
//       name: "Proportions (Karabiber Duası 2) (feat. Toolz)",
//       authors: vec!["Sagopa Kajmer"],
//       image: Some("https://i.scdn.co/image/ab67616d000048515cf8c954e1bb69c28623db75"),
//       duration: 180,
//       path: Path::new(""),
//     }],
//   };

//   liked_songs.save();
// }

// pub fn get_playlists() -> Vec<Playlist> {
//   unsafe {
//     if DB.is_none() {
//       prepare_database();
//     }
//   }
//   let mut playlists: Vec<Playlist> = Vec::new();
//   let mut entry = unsafe { DB.as_ref().unwrap().first() };

//   while entry.is_some() {
//     let record = entry.unwrap();
//     let value = record.value();

//     let (head, body, _tail) = unsafe { value.align_to::<Playlist>() };
//     assert!(head.is_empty(), "Data was not aligned");

//     playlists.push(body[0].clone());
//     entry = record.next();
//   }

//   playlists
// }
