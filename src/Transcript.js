import Immutable from 'immutable';
import Ajv from 'ajv';

import TranscriptSegment from './TranscriptSegment';
import TranscriptWord from './TranscriptWord';
import Speaker from './Speaker';

import schema from '../schema.json';

const TranscriptRecord = new Immutable.Record({
  speakers: new Immutable.List(),
  segments: new Immutable.List(),
});

class Transcript extends TranscriptRecord {
  static fromComma(json) {
    // Create a map of Comma speaker IDs to numeric speaker IDs, e.g. S0: 0, S4: 1, ...
    const speakerIdMap = {};

    const speakers = new Immutable.List(
      json.commaSegments.segmentation.speakers.map((s, i) => {
        speakerIdMap[s['@id']] = i;

        // Comma doesn't give us speaker names so we just create a new "empty" Speaker
        return new Speaker({
          name: null,
        });
      })
    );

    const segments = new Immutable.List(
      json.commaSegments.segmentation.segments.map((s, i) =>
        new TranscriptSegment({
          speaker: speakerIdMap[s.speaker['@id']],
          words: new Immutable.List(
            json.commaSegments.segments.transcriptions[i].words.map(w =>
              new TranscriptWord({
                text: w.punct,
                start: w.start,
                end: w.end,
              })
            )
          ),
        })
      )
    );

    return new Transcript({ speakers, segments });
  }

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

  static fromKaldi(transcriptJson, segmentsJson) {
    // Create a map of Kaldi speaker IDs to numeric speaker IDs, e.g. S0: 0, S4: 1, ...
    const speakerIdMap = {};

    const speakers = new Immutable.List(
      segmentsJson.speakers.map((s, i) => {
        speakerIdMap[s['@id']] = i;

        // Comma doesn't give us speaker names so we just create a new "empty" Speaker
        return new Speaker({
          name: null,
        });
      })
    );

    const segments = new Immutable.List(
      segmentsJson.segments.map(s =>
        new TranscriptSegment({
          speaker: speakerIdMap[s.speaker['@id']],
          words: new Immutable.List(
            transcriptJson.words
              .filter(({ start, end }) =>
                start >= s.start && end <= s.start + s.duration
              )
              .map(w =>
                new TranscriptWord({
                  text: w.word,
                  start: w.start,
                  end: w.end,
                })
              )
          ),
        })
      )
    );

    return new Transcript({ speakers, segments });
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
