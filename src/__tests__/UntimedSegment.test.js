import Immutable from 'immutable';

import UntimedSegment from '../UntimedSegment';
import Word from '../Word';

const createSegment = () => (
  new UntimedSegment({
    words: new Immutable.List([
      new Word({ text: 'hello' }),
      new Word({ text: 'this' }),
      new Word({ text: 'is' }),
      new Word({ text: 'a' }),
      new Word({ text: 'test' }),
    ]),
  })
);

describe('getText', () => {
  it('return the text of the segment', () => {
    const transcriptSegment = createSegment();

    expect(transcriptSegment.getText()).toEqual('hello this is a test');
  });
});
