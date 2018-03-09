import Immutable from 'immutable';

import Speaker from '../Speaker';
import TranscriptSegment from '../TranscriptSegment';
import TranscriptWord from '../TranscriptWord';
import Transcript from '../Transcript';

const matchAll = (regex, text) => {
  const matches = [];
  let match = null;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    matches.push(match);
  }
  return matches;
};

export const getComponents = (text, delimeter) => {
  const matches = matchAll(delimeter, text);

  const componentRanges = [];

  matches.forEach((match, index) => {
    if (componentRanges.length === 0) {
      componentRanges.push({
        startIndex: 0,
        endIndex: match.index,
      });
    }

    componentRanges.push({
      startIndex: match.index + match[0].length,
      endIndex: matches[index + 1] ? matches[index + 1].index : text.length,
    });
  });

  const components = componentRanges.map(segment => ({
    ...segment,
    text: text.substring(segment.startIndex, segment.endIndex),
  }));

  return components;
};

export const getSegments = text => getComponents(text, /[\r\n]+/igm);

export const getWords = text => getComponents(text, /[ -]+/igm);

export const stripPunctuation = word => word.replace(/[^\w]/g, '');

export const getWordDurationEquation = (gentleWords) => {
  const sum = [0, 0, 0, 0, 0];

  gentleWords
    .filter(word => word.start !== undefined)
    .forEach((word) => {
      const wordLength = stripPunctuation(word.word).length;
      const wordDuration = word.end - word.start;
      sum[0] += wordLength;
      sum[1] += wordDuration;
      sum[2] += wordLength * wordLength;
      sum[3] += wordLength * wordDuration;
      sum[4] += wordDuration * wordDuration;
    });

  const run = ((gentleWords.length * sum[2]) - (sum[0] * sum[0]));
  const rise = ((gentleWords.length * sum[3]) - (sum[0] * sum[1]));
  const gradient = run === 0 ? 0 : rise / run;
  const intercept = (sum[1] / gentleWords.length) - ((gradient * sum[0]) / gentleWords.length);

  return { gradient, intercept };
};

export const getEstimatedWordDuration = (length, { gradient, intercept }) =>
  intercept + (length * gradient);

export const interpolateSegmentWordTimings = (segmentWords, wordDurationEquation) => {
  const interpolatedSegmentWords = [];

  for (let i = 0; i < segmentWords.length; i += 1) {
    if (!segmentWords[i].startTime) {
      const untimedWords = [];

      while (segmentWords[i] && !segmentWords[i].startTime) {
        untimedWords.push(segmentWords[i]);
        i += 1;
      }

      let interpolatedUntimedWords;

      if (interpolatedSegmentWords.length === 0 && !segmentWords[i]) {
        // segment has no timed words
        interpolatedUntimedWords = untimedWords;
      } else {
        const relativeEstimatedWordTimings = untimedWords.reduce(
          (words, word) => {
            const startTime = words.reduce((total, { duration }) => total + duration, 0);

            const duration = getEstimatedWordDuration(
              stripPunctuation(word.text).length,
              wordDurationEquation,
            );

            return [...words, { startTime, duration }];
          },
          [],
        );

        const totalEstimatedDuration = relativeEstimatedWordTimings.reduce(
          (total, { duration }) => total + duration,
          0,
        );

        if (interpolatedSegmentWords.length === 0 || !segmentWords[i]) {
          let untimedStart;

          if (interpolatedSegmentWords.length === 0) {
            // untimed words are at start of segment
            untimedStart = segmentWords[i].startTime - totalEstimatedDuration;
          } else if (!segmentWords[i]) {
            // untimed words are at end of segment
            untimedStart = interpolatedSegmentWords[interpolatedSegmentWords.length - 1].endTime;
          }

          interpolatedUntimedWords = untimedWords.map((word, index) => ({
            ...word,
            startTime: untimedStart
              + relativeEstimatedWordTimings[index].startTime,
            endTime: untimedStart
              + relativeEstimatedWordTimings[index].startTime
              + relativeEstimatedWordTimings[index].duration,
          }));
        } else {
          // untimed words are in the middle of segment
          const untimedStart = interpolatedSegmentWords[
            interpolatedSegmentWords.length - 1
          ].endTime;
          const untimedEnd = segmentWords[i].startTime;
          const untimedDuration = untimedEnd - untimedStart;

          const actualToEstimatedUntimedRatio = untimedDuration / totalEstimatedDuration;

          interpolatedUntimedWords = untimedWords.map((word, index) => ({
            ...word,
            startTime: untimedStart + (
              relativeEstimatedWordTimings[index].startTime * actualToEstimatedUntimedRatio
            ),
            endTime: untimedStart + (
              (
                relativeEstimatedWordTimings[index].startTime
                + relativeEstimatedWordTimings[index].duration
              ) * actualToEstimatedUntimedRatio
            ),
          }));
        }
      }

      interpolatedSegmentWords.push(...interpolatedUntimedWords);
    }

    if (segmentWords[i]) {
      interpolatedSegmentWords.push(segmentWords[i]);
    }
  }

  return interpolatedSegmentWords;
};

class GentleAdapter {
  static parse(gentle) {
    const segments = getSegments(gentle.transcript).map(segment =>
      ({ ...segment, words: getWords(segment.text) }));

    gentle.words.forEach((gentleWord) => {
      const segment = segments.find(s =>
        s.startIndex <= gentleWord.startOffset && s.endIndex > gentleWord.endOffset);

      const word = segment.words.find(w =>
        segment.startIndex + w.startIndex <= gentleWord.startOffset
        && segment.startIndex + w.endIndex >= gentleWord.endOffset);

      word.startTime = gentleWord.start;
      word.endTime = gentleWord.end;
    });

    const wordDurationEquation = getWordDurationEquation(gentle.words);

    const segmentsWithInterpolatedWords = segments.map(segment =>
      ({ ...segment, words: interpolateSegmentWordTimings(segment.words, wordDurationEquation) }));

    const speakers = new Immutable.List([
      new Speaker(),
    ]);

    const transcriptSegments = new Immutable.List(segmentsWithInterpolatedWords
      // discard any segments without any timings
      .filter(segment => segment.words[0].startTime)
      .map(segment => new TranscriptSegment({
        speaker: 0,
        words: new Immutable.List(segment.words.map(word => new TranscriptWord({
          start: word.startTime,
          end: word.endTime,
          text: word.text,
        }))),
      })));

    return new Transcript({
      speakers,
      segments: transcriptSegments,
    });
  }
}

export default GentleAdapter;
