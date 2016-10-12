import React from 'react';
import urlUtil from '../utils/urlHelper.jsx';

class Whiteboard extends React.Component {
  componentDidMount(props) {
    this.canvas = new fabric.Canvas('whiteboard', {isDrawingMode: true});

    //Connect to the server:
    this.socket = props.socket;
    // this.socket = io.connect();

    //Send whiteboard changes to the server:
    this.canvas.on('path:created', () => this.sendWhiteboard());

    //Recieve whiteboard changes from the server:
    this.socket.on('dataFromServer', (data) => this.recieveWhiteboard(data));
  }

  sendWhiteboard() {
    let room = urlUtil.deslugify(window.location.pathname.slice(1));
    // let room = urlUtil.deslugify(window.location.pathname.slice(1).split('/')[1]);
    this.socket.emit('dataFromClient', {canvas: JSON.stringify(this.canvas), room: room});
  }

  recieveWhiteboard(data) {
    console.log('Recieved from whiteboard');
    // this.canvas.loadFromJSON(JSON.parse(data), this.canvas.renderAll.bind(this.canvas));
    this.canvas.loadFromJSON(JSON.parse(data), this.canvas.renderAll.bind(this.canvas));
  }

  render() {
    return (
      <div className="whiteboard">
        <canvas id="whiteboard"></canvas>
      </div>
    );
  }
}

export default Whiteboard;