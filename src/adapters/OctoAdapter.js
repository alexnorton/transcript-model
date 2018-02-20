import KaldiAdapter from './KaldiAdapter';

class OctoAdapter {
  static parse(json) {
    const { transcription, segmentation } = json;

    return KaldiAdapter.parse(transcription, segmentation);
  }
}

export default OctoAdapter;
