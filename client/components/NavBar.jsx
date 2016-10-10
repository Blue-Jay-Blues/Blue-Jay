import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../actions/index.jsx';

class NavBar extends Component {
  
  handleSignout() {
    this.props.signOutUser();
  }

  renderAuthLinks() {
    if (this.props.authenticated) {
      return (
        <span>
          <li>
            <Link to='/dashboard'>Dashboard</Link>
          </li>
          <li>
            <a href='#' onClick={ (e) => { e.preventDefault(); this.handleSignout(); } }>Logout</a>
          </li>
        </span>
      )
    } else {
      return (
        <li>
          <a href='/google/login'>Login</a>
        </li>
      )
    }
  }

  render() {
    return (
      <nav>
        <div className='nav-wrapper blue darken-1'>
          <Link className='brand-logo center' to='/'>BlueJay</Link>
          <ul id="nav-mobile" className="right">
            <li>
              <Link to='/search'>Search</Link>
            </li>
            { this.renderAuthLinks() }
          </ul>       
        </div>
      </nav>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps, Actions)(NavBar);
