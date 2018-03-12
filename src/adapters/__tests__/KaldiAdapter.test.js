/* eslint-disable global-require */

import KaldiAdapter from '../KaldiAdapter';

describe('MediaTaggerAdapter', () => {
  it('parses Media Tagger transcripts correctly', () => {
    const transcriptionJson = require('./fixtures/kaldi-1-transcription.json');
    const segmentationJson = require('./fixtures/kaldi-1-segmentation.json');

    const expectedTranscriptJson = require('./fixtures/kaldi-1-expected-transcript.json');

    const transcript = KaldiAdapter.parse(transcriptionJson, segmentationJson);

    expect(transcript.toJson()).toEqual(expectedTranscriptJson);
  });

  it('assigns words that occur outside of segments to the previous segment', () => {
    const transcriptionJson = require('./fixtures/kaldi-2-transcription.json');
    const segmentationJson = require('./fixtures/kaldi-2-segmentation.json');

    const transcript = KaldiAdapter.parse(transcriptionJson, segmentationJson);

    const text = transcript.segments.map(segment => segment.words.map(word => word.text).join(' ')).join(' ');

    expect(text).toEqual(transcriptionJson.punct);
  });
});
