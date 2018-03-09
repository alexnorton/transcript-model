/* eslint-disable global-require */

import KaldiAdapter from '../KaldiAdapter';

describe('MediaTaggerAdapter', () => {
  it('parses Media Tagger transcripts correctly', () => {
    const transcriptionJson = require('./fixtures/kaldi-transcription.json');
    const segmentationJson = require('./fixtures/kaldi-segmentation.json');

    const expectedTranscriptJson = require('./fixtures/kaldi-expected-transcript.json');

    const transcript = KaldiAdapter.parse(transcriptionJson, segmentationJson);

    expect(transcript.toJson()).toEqual(expectedTranscriptJson);
  });
});
