import Immutable from 'immutable';

import Speaker from '../Speaker';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';
import Transcript from '../Transcript';

class KaldiAdapter {
  static fromKaldi(transcriptJson, segmentsJson) {
    // Create a map of Kaldi speaker IDs to numeric speaker IDs, e.g. S0: 0, S4: 1, ...
    const speakerIdMap = {};

    const speakers = new Immutable.List(
      segmentsJson.speakers.map((s, i) => {
        speakerIdMap[s['@id']] = i;

        // Comma doesn't give us speaker names so we just create a new "empty" Speaker
        return new Speaker({
          name: null,
        });
      })
    );

    const segments = new Immutable.List(
      segmentsJson.segments.map(s =>
        new TranscriptSegment({
          speaker: speakerIdMap[s.speaker['@id']],
          words: new Immutable.List(
            transcriptJson.words
              .filter(({ start, end }) =>
                start >= s.start && end <= s.start + s.duration
              )
              .map(w =>
                new TranscriptWord({
                  text: w.word,
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

export default KaldiAdapter;
