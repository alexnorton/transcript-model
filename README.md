# transcript-model

[![Build Status](https://travis-ci.org/bbc/transcript-model.svg?branch=master)](https://travis-ci.org/bbc/transcript-model) [![npm](https://img.shields.io/npm/v/transcript-model.svg)](https://www.npmjs.com/package/transcript-model)

JSON schema and JavaScript model classes for dealing with time-aligned transcripts of speech.

## Usage

Install in your project

```
$ npm install --save transcript-model
```

Then

```js
const { Transcript } = require("transcript-model");

// Define some transcript JSON
const json = {
  speakers: [
    { name: "Alice" },
    { name: "Bob" }
  ],
  segments: [
    {
      speaker: 0,
      words: [
        { start: 0.05, end: 0.64, text: "Hello" },
        { start: 0.70, end: 1.10, text: "Bob!" }
      ]
    },
    {
      speaker: 1,
      words: [
        { start: 1.53, end: 1.88, text: "Hi" },
        { start: 1.92, end: 2.33, text: "Alice." }
      ]
    }
  ]
}

// Instantiate a Transcript object
const transcript = Transcript.fromJSON(json);

// Do something with it
console.log(
    transcript.segments.map(segment => (
        transcript.speakers.get(segment.speaker).name
            + ': '
            + segment.words.map(word => word.text).join(' ')
    ))
    .join('\n')
);

// Serialise as JSON
console.log(transcript.toJSON());
```

Try it out on [RunKit](https://runkit.com/alexnorton/runkit-npm-transcript-model).

For more examples of creating and manipulating Transcript objects check out the source code.

## CLI

A basic command line interface has been implemented to support conversion of BBC Kaldi output to the transcript JSON format.

### Install

```
$ npm install -g transcript-model
```

### Usage

To write to STDOUT:

```bash
$ transcript-model --kaldi path/to/transcript.json path/to/segments.json
```

To write to a file:

```
$ transcript-model --kaldi path/to/transcript.json path/to/segments.json > output.json
```
