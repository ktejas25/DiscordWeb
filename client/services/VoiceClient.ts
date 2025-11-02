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
        const audioElement = track.attach();
        audioElement.play().catch(e => console.warn('Audio autoplay failed:', e));
      }
    });

    this.room.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach();
    });

    this.room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      if (!this.room?.canPlaybackAudio) {
        this.room?.startAudio().catch(e => console.warn('Failed to start audio:', e));
      }
    });

    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      this.setupSpeakingDetection(participant);
    });

    await this.room.connect(livekitUrl, token);
    await this.room.localParticipant.setMicrophoneEnabled(true);
    
    this.room.remoteParticipants.forEach(p => this.setupSpeakingDetection(p));
    this.setupLocalSpeakingDetection();
    
    if (!this.room.canPlaybackAudio) {
      await this.room.startAudio().catch(e => console.warn('Failed to start audio:', e));
    }
    
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

  private setupLocalSpeakingDetection() {
    if (!this.room?.localParticipant) return;

    const checkSpeaking = () => {
      const isSpeaking = this.room!.localParticipant.isSpeaking;
      this.onSpeakingCallback?.(this.room!.localParticipant.identity, isSpeaking);
    };

    const interval = setInterval(checkSpeaking, 250);
    this.speakingIntervals.set(this.room.localParticipant.identity, interval);

    this.room.localParticipant.on('isSpeakingChanged', checkSpeaking);
  }

  getRoom() {
    return this.room;
  }

  isConnected() {
    return this.room?.state === 'connected';
  }
}

export const voiceClient = new VoiceClient();
