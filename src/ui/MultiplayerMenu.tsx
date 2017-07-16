import { Component, h } from 'preact';

import ConnectionManager from '../ConnectionManager';
import './MultiplayerMenu.css';

interface Props {
  onConnectionStarted(cm: ConnectionManager);
}

export default class MultiplayerMenu extends Component<Props, object> {
  connectionManager: ConnectionManager;
  textareaElement: HTMLTextAreaElement;

  constructor(props) {
    super(props);
    this.connectionManager = new ConnectionManager();
    this.connectionManager.events.addListener('localDescriptionChange', () => {
      this.changeTextareaValue(this.connectionManager.localDescription);
    });
    this.connectionManager.events.addListener('dataChannelOpen', () => {
      this.props.onConnectionStarted(this.connectionManager);
    });
  }

  changeTextareaValue(value: any) {
    this.textareaElement.focus();
    this.textareaElement.value = JSON.stringify(value);
    this.textareaElement.select();
  }

  async createOffer() {
    await this.connectionManager.createOffer();
  }

  async receiveOfferAndCreateAnswer() {
    await this.setRemoteDescription();
    await this.connectionManager.createAnswer();
  }

  async setRemoteDescription() {
    const sd = JSON.parse(this.textareaElement.value);
    await this.connectionManager.setRemoteDescription(sd);
  }

  render() {
    return (
      <div class="MultiplayerMenu">
        <textarea
          ref={(el) => { this.textareaElement = el as HTMLTextAreaElement; }}
        ></textarea>
        <div>
          <button
            type="button"
            onClick={() => {this.createOffer();}}
          >Create offer</button>
          <button
            type="button"
            onClick={() => {this.receiveOfferAndCreateAnswer();}}
          >Receive offer and create answer</button>
          <button
            type="button"
            onClick={() => {this.setRemoteDescription();}}
          >Receive answer</button>
        </div>
      </div>
    );
  }
}
