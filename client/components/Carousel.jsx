import React, { Component } from 'react';
import {Link} from 'react-router';

export default class Carousel extends Component {
	componentDidMount() {
		setInterval(function(){
		  $('.carousel').carousel('next');
		}, 5000);
		$('.carousel.carousel-slider').carousel({full_width: true});
	}
	render() {
		return (
			<div className="carousel carousel-slider center" data-indicators="true">
			  <div className="carousel-fixed-item center">
			  	<Link 
			  		to='login' 
			  		className='btn waves-effect color-component-foreground color-text'>
			  		Login/Signup
			  	</Link>
			  </div>
			  <div className="carousel-item" href="#one!">
			    <h2>Education</h2>
			    <p>Attend or teach a class</p>
			  </div>
			  <div className="carousel-item" href="#two!">
			    <h2>Entertainment</h2>
			    <p>Stream yourself to friends</p>
			  </div>
			  <div className="carousel-item" href="#three!">
			    <h2>Everyone</h2>
			    <p>Do you stream?</p>
			  </div>
			</div>
		)
	}
}
