import Immutable from 'immutable';

const TranscriptSegmentRecord = new Immutable.Record({
  speaker: null,
  words: new Immutable.List(),
});

class TranscriptSegment extends TranscriptSegmentRecord {
  getStart() {
    return this.words.first().get('start');
  }

  getEnd() {
    return this.words.last().get('end');
  }

  getText() {
    return this.words.map(w => w.get('text')).join(' ');
  }
}

export default TranscriptSegment;
