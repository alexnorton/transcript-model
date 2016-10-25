import Immutable from 'immutable';

import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';

const createSegment = () => (
  new TranscriptSegment({
    words: new Immutable.List([
      new TranscriptWord({ start: 0.1, end: 0.5, text: 'hello' }),
      new TranscriptWord({ start: 0.6, end: 0.9, text: 'this' }),
      new TranscriptWord({ start: 1.05, end: 1.2, text: 'is' }),
      new TranscriptWord({ start: 1.3, end: 1.4, text: 'a' }),
      new TranscriptWord({ start: 1.5, end: 1.77, text: 'test' }),
    ]),
  })
);

describe('getStart', () => {
  it('returns the start time of the segment', () => {
    const transcriptSegment = createSegment();

    expect(transcriptSegment.getStart()).toEqual(0.1);
  });
});

describe('getEnd', () => {
  it('returns the end time of the segment', () => {
    const transcriptSegment = createSegment();

    expect(transcriptSegment.getEnd()).toEqual(1.77);
  });
});

describe('getText', () => {
  it('return the text of the segment', () => {
    const transcriptSegment = createSegment();

    expect(transcriptSegment.getText()).toEqual('hello this is a test');
  });
});
