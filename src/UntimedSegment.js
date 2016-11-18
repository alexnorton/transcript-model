import Immutable from 'immutable';

const UntimedSegmentRecord = new Immutable.Record({
  speaker: null,
  words: new Immutable.List(),
});

class UntimedSegment extends UntimedSegmentRecord {
  getText() {
    return this.words.map(w => w.get('text')).join(' ');
  }
}

export default UntimedSegment;
