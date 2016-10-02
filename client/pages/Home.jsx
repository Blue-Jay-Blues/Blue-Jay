import React, { Component } from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index.jsx';
import Carousel from '../components/Carousel.jsx';
import ChannelList from '../components/ChannelList.jsx';
import LiveNow from '../components/LiveNow.jsx';
import Categories from '../components/Categories.jsx';

class Home extends Component {
	componentDidMount() {
		$('.carousel').css('height', '225px');
	}
	render() {
	  return (
	  	<div>
				<Carousel />
		    <div className='container'>	    
		    	<div className='row'>
		    		<div className='col s12 m6'>
		    			<LiveNow />
				    </div>
				    <div className='col s12 m6'>		    
				    	<Categories />
				    </div>
		    	</div>
		    </div>
		</div>
	  )
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.auth.username
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(Actions, dispatch)
	};
}

export default connect(mapStateToProps, Actions)(Home);