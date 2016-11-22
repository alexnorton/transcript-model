import Immutable from 'immutable';
import Ajv from 'ajv';

import UntimedSegment from './UntimedSegment';
import Word from './Word';
import Speaker from './Speaker';

import schema from '../schema.json';

const TranscriptRecord = new Immutable.Record({
  speakers: new Immutable.List(),
  segments: new Immutable.List(),
});

class Transcript extends TranscriptRecord {

  getText() {
    return this
      .get('segments')
      .reduce((text, segment) => `${text} ${segment.getText()}`, '')
      .trim();
  }

  static fromJSON(json) {
    this.validateJSON(json);

    const speakers = new Immutable.List(json.speakers.map(speaker =>
      new Speaker(speaker),
    ));

    const segments = new Immutable.List(
      json.segments.map(({ speaker, words }) => new UntimedSegment({
        speaker,
        words: new Immutable.List(
          words.map(({ text }) => new Word({
            text,
          })),
        ),
      })),
    );

    return new Transcript({
      speakers,
      segments,
    });
  }

  static validateJSON(json) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, json);
    if (!valid) {
      throw new Error(`invalid transcript JSON:\n${JSON.stringify(ajv.errors, null, 2)}`);
    }
    return true;
  }
}

export default Transcript;
