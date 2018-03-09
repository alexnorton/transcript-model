import transcriptFromGentle, {
  getSegments,
  getWords,
  interpolateSegmentWordTimings,
  stripPunctuation,
  getWordDurationEquation,
  getEstimatedWordDuration,
} from '../GentleAdapter';

const gentle = require('./fixtures/gentle-response.json');

describe('getSegments', () => {
  it('should return segments correctly', () => {
    const text =
      "Yuan Meng has all the usual baby panda credentials: he's furry, cute, completely irresistible. But he isn't any old baby panda, he's French.\r\n\r\nThe first ever panda born in France making his public debut. Climbing, exploring, cuddling with mum, putting on a real show.\r\n\r\nI'm going to welcome the people who come, our visitors, our fans and I'm going to introduce them to our adorable ball of fur, who's especially cute right now. It's a big moment, it's very moving.\r\n\r\nAnd come they did. Hundreds of them, queuing up for a glimpse of this, quote, adorable ball of fur who has a certain Gallic charm. The cub was born in August last year, his tiny sibling died a few hours after birth. For some this was an emotional experience.\r\n\r\n\"Is it touching?\" this woman asked. \"It's a joy, it's a joy, it really makes us happy, yes. You've made me cry.\"\r\n\r\n\"We absolutely wanted to be here\", said this woman, \"to discover this ball of fur. It's a little ball of happiness, of peace. There's also a lot of symbolism behind the panda. So we're happy to be here.\"\r\n\r\nYuan Meng and his parents are eventually due to return to China in the next few years. Hopefully by then he may have developed a slightly better sense of balance.\r\n\r\nTim Allman, BBC News.";

    const segments = getSegments(text);

    expect(segments).toEqual([
      {
        startIndex: 0,
        endIndex: 140,
        text:
          "Yuan Meng has all the usual baby panda credentials: he's furry, cute, completely irresistible. But he isn't any old baby panda, he's French.",
      },
      {
        startIndex: 144,
        endIndex: 268,
        text:
          'The first ever panda born in France making his public debut. Climbing, exploring, cuddling with mum, putting on a real show.',
      },
      {
        startIndex: 272,
        endIndex: 467,
        text:
          "I'm going to welcome the people who come, our visitors, our fans and I'm going to introduce them to our adorable ball of fur, who's especially cute right now. It's a big moment, it's very moving.",
      },
      {
        startIndex: 471,
        endIndex: 729,
        text:
          'And come they did. Hundreds of them, queuing up for a glimpse of this, quote, adorable ball of fur who has a certain Gallic charm. The cub was born in August last year, his tiny sibling died a few hours after birth. For some this was an emotional experience.',
      },
      {
        startIndex: 733,
        endIndex: 845,
        text:
          '"Is it touching?" this woman asked. "It\'s a joy, it\'s a joy, it really makes us happy, yes. You\'ve made me cry."',
      },
      {
        startIndex: 849,
        endIndex: 1052,
        text:
          '"We absolutely wanted to be here", said this woman, "to discover this ball of fur. It\'s a little ball of happiness, of peace. There\'s also a lot of symbolism behind the panda. So we\'re happy to be here."',
      },
      {
        startIndex: 1056,
        endIndex: 1218,
        text:
          'Yuan Meng and his parents are eventually due to return to China in the next few years. Hopefully by then he may have developed a slightly better sense of balance.',
      },
      {
        startIndex: 1222,
        endIndex: 1243,
        text: 'Tim Allman, BBC News.',
      },
    ]);
  });
});

