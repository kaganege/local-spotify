use id3::frame::{
  Lyrics, Picture, PictureType, SynchronisedLyrics, SynchronisedLyricsType, TimestampFormat,
};
use id3::{Tag, TagLike};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::fs::File;
use std::path::{Path, PathBuf};

pub const FILE_EXTENSIONS: &[&str] = &["mp3", "wav", "aiff"];

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Song {
  pub album: Option<String>,
  pub title: String,
  pub artists: Vec<String>,
  pub duration: f64,
  #[serde(serialize_with = "picture_ser")]
  #[serde(deserialize_with = "picture_deser")]
  pub pictures: Vec<Picture>,
  pub lyrics: Vec<LyricType>,
  pub path: PathBuf,
}

impl Default for Song {
  fn default() -> Self {
    Self {
      album: None,
      title: "".to_string(),
      artists: Vec::new(),
      duration: 0f64,
      pictures: Vec::new(),
      lyrics: Vec::new(),
      path: PathBuf::new(),
    }
  }
}

impl Song {
  pub fn get_file(&self) -> std::io::Result<File> {
    File::open(self.path.to_owned())
  }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LyricType {
  #[serde(with = "LyricsDef")]
  Lyrics(Lyrics),
  #[serde(with = "SynchronisedLyricsDef")]
  SynchronisedLyrics(SynchronisedLyrics),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(remote = "Lyrics")]
pub struct LyricsDef {
  pub lang: String,
  pub description: String,
  pub text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(remote = "SynchronisedLyrics")]
pub struct SynchronisedLyricsDef {
  pub lang: String,
  #[serde(with = "TimestampFormatDef")]
  pub timestamp_format: TimestampFormat,
  #[serde(with = "SynchronisedLyricsTypeDef")]
  pub content_type: SynchronisedLyricsType,
  pub description: String,
  pub content: Vec<(u32, String)>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(remote = "TimestampFormat")]
pub enum TimestampFormatDef {
  Mpeg,
  Ms,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(remote = "SynchronisedLyricsType")]
pub enum SynchronisedLyricsTypeDef {
  Other,
  Lyrics,
  Transcription,
  PartName,
  Event,
  Chord,
  Trivia,
}

#[derive(Serialize, Deserialize)]
#[serde(remote = "PictureType")]
pub enum PictureTypeDef {
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
  Undefined(u8),
}

#[derive(Clone, Serialize, Deserialize)]
pub struct PictureDef {
  pub mime_type: String,
  #[serde(with = "PictureTypeDef")]
  pub picture_type: PictureType,
  pub description: String,
  pub data: Vec<u8>,
}

fn to_def(picture: &Picture) -> PictureDef {
  PictureDef {
    mime_type: picture.mime_type.to_owned(),
    picture_type: picture.picture_type,
    description: picture.description.to_owned(),
    data: picture.data.to_owned(),
  }
}

fn to_picture(picture_def: &PictureDef) -> Picture {
  Picture {
    mime_type: picture_def.mime_type.to_owned(),
    picture_type: picture_def.picture_type,
    description: picture_def.description.to_owned(),
    data: picture_def.data.to_owned(),
  }
}

fn picture_ser<S: Serializer>(vec: &Vec<Picture>, serializer: S) -> Result<S::Ok, S::Error> {
  vec
    .iter()
    .map(to_def)
    .collect::<Vec<PictureDef>>()
    .serialize(serializer)
}

fn picture_deser<'de, D: Deserializer<'de>>(deserializer: D) -> Result<Vec<Picture>, D::Error> {
  let vec: Vec<PictureDef> = Deserialize::deserialize(deserializer)?;

  Ok(vec.iter().map(to_picture).collect())
}

pub fn get_song(path: &str) -> Option<Song> {
  let path = Path::new(path);
  let context = ffmpeg::format::input(&path);
  let metadata = context.as_ref().and_then(|ctx| Ok(ctx.metadata()));
  let tag = match path.extension().unwrap_or_default().to_str() {
    Some(ext) if ext.eq("wav") => Tag::read_from_wav_path(path),
    Some(ext) if ext.eq("aiff") => Tag::read_from_aiff_path(path),
    _ => Tag::read_from_path(path),
  };

  let album = if let Ok(tag) = &tag {
    if let Some(album) = tag.album() {
      let album = album.to_string();

      if album.len() > 0 {
        Some(album)
      } else {
        None
      }
    } else {
      Song::default().album
    }
  } else {
    Song::default().album
  };

  let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
  let data = if file_name.contains("-") {
    file_name.split_once("-")
  } else {
    None
  };

  let title = if let Ok(metadata) = &metadata {
    metadata.get("title")
  } else {
    if let Ok(tag) = &tag {
      tag.title()
    } else if let Some((_, title)) = data {
      Some(title)
    } else {
      None
    }
  }
  .unwrap_or(
    path
      .file_name()
      .unwrap_or_default()
      .to_str()
      .unwrap_or_default(),
  )
  .to_owned();

  let artists = if let Ok(metadata) = &metadata {
    metadata
      .get("artist")
      .unwrap_or_default()
      .split('/')
      .filter_map(|artist| {
        if artist.is_empty() {
          None
        } else {
          Some(artist.to_string())
        }
      })
      .collect()
  } else if let Ok(tag) = &tag {
    tag
      .artists()
      .unwrap_or_default()
      .iter()
      .filter_map(|artist| {
        if artist.is_empty() {
          None
        } else {
          Some(artist.to_string())
        }
      })
      .collect()
  } else if let Some((artist, _)) = data {
    vec![artist.to_owned()]
  } else {
    Song::default().artists
  };

  let duration = if let Ok(context) = &context {
    context.duration() as f64 / f64::from(ffmpeg::ffi::AV_TIME_BASE)
  } else {
    Song::default().duration
  };

  let pictures = if let Ok(tag) = &tag {
    tag.pictures().cloned().collect()
  } else {
    Song::default().pictures
  };

  let lyrics = if let Ok(tag) = &tag {
    let synchronised_lyrics: Vec<LyricType> = tag
      .synchronised_lyrics()
      .map(|l| LyricType::SynchronisedLyrics(l.clone()))
      .collect();
    let lyrics: Vec<LyricType> = tag.lyrics().map(|l| LyricType::Lyrics(l.clone())).collect();

    if synchronised_lyrics.len() > 0 {
      synchronised_lyrics
    } else {
      lyrics
    }
  } else {
    Song::default().lyrics
  };

  Some(Song {
    album,
    title,
    artists,
    duration,
    pictures,
    lyrics,
    path: path.to_owned(),
  })
}
