import path from "path";
import fs from "fs-extra";
import * as mm from "music-metadata";
import { Track } from "../types";
import { SUPPORTED_CODEC } from "../config/env";

export function logDBError(msg: string, err: unknown) {
  if (err instanceof Error) {
    console.error(
      `${__filename}: ${msg}\n${
        process.env.NODE_ENV === "development" ? err.stack : ""
      }`,
    );
  } else {
    console.error(err);
  }
}

export async function traverseDirs(
  dirpath: string,
  callback: (nodePath: string) => Promise<void>,
) {
  const fileSystemNodes = await fs.readdir(dirpath);

  for (const fileSystemNode of fileSystemNodes) {
    const nodePath = path.join(dirpath, fileSystemNode);
    const nodeStats = await fs.stat(nodePath);

    if (nodeStats.isDirectory()) {
      await traverseDirs(nodePath, callback);
    } else if (SUPPORTED_CODEC.includes(getExtensionName(nodePath))) {
      try {
        await callback(nodePath);
      } catch (err) {
        if (err instanceof Error) {
          console.error(`[Error. Skip file ${nodePath}] ${err}, ${err.stack}`);
        }
      }
    }
  }
}

export function hyphenToUpperCase(str: string): string {
  function format(match: string, offset: number, string: string) {
    return offset > 0 ? string[offset + 1].toUpperCase() : "";
  }
  return str.replace(/-[a-z0-9]{0,1}/g, format);
}

export function getExtensionName(nodePath: string): string {
  return path.extname(nodePath).slice(1).toLowerCase();
}

export function parseFilterIDs(arr: unknown): number[] | null {
  if (Array.isArray(arr)) return arr.map((id) => parseInt(id));
  else return null;
}

export function filterByExtension(filepath: string) {
  return new RegExp(`\\.(${SUPPORTED_CODEC.join("|")})$`).test(
    filepath.toLowerCase(),
  );
}

export class TrackMetadataParser {
  readonly #filePath: string;

  constructor(filePath: string) {
    this.#filePath = filePath;
  }

  async parseAudioFile(): Promise<Track> {
    const trackMetadata = await mm.parseFile(this.#filePath);

    const duration = this.parseDuration(trackMetadata.format.duration);
    const artists = this.parseTrackArtist(trackMetadata.common.artists);
    const year = this.parseYear(trackMetadata.common.year);
    const title = this.parseTrackTitle(trackMetadata.common.title);
    const genres = this.parseGenre(trackMetadata.common.genre);

    const extendedMetadata = {
      filePath: this.#filePath,
      duration,
      artists,
      year,
      title,
      genres,
    };
    return extendedMetadata;
  }

  private parseGenre(genres?: string[]): string[] {
    return this.parseArray(genres);
  }

  private parseYear(year?: number): number {
    return this.parseNumber(year);
  }

  private parseTrackTitle(title?: string): string {
    return this.parseString(title);
  }

  private parseDuration(duration?: number): number {
    return this.parseNumber(duration);
  }

  private parseTrackArtist(artists?: string[]): string[] {
    return this.parseArray(artists);
  }

  private parseArray(arr?: string[]): string[] {
    if (Array.isArray(arr) && arr.length > 0 && arr[0].length > 0) {
      // Use Set to get rid of duplicate items
      return [...new Set(arr.filter((str) => str !== ""))];
    } else {
      console.debug(
        `${this.#filePath}: ID3 tag value which is either not an array or an empty array is set to "Unknown"`,
      );
      return [];
    }
  }

  private parseNumber(num?: number): number {
    return num || 0;
  }
  private parseString(str?: string): string {
    return str || "";
  }
}