describe('getWords', () => {
  it('should return words correctly', () => {
    const text =
      "Yuan Meng has all the usual baby panda credentials: he's furry, cute, completely irresistible. But he isn't any old baby panda, he's French.";

    const segments = getWords(text);

    expect(segments).toEqual([
      { startIndex: 0, endIndex: 4, text: 'Yuan' },
      { startIndex: 5, endIndex: 9, text: 'Meng' },
      { startIndex: 10, endIndex: 13, text: 'has' },
      { startIndex: 14, endIndex: 17, text: 'all' },
      { startIndex: 18, endIndex: 21, text: 'the' },
      { startIndex: 22, endIndex: 27, text: 'usual' },
      { startIndex: 28, endIndex: 32, text: 'baby' },
      { startIndex: 33, endIndex: 38, text: 'panda' },
      { startIndex: 39, endIndex: 51, text: 'credentials:' },
      { startIndex: 52, endIndex: 56, text: "he's" },
      { startIndex: 57, endIndex: 63, text: 'furry,' },
      { startIndex: 64, endIndex: 69, text: 'cute,' },
      { startIndex: 70, endIndex: 80, text: 'completely' },
      { startIndex: 81, endIndex: 94, text: 'irresistible.' },
      { startIndex: 95, endIndex: 98, text: 'But' },
      { startIndex: 99, endIndex: 101, text: 'he' },
      { startIndex: 102, endIndex: 107, text: "isn't" },
      { startIndex: 108, endIndex: 111, text: 'any' },
      { startIndex: 112, endIndex: 115, text: 'old' },
      { startIndex: 116, endIndex: 120, text: 'baby' },
      { startIndex: 121, endIndex: 127, text: 'panda,' },
      { startIndex: 128, endIndex: 132, text: "he's" },
      { startIndex: 133, endIndex: 140, text: 'French.' },
    ]);
  });
});

