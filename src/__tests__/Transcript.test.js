import fs from 'fs';
import path from 'path';

import Transcript from '../Transcript';
import UntimedSegment from '../UntimedSegment';
import Word from '../Word';

import Speaker from '../Speaker';

describe('validateJSON', () => {
  it('should correctly validate an un-timed Transcript', () => {
    const validTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-untimed-transcript.json'), 'utf8',
    ));
    expect(Transcript.validateJSON(validTranscript)).toBe(true);
  });

  it('should correctly invalidate an un-timed Transcript', () => {
    const validTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/invalid-untimed-transcript.json'), 'utf8',
    ));
    expect(() => Transcript.validateJSON(validTranscript)).toThrow();
  });

  it('should correctly validate a timed Transcript', () => {
    const validTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-timed-transcript.json'), 'utf8',
    ));
    expect(Transcript.validateJSON(validTranscript)).toBe(true);
  });

  it('should correctly invalidate a timed Transcript', () => {
    const validTranscript = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/invalid-untimed-transcript.json'), 'utf8',
    ));
    expect(() => Transcript.validateJSON(validTranscript)).toThrow();
  });
});

describe('fromJSON', () => {
  it('creates an instance from un-timed JSON data', () => {
    const transcriptJSON = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-untimed-transcript.json'), 'utf8',
    ));

    const transcript = Transcript.fromJSON(transcriptJSON);

    expect(transcript instanceof Transcript).toBe(true);

    expect(transcript.get('speakers').size).toBe(2);
    expect(transcript.get('speakers').get(0) instanceof Speaker).toBe(true);
    expect(transcript.get('speakers').toJS()).toEqual([
      { name: 'Barack Obama' },
      { name: null },
    ]);

    expect(transcript.get('segments').size).toBe(2);
    expect(transcript.get('segments').get(1) instanceof UntimedSegment).toBe(true);

    expect(transcript.get('segments').get(1).toJS()).toEqual({
      speaker: 1,
      words: [
        {
          text: 'Hi',
        },
        {
          text: 'Barack.',
        },
      ],
    });

    const word = transcript.get('segments').get(1).get('words').get(0);
    expect(word instanceof Word).toBe(true);
  });

  xit('creates an instance from timed JSON data', () => {
  });
});


describe('toJSON', () => {
  it('produces valid un-timed JSON data', () => {
    const originalTranscriptJSON = JSON.parse(fs.readFileSync(
      path.join(__dirname, '/fixtures/valid-untimed-transcript.json'), 'utf8',
    ));

    const transcript = Transcript.fromJSON(originalTranscriptJSON);
    const transcriptJSON = transcript.toJSON();
    expect(Transcript.validateJSON(transcriptJSON)).toBe(true);
  });

  xit('produces valid timed JSON data', () => {

  });
});
