import path from 'path';
import fs from 'fs';

import MediaTaggerAdapter from '../MediaTaggerAdapter';

describe('MediaTaggerAdapter', () => {
  it('parses Media Tagger transcripts correctly', () => {
    const mediaTaggerResponseFile = fs.readFileSync(path.join(__dirname, 'fixtures', 'mediatagger-response.json'));
    const mediaTaggerResponse = JSON.parse(mediaTaggerResponseFile);

    const expectedTranscriptFile = fs.readFileSync(path.join(__dirname, 'fixtures', 'mediatagger-transcript.json'));
    const expectedTranscriptJson = JSON.parse(expectedTranscriptFile);

    const transcript = MediaTaggerAdapter.parse(mediaTaggerResponse);

    expect(transcript.toJSON()).toEqual(expectedTranscriptJson);
  });
});
