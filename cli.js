/* eslint-disable no-console */

const { Transcript } = require('./lib/bundle');
const fs = require('fs');

const [mode, ...inputs] = process.argv.slice(2);

if (mode === '--kaldi' && inputs[0] && inputs[1]) {
  let transcriptFile;
  let segmentsFile;

  try {
    transcriptFile = fs.readFileSync(inputs[0]);
    segmentsFile = fs.readFileSync(inputs[1]);
  } catch (error) {
    console.error('Error reading file:\n', error.message);
    process.exit(1);
  }

  let transcriptJSON;
  let segmentsJSON;

  try {
    transcriptJSON = JSON.parse(transcriptFile);
    segmentsJSON = JSON.parse(segmentsFile);
  } catch (error) {
    console.error('Error parsing JSON:\n', error.message);
    process.exit(1);
  }

  let transcript;

  try {
    transcript = Transcript.fromKaldi(transcriptJSON, segmentsJSON);
  } catch (error) {
    console.error('Error creating transcript:\n', error.message);
  }

  console.log(JSON.stringify(transcript.toJSON(), null, 2));
} else {
  console.log('Usage: --kaldi path/to/transcript.json path/to/segments.json');
}
