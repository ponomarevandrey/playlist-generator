import { GENRES } from "./config/constants";

export interface Track {
  trackId?: number;
  duration: number;
  artists: string[];
  year: number;
  title: string;
  genres: string[];
}

export interface ValidatedTrack {
  trackId?: number;
  filePath: string;
  duration: number;
  artists: string[];
  year: number;
  title: string;
  genres: (typeof GENRES)[number][];
}

export type FoundTrackDBResponse = {
  artists: string[];
  duration: string;
  genres: string[];
  genre_ids: number[];
  title: string;
  track_id: number;
  year: number;
  file_path: string;
};
export type FoundTrack = {
  artists: string[];
  duration: number;
  genres: string[];
  genreIds: number[];
  title: string;
  trackId: number;
  year: number;
  filePath: string;
};

export type Filter = {
  name: string;
  condition: string;
  value: number | number[];
};
