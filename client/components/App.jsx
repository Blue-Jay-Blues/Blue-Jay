import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, browserHistory, Link } from 'react-router';
import Video from './Video.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import NavBar from './NavBar.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NavBar className="color-component-background"/>
        { this.props.children } 
      </div>
    );
  }
}



