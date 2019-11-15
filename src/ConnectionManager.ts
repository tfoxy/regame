import { EventEmitter2 } from 'eventemitter2';

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default class ConnectionManager {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
  events: EventEmitter2;
  teamIndex: number;

  constructor() {
    this.pc = new RTCPeerConnection(configuration);
    this.events = new EventEmitter2();
    this.teamIndex = NaN;
    this.pc.ondatachannel = (event: RTCDataChannelEvent) => {
      this.dc = event.channel;
      this.dcInit();
    };
    this.pc.addEventListener('icecandidate', (event) => {
      this.events.emit('localDescriptionChange', event);
    });
  }

  get localTeamIndex() {
    return this.teamIndex;
    // const state = this.pc.iceConnectionState;
    // if (state === 'completed') return 0;
    // if (state === 'connected') return 1;
    // return NaN;
  }

  get remoteTeamIndex() {
    if (this.teamIndex === 0) return 1;
    if (this.teamIndex === 1) return 0;
    return NaN;
    // const state = this.pc.iceConnectionState;
    // if (state === 'completed') return 1;
    // if (state === 'connected') return 0;
    // return NaN;
  }

  get localDescription() {
    return this.pc.localDescription;
  }

  async createOffer() {
    this.teamIndex = 0;
    this.dc = this.pc.createDataChannel('gameData');
    this.dcInit();
    const sd = await this.pc.createOffer();
    await this.pc.setLocalDescription(sd);
    return sd;
  }

  async setRemoteDescription(sd: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(sd);
  }

  async createAnswer() {
    this.teamIndex = 1;
    const sd = await this.pc.createAnswer();
    await this.pc.setLocalDescription(sd);
    return sd;
  }

  sendData(data: string) {
    this.dc.send(data);
  }

  private dcInit() {
    this.dc.onopen = (event) => {
      this.events.emit('dataChannelOpen', event);
    };
    this.dc.onmessage = (event) => {
      this.events.emit('dataChannelMessage', event);
    };
  }
}
