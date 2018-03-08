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

export const getWords = text => getComponents(text, /[ ]+/igm);

export const transcriptFromGentle = (gentle) => {
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

  const speakers = [
    new Speaker(),
  ];

  const transcriptSegments = segments.map(segment => new TranscriptSegment({
    speaker: 0,
    words: segment.words.map(word => new TranscriptWord({
      start: word.startTime,
      end: word.endTime,
      text: word.text,
    })),
  }));

  return new Transcript({
    speakers,
    segments: transcriptSegments,
  });
};
