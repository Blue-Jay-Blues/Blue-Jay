import React, { Component } from 'react';
import Video from '../components/Video.jsx';
import InfoBox from '../components/InfoBox.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import Whiteboard from '../components/Whiteboard.jsx';
import {Link} from 'react-router';
import io from 'socket.io-client';

const data = {
  title: 'cat',
  uploader: 'person',
  description: 'cat video',
  tags: 'tag',
  category: 'Art'
};

export default class StreamRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io.connect(),
    };
  }

  render() {
    return (
      <div className='stream'>
        <Video socket={ this.state.socket } />
        <InfoBox stuff={data}/>
        <Whiteboard socket={ this.state.socket } />
      </div>
    );
  }
}