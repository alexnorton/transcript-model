import Immutable from 'immutable';

import Speaker from '../Speaker';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';
import Transcript from '../Transcript';

class MediaTaggerAdapter {
  static parse(json) {
    const speakerIdMap = {};
    const speakers = [];

    const segments = new Immutable.List(
      json.commaSegments.segmentation.segments
        .map((s, i) => Object.assign({}, s, { index: i }))
        .filter((s, i) => json.commaSegments.segments.transcriptions[i].words.length > 0)
        .map((s) => {
          if (!speakerIdMap[s.speaker['@id']]) {
            speakerIdMap[s.speaker['@id']] = speakers.push(new Speaker({ name: null })) - 1;
          }

          return new TranscriptSegment({
            speaker: speakerIdMap[s.speaker['@id']],
            words: new Immutable.List(
              json.commaSegments.segments.transcriptions[s.index].words.map(w =>
                new TranscriptWord({
                  text: w.punct,
                  start: w.start,
                  end: w.end,
                })
              )
            ),
          });
        })
    );

    return new Transcript({ speakers: new Immutable.List(speakers), segments });
  }
}

export default MediaTaggerAdapter;