describe('interpolateSegmentWordTimings', () => {
  it('passes through segments with complete timing information correctly', () => {
    const segmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
      { text: 'this', startTime: 79.02, endTime: 79.22999999999999 },
      { text: 'woman,', startTime: 79.23, endTime: 79.51 },
      { text: '"to', startTime: 79.76, endTime: 79.88000000000001 },
      { text: 'discover', startTime: 79.88, endTime: 80.35 },
      { text: 'this', startTime: 80.349999, endTime: 80.529999 },
      { text: 'ball', startTime: 80.559999, endTime: 80.879999 },
      { text: 'of', startTime: 80.88, endTime: 81 },
      { text: 'fur.', startTime: 81.02, endTime: 81.50999999999999 },
      { text: "It's", startTime: 81.969999, endTime: 82.139999 },
      { text: 'a', startTime: 82.139999, endTime: 82.199999 },
      { text: 'little', startTime: 82.2, endTime: 82.42 },
      { text: 'ball', startTime: 82.42, endTime: 82.7 },
      { text: 'of', startTime: 82.7, endTime: 82.82000000000001 },
      { text: 'happiness."', startTime: 82.82, endTime: 83.38999999999999 },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    expect(interpolatedSegmentWords).toEqual(segmentWords);
  });

  it('interpolates single missing words in the middle of segments correctly', () => {
    const segmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",' },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
      { text: 'this', startTime: 79.02, endTime: 79.22999999999999 },
      { text: 'woman,', startTime: 79.23, endTime: 79.51 },
      { text: '"to', startTime: 79.76, endTime: 79.88000000000001 },
      { text: 'discover', startTime: 79.88, endTime: 80.35 },
      { text: 'this', startTime: 80.349999, endTime: 80.529999 },
      { text: 'ball', startTime: 80.559999, endTime: 80.879999 },
      { text: 'of', startTime: 80.88, endTime: 81 },
      { text: 'fur.', startTime: 81.02, endTime: 81.50999999999999 },
      { text: "It's", startTime: 81.969999, endTime: 82.139999 },
      { text: 'a', startTime: 82.139999, endTime: 82.199999 },
      { text: 'little', startTime: 82.2, endTime: 82.42 },
      { text: 'ball', startTime: 82.42, endTime: 82.7 },
      { text: 'of', startTime: 82.7, endTime: 82.82000000000001 },
      { text: 'happiness."', startTime: 82.82, endTime: 83.38999999999999 },
    ];

    const expectedSegmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.6, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
      { text: 'this', startTime: 79.02, endTime: 79.22999999999999 },
      { text: 'woman,', startTime: 79.23, endTime: 79.51 },
      { text: '"to', startTime: 79.76, endTime: 79.88000000000001 },
      { text: 'discover', startTime: 79.88, endTime: 80.35 },
      { text: 'this', startTime: 80.349999, endTime: 80.529999 },
      { text: 'ball', startTime: 80.559999, endTime: 80.879999 },
      { text: 'of', startTime: 80.88, endTime: 81 },
      { text: 'fur.', startTime: 81.02, endTime: 81.50999999999999 },
      { text: "It's", startTime: 81.969999, endTime: 82.139999 },
      { text: 'a', startTime: 82.139999, endTime: 82.199999 },
      { text: 'little', startTime: 82.2, endTime: 82.42 },
      { text: 'ball', startTime: 82.42, endTime: 82.7 },
      { text: 'of', startTime: 82.7, endTime: 82.82000000000001 },
      { text: 'happiness."', startTime: 82.82, endTime: 83.38999999999999 },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    expect(interpolatedSegmentWords).toEqual(expectedSegmentWords);
  });

  it('interpolates multiple consecutive missing words in the middle of segments correctly', () => {
    const segmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",' },
      { text: 'said' },
      { text: 'this' },
      { text: 'woman,' },
      { text: '"to', startTime: 79.76, endTime: 79.88000000000001 },
      { text: 'discover', startTime: 79.88, endTime: 80.35 },
      { text: 'this', startTime: 80.349999, endTime: 80.529999 },
      { text: 'ball', startTime: 80.559999, endTime: 80.879999 },
      { text: 'of', startTime: 80.88, endTime: 81 },
      { text: 'fur.', startTime: 81.02, endTime: 81.50999999999999 },
      { text: "It's", startTime: 81.969999, endTime: 82.139999 },
      { text: 'a', startTime: 82.139999, endTime: 82.199999 },
      { text: 'little', startTime: 82.2, endTime: 82.42 },
      { text: 'ball', startTime: 82.42, endTime: 82.7 },
      { text: 'of', startTime: 82.7, endTime: 82.82000000000001 },
      { text: 'happiness."', startTime: 82.82, endTime: 83.38999999999999 },
    ];

    const expectedSegmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.6, endTime: 78.87619047619047 },
      { text: 'said', startTime: 78.87619047619047, endTime: 79.15238095238095 },
      { text: 'this', startTime: 79.15238095238095, endTime: 79.42857142857143 },
      { text: 'woman,', startTime: 79.42857142857143, endTime: 79.76 },
      { text: '"to', startTime: 79.76, endTime: 79.88000000000001 },
      { text: 'discover', startTime: 79.88, endTime: 80.35 },
      { text: 'this', startTime: 80.349999, endTime: 80.529999 },
      { text: 'ball', startTime: 80.559999, endTime: 80.879999 },
      { text: 'of', startTime: 80.88, endTime: 81 },
      { text: 'fur.', startTime: 81.02, endTime: 81.50999999999999 },
      { text: "It's", startTime: 81.969999, endTime: 82.139999 },
      { text: 'a', startTime: 82.139999, endTime: 82.199999 },
      { text: 'little', startTime: 82.2, endTime: 82.42 },
      { text: 'ball', startTime: 82.42, endTime: 82.7 },
      { text: 'of', startTime: 82.7, endTime: 82.82000000000001 },
      { text: 'happiness."', startTime: 82.82, endTime: 83.38999999999999 },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    expect(interpolatedSegmentWords).toEqual(expectedSegmentWords);
  });

  it('interpolates single missing words at the start of segments correctly', () => {
    const segmentWords = [
      { text: '"We' },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    const expectedSegmentWords = [
      { text: '"We', startTime: 77.1, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
    ];

    expect(interpolatedSegmentWords).toEqual(expectedSegmentWords);
  });

  it('interpolates multiple missing words at the start of segments correctly', () => {
    const segmentWords = [
      { text: '"We' },
      { text: 'absolutely' },
      { text: 'wanted' },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    const expectedSegmentWords = [
      { text: '"We', startTime: 77, endTime: 77.18 },
      { text: 'absolutely', startTime: 77.18, endTime: 77.84 },
      { text: 'wanted', startTime: 77.84, endTime: 78.26 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.02 },
    ];

    expect(interpolatedSegmentWords).toEqual(expectedSegmentWords);
  });

  it('interpolates single missing words at the end of segments correctly', () => {
    const segmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said' },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    const expectedSegmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.39, endTime: 78.6 },
      { text: 'here",', startTime: 78.65, endTime: 78.81 },
      { text: 'said', startTime: 78.81, endTime: 79.11 },
    ];

    expect(interpolatedSegmentWords).toEqual(expectedSegmentWords);
  });

  it('interpolates multiple missing words at the end of segments correctly', () => {
    const segmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be' },
      { text: 'here",' },
      { text: 'said' },
    ];

    const wordDurationEquation = { intercept: 0.06, gradient: 0.06 };

    const interpolatedSegmentWords = interpolateSegmentWordTimings(
      segmentWords,
      wordDurationEquation,
    );

    const expectedSegmentWords = [
      { text: '"We', startTime: 77.11, endTime: 77.28 },
      { text: 'absolutely', startTime: 77.28, endTime: 77.93 },
      { text: 'wanted', startTime: 77.93, endTime: 77.98 },
      { text: 'to', startTime: 78.26, endTime: 78.37 },
      { text: 'be', startTime: 78.37, endTime: 78.55000000000001 },
      { text: 'here",', startTime: 78.55000000000001, endTime: 78.85000000000001 },
      { text: 'said', startTime: 78.85000000000001, endTime: 79.15 },
    ];

    expect(interpolatedSegmentWords).toEqual(expectedSegmentWords);
  });

  it('handles segments with no timed words correctly', () => {
    const segmentWords = [
      { text: '"We' },
      { text: 'absolutely' },
      { text: 'wanted' },
      { text: 'to' },
      { text: 'be' },
      { text: 'here",' },
      { text: 'said' },
      { text: 'this' },
      { text: 'woman.' },
    ];

    const interpolatedSegmentWords = interpolateSegmentWordTimings(segmentWords);

    expect(interpolatedSegmentWords).toEqual(segmentWords);
  });
});

