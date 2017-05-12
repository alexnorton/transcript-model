import Immutable from 'immutable';

import Speaker from '../Speaker';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';
import Transcript from '../Transcript';

class MediaTaggerAdapter {
  static parse(json) {
    // Create a map of Comma speaker IDs to numeric speaker IDs, e.g. S0: 0, S4: 1, ...
    const speakerIdMap = {};

    const speakers = new Immutable.List(
      json.commaSegments.segmentation.speakers.map((s, i) => {
        speakerIdMap[s['@id']] = i;

        // Comma doesn't give us speaker names so we just create a new "empty" Speaker
        return new Speaker({
          name: null,
        });
      })
    );

    const segments = new Immutable.List(
      json.commaSegments.segmentation.segments.map((s, i) =>
        new TranscriptSegment({
          speaker: speakerIdMap[s.speaker['@id']],
          words: new Immutable.List(
            json.commaSegments.segments.transcriptions[i].words.map(w =>
              new TranscriptWord({
                text: w.punct,
                start: w.start,
                end: w.end,
              })
            )
          ),
        })
      )
    );

    return new Transcript({ speakers, segments });
  }
}

export default MediaTaggerAdapter;
