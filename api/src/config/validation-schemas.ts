import Joi from "joi";
import { SearchParams } from "../utils/query-builder";

const schemaTrackId = Joi.number()
  .positive()
  .integer()
  .min(1)
  .required()
  .messages({
    "number.base": `"trackId" must be a type of 'number'`,
    "number.integer": `"trackId" must be an integer`,
    "number.min": `"trackId" minimum value is "1"`,
    "any.required": `"trackId" is required`,
  });

const schemaId = Joi.number().positive().integer().min(1).required().messages({
  "number.base": `"id" must be a type of 'number'`,
  "number.integer": `"id" must be an integer`,
  "number.min": `"id" minimum value is "1"`,
  "any.required": `"id" is required`,
});

const playlistName = Joi.string().min(1).max(255).required().messages({
  "string.base": `"name" should be a type of 'string'`,
  "number.min": `"name" min length is 1 symbol`,
  "number.max": `"name" max length is 255 symbols`,
  "any.required": `"name" is required`,
});

const schemaLimit = Joi.number()
  .integer()
  .positive()
  .min(1)
  .required()
  .messages({
    "number.base": `"limit" must be a type of 'number'`,
    "number.integer": `"limit" must be an integer`,
    "number.min": `"limit" minimum value is "1"`,
    "any.required": `"limit" is required`,
  });

export const schemaIdParam = Joi.object<{ id: number }>({
  id: schemaId,
});

export const schemaCreatePlaylist = Joi.object<{ name: string }>({
  name: playlistName,
});

export const schemaUpdatePlaylist = Joi.object<{ name: string }>({
  name: playlistName,
});

export const schemaAddTrackToPlaylist = Joi.object<{
  trackId: number;
  subplaylistId: number;
}>({ trackId: schemaTrackId });

export const schemaUpdateTracksInPlaylist = Joi.object<{
  tracks: { trackId: number; position: number }[];
}>({
  tracks: Joi.array()
    .items(
      Joi.object({
        trackId: Joi.number().positive().min(1).required(),
        position: Joi.number().positive().min(1).required(),
      }),
    )
    .required(),
});

const schemaFilter = Joi.object({
  name: Joi.string().valid("year", "genre"),
  rule: Joi.string().valid(
    "is",
    "is not",
    "greater than or equal",
    "less than or equal",
    "contains any",
    "contains all",
    "does not contain all",
    "does not contain any",
  ),
  value: Joi.alternatives(Joi.number(), Joi.array().items(Joi.number())),
});

export let schemaFindTrackReqBody = Joi.object<SearchParams>({
  operator: Joi.string().valid("AND", "OR"),
  filters: Joi.alternatives(
    Joi.object({
      operator: Joi.string().valid("AND", "OR"),
      filters: Joi.array().items(schemaFilter),
    }),
    Joi.array().items(schemaFilter),
  ),
  excludeTracks: Joi.array()
    .items(Joi.number().positive().optional())
    .min(0)
    .required(),
});