describe('stripPunctuation', () => {
  it('strips punctuation correctly', () => {
    expect(stripPunctuation('"isn\'t."')).toEqual('isnt');
    expect(stripPunctuation('hello!')).toEqual('hello');
    expect(stripPunctuation('G20')).toEqual('G20');
    expect(stripPunctuation('alex')).toEqual('alex');
  });
});

describe('getWordDurationEquation', () => {
  it('calculates word duration equation coefficients correctly', () => {
    const { intercept, gradient } = getWordDurationEquation(gentle.words);

    expect(intercept).toBe(0.05881439900368246);
    expect(gradient).toBe(0.059645153019175265);
  });
});

describe('getEstimatedWordDuration', () => {
  it('calculates estimated word duration correctly', () => {
    const equation = { intercept: 0.5, gradient: 0.5 };

    expect(getEstimatedWordDuration(1, equation)).toBe(1);
    expect(getEstimatedWordDuration(3, equation)).toBe(2);
    expect(getEstimatedWordDuration(6, equation)).toBe(3.5);
  });
});

describe('transcriptFromGentle', () => {
  it('should return a Transcript correctly', () => {
    const transcript = transcriptFromGentle(gentle);

    transcript.segments.forEach((segment) => {
      segment.words.forEach((word) => {
        expect(word.start).toBeDefined();
        expect(word.end).toBeDefined();
      });
    });
  });
});
