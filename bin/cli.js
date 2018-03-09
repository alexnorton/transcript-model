#!/usr/bin/env node

/* eslint-disable no-console */

const { Transcript } = require('../lib');
const fs = require('fs');

const [mode, ...inputs] = process.argv.slice(2);

if (mode === '--kaldi' && inputs.length === 2) {
  const transcriptFile = fs.readFileSync(inputs[0]);
  const segmentsFile = fs.readFileSync(inputs[1]);

  const transcriptJSON = JSON.parse(transcriptFile);
  const segmentsJSON = JSON.parse(segmentsFile);

  const transcript = Transcript.fromKaldi(transcriptJSON, segmentsJSON);

  console.log(JSON.stringify(transcript.toJson(), null, 2));
} else if (mode === '--octo' && inputs.length === 1) {
  const inputFile = fs.readFileSync(inputs[0]);

  const inputJson = JSON.parse(inputFile);

  const transcript = Transcript.fromOcto(inputJson);

  console.log(JSON.stringify(transcript.toJson(), null, 2));
} else if (mode === '--gentle' && inputs.length === 1) {
  const inputFile = fs.readFileSync(inputs[0]);

  const inputJson = JSON.parse(inputFile);

  const transcript = Transcript.fromGentle(inputJson);

  console.log(JSON.stringify(transcript.toJson(), null, 2));
} else {
  console.log('Usage:');
  console.log('  transcript-model --kaldi path/to/transcript.json path/to/segments.json');
  console.log('  transcript-model --octo path/to/input.json');
  console.log('  transcript-model --gentle path/to/input.json');
}
