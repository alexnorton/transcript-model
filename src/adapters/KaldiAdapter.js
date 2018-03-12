import Immutable from 'immutable';

import Speaker from '../Speaker';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';
import Transcript from '../Transcript';

class KaldiAdapter {
  static parse(transcriptJson, segmentsJson) {
    const speakerIdMap = {};
    const speakers = [];

    const words = transcriptJson.words.reduce((currentWords, word) => {
      let segmentIndex = segmentsJson.segments.findIndex(segment =>
        word.start >= segment.start && word.end < segment.start + segment.duration);

      if (segmentIndex === -1) {
        if (currentWords[currentWords.length - 1]) {
          ({ segmentIndex } = currentWords[currentWords.length - 1]);
        } else {
          segmentIndex = 0;
        }
      }

      return [...currentWords, { ...word, segmentIndex }];
    }, []);

    const segments = new Immutable.List(segmentsJson.segments.reduce(
      (list, segment, segmentIndex) => {
        const segmentWords = words.filter(word => word.segmentIndex === segmentIndex);

        if (segmentWords.length === 0) {
          return list;
        }

        if (!speakerIdMap[segment.speaker['@id']]) {
          speakerIdMap[segment.speaker['@id']] = speakers.push(new Speaker({ name: null })) - 1;
        }

        return [
          ...list,
          new TranscriptSegment({
            speaker: speakerIdMap[segment.speaker['@id']],
            words: new Immutable.List(segmentWords.map(w =>
              new TranscriptWord({
                text: w.punct,
                start: w.start,
                end: w.end,
              }))),
          }),
        ];
      },
      [],
    ));

    return new Transcript({ speakers: new Immutable.List(speakers), segments });
  }
}

export default KaldiAdapter;
