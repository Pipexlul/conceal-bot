import {
  AudioPlayer,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  PlayerSubscription,
  VoiceConnection,
} from "@discordjs/voice";

import envConfig from "../../config/env";
const { isDebug } = envConfig;

class VoiceState {
  private _audioPlayer: AudioPlayer;
  private _isBusy: boolean;
  private _voiceSubscription?: PlayerSubscription;

  constructor() {
    this._audioPlayer = new AudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    this._audioPlayer.on("stateChange", (oldState, newState) => {
      if (isDebug) {
        console.log(
          `Audio player state change: ${oldState.status} -> ${newState.status}`
        );
      }

      if (newState.status === AudioPlayerStatus.Idle) {
        this._isBusy = false;
      }
    });

    this._isBusy = false;

    // NOTE: FG: Not necessary but putting them here for clarity
    this._voiceSubscription = undefined;
  }

  get root() {
    return this;
  }

  get audioPlayer() {
    return this._audioPlayer;
  }

  get busy() {
    return this._isBusy;
  }

  setBusy(val: boolean) {
    this._isBusy = val;
  }

  subscribeToConnection(voiceConnection: VoiceConnection) {
    if (this._voiceSubscription) {
      this._voiceSubscription.unsubscribe();
    }

    this._voiceSubscription = voiceConnection.subscribe(this._audioPlayer);
  }
}

const stateSingleton = new VoiceState();

export default stateSingleton;
