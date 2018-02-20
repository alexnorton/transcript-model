import Immutable from 'immutable';

import Speaker from '../Speaker';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';
import Transcript from '../Transcript';

class KaldiAdapter {
  static parse(transcriptJson, segmentsJson) {
    const speakerIdMap = {};
    const speakers = [];

    const segments = new Immutable.List(segmentsJson.segments.reduce((list, segment) => {
      const words = transcriptJson.words.filter(({ start }) =>
        start >= segment.start && start <= segment.start + segment.duration);

      if (words.length === 0) {
        return list;
      }

      if (!speakerIdMap[segment.speaker['@id']]) {
        speakerIdMap[segment.speaker['@id']] = speakers.push(new Speaker({ name: null })) - 1;
      }

      return [
        ...list,
        new TranscriptSegment({
          speaker: speakerIdMap[segment.speaker['@id']],
          words: new Immutable.List(words.map(w =>
            new TranscriptWord({
              text: w.punct,
              start: w.start,
              end: w.end,
            }))),
        }),
      ];
    }, []));

    return new Transcript({ speakers: new Immutable.List(speakers), segments });
  }
}

export default KaldiAdapter;
