import { getSegments, getWords, transcriptFromGentle } from '../GentleAdapter';

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
  it('should return segments correctly', () => {
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

describe('transcriptFromGentle', () => {
  const transcript = transcriptFromGentle(gentle);

  transcript.segments.forEach((segment) => {
    segment.words.forEach((word) => {
      expect(word.start).toBeDefined();
      expect(word.end).toBeDefined();
    });
  });
});
