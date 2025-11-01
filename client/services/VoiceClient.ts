import { Room, RoomEvent, Track, RemoteTrackPublication, RemoteParticipant } from 'livekit-client';

export class VoiceClient {
  private room: Room | null = null;
  private onSpeakingCallback?: (userId: string, speaking: boolean) => void;
  private speakingIntervals = new Map<string, NodeJS.Timeout>();

  async connect(channelId: string, token: string) {
    if (this.room) {
      await this.leave();
    }

    const livekitUrl = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';
    this.room = new Room();

    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (track.kind === Track.Kind.Audio) {
        track.attach();
      }
    });

    this.room.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach();
    });

    this.room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      if (!this.room?.canPlaybackAudio) {
        this.room?.startAudio();
      }
    });

    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      this.setupSpeakingDetection(participant);
    });

    await this.room.connect(livekitUrl, token);
    
    this.room.remoteParticipants.forEach(p => this.setupSpeakingDetection(p));
    
    return this.room;
  }

  async leave() {
    if (this.room) {
      this.speakingIntervals.forEach(interval => clearInterval(interval));
      this.speakingIntervals.clear();
      await this.room.disconnect();
      this.room = null;
    }
  }

  async setMicMuted(muted: boolean) {
    if (this.room?.localParticipant) {
      await this.room.localParticipant.setMicrophoneEnabled(!muted);
    }
  }

  setDeafened(deafened: boolean) {
    if (!this.room) return;

    this.room.remoteParticipants.forEach(participant => {
      participant.audioTrackPublications.forEach((pub: RemoteTrackPublication) => {
        if (deafened) {
          pub.setSubscribed(false);
        } else {
          pub.setSubscribed(true);
        }
      });
    });
  }

  onSpeaking(callback: (userId: string, speaking: boolean) => void) {
    this.onSpeakingCallback = callback;
  }

  private setupSpeakingDetection(participant: RemoteParticipant) {
    const checkSpeaking = () => {
      const isSpeaking = participant.isSpeaking;
      this.onSpeakingCallback?.(participant.identity, isSpeaking);
    };

    const interval = setInterval(checkSpeaking, 250);
    this.speakingIntervals.set(participant.identity, interval);

    participant.on('isSpeakingChanged', checkSpeaking);
  }

  getRoom() {
    return this.room;
  }

  isConnected() {
    return this.room?.state === 'connected';
  }
}

export const voiceClient = new VoiceClient();
