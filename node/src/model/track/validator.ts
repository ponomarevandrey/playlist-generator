import { ValidationError } from "joi";
import { TrackMetadataParser } from "../../utils/utilities";
import { schemaCreateTrack } from "./validation-schemas";
import { Track } from "../../types";

type Errors = {
  filePath: string;
  tag: string | number;
  value?: string | string[] | number;
  msg: string;
}[];
type DB = { [key: string]: Set<string | number> };

export class TrackValidator {
  public errors: Errors;
  public db: DB;

  constructor() {
    this.errors = [];
    this.db = {
      artist: new Set(),
      genre: new Set(),
      year: new Set(),
    };
    this.validate = this.validate.bind(this);
  }

  public async validate(filePath: string) {
    const trackMetadataParser = new TrackMetadataParser(filePath);
    try {
      const parsedTrack: Track = await schemaCreateTrack.validateAsync(
        await trackMetadataParser.parseAudioFile(),
      );
      this.db.year.add(parsedTrack.year);
      parsedTrack.genre.forEach((genre) => this.db.genre.add(genre));
      parsedTrack.artist.forEach((artist) => this.db.artist.add(artist));
    } catch (err) {
      if (err instanceof ValidationError) {
        err.details.forEach((err) =>
          this.errors.push({
            filePath: filePath,
            tag: err.path[0],
            value: err.context?.value,
            msg: err.message,
          }),
        );
      } else {
        console.log("Unknown type of error");
        throw err;
      }
    }
  }
}
