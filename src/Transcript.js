import Immutable from 'immutable';
import Ajv from 'ajv';

import TranscriptSegment from './TranscriptSegment';
import TranscriptWord from './TranscriptWord';
import Speaker from './Speaker';
import KaldiAdapter from './adapters/KaldiAdapter';
import MediaTaggerAdapter from './adapters/MediaTaggerAdapter';

import schema from '../schema.json';

const TranscriptRecord = new Immutable.Record({
  speakers: new Immutable.List(),
  segments: new Immutable.List(),
});

class Transcript extends TranscriptRecord {
  static fromJSON(json) {
    this.validateJSON(json);

    const speakers = new Immutable.List(json.speakers.map(speaker =>
      new Speaker(speaker)
    ));

    const segments = new Immutable.List(
      json.segments.map(({ speaker, words }) => new TranscriptSegment({
        speaker,
        words: new Immutable.List(
          words.map(({ start, end, text, guid }) => new TranscriptWord({
            start,
            end,
            text,
            id: guid,
          }))
        ),
      }))
    );

    return new Transcript({
      speakers,
      segments,
    });
  }

  static fromMediaTagger(json) {
    MediaTaggerAdapter.parse(json);
  }

  static fromKaldi(transcriptJson, segmentsJson) {
    return KaldiAdapter.parse(transcriptJson, segmentsJson);
  }

  static validateJSON(json) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, json);
    if (!valid) {
      throw new Error(`invalid transcript JSON:\n${JSON.stringify(ajv.errors, null, 2)}`);
    }
    return true;
  }

  slice(start = 0, end) {
    const segments = this.segments
      .filter(segment => segment.getEnd() > start && (segment.getStart() < end || !end))
      .map(segment => new TranscriptSegment({
        speaker: segment.speaker,
        words: segment.words
          .filter(word => word.end > start && (word.start < end || !end))
          .map(word => new TranscriptWord({
            start: (word.start - start) >= 0 ? word.start - start : 0,
            end: word.end - start,
            id: word.id,
            text: word.text,
          })),
      }));

    return new Transcript({ speakers: this.speakers, segments });
  }

  toJSON() {
    return {
      speakers: this.speakers.toArray().map(speaker => ({
        name: speaker.name,
      })),
      segments: this.segments.toArray().map(segment => ({
        words: segment.words.toArray().map(word => ({
          text: word.text,
          start: word.start,
          end: word.end,
        })),
        speaker: segment.speaker,
      })),
    };
  }
}

export default Transcript;
