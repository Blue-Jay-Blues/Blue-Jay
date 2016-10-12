import React, { Component } from 'react';
import style from '../styles.js';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index.jsx';
import ChatContainer from './ChatContainer.jsx';
import EZRTC from '../lib/webRTC';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import urlUtil from '../utils/urlHelper.jsx';

class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: props.socket,
      user: localStorage.firstName + ' ' + localStorage.lastName[0],
      roomId: urlUtil.deslugify(window.location.pathname.slice(1)),
      room: urlUtil.deslugify(window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1)),
      host: window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/')),
    };

    var context = this;

    this.state.socket.on('failure', function () {

      console.log(arguments);

      context.state.socket.disconnect();

      if (window.checkForHelp) {
        clearInterval(window.checkForHelp);

        if (parentStream) {
          parentStream.getTracks().forEach(function (track) {
            track.stop();
          });
        }
      }

      setTimeout(function () {
        browserHistory.push('/nostream');
      }, 1000);

    });
  }

  componentWillMount() {
    localStorage.username = this.props.username || localStorage.username;

    EZRTC(this.state.roomId, localStorage.username, this.state.socket);
  }

  componentWillUnmount() {
    this.state.socket.disconnect();

    if (window.checkForHelp) {
      clearInterval(window.checkForHelp);

      if (parentStream) {
        parentStream.getTracks().forEach(function (track) {
          track.stop();
        });
      }

      if (ownStream) {
        ownStream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          
          <div className='col s12 m9'>
            <div className='row' id='putVidsHere'>
              <video
                controls
                className='col s9 m12' 
                id='remoteVideo'
                poster="http://www.rockymountainrep.com/wp-content/themes/rockymountainrep/library/images/youtube-default.png" 
                autoPlay>
              </video>
              <video
                className='col s3' 
                id='localVideo'
                poster="http://www.rockymountainrep.com/wp-content/themes/rockymountainrep/library/images/youtube-default.png"
                autoPlay>
              </video>
            </div>  
          </div>
     
          <div className='col s12 m3' >
              <ChatContainer 
                roomId={ this.state.roomId }
                room={ this.state.room }
                user={ this.state.user }
                socket={ this.state.socket } 
              />
          </div>

        </div>
      </div>
    );
  }
};


const mapStateToProps = (state) => {
  return {
    username: state.auth.username
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, Actions)(Video);
