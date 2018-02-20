import KaldiAdapter from './KaldiAdapter';

class MediaTaggerAdapter {
  static parse(json) {
    const { commaSegments: { transcription, segmentation } } = json;

    return KaldiAdapter.parse(transcription, segmentation);
  }
}

export default MediaTaggerAdapter;
