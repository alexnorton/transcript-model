# transcript-model

JSON schema and JavaScript model classes for dealing with time-aligned transcripts of speech.

## CLI

A basic command line interface has been implemented to support conversion of Kaldi output to the transcript JSON format.

### Usage

```bash
# To write to STDOUT
node cli --kaldi path/to/transcript.json path/to/segments.json

# To write to a file
node cli --kaldi path/to/transcript.json path/to/segments.json > output.json
```
