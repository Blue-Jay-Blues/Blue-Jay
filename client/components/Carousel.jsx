import React, { Component } from 'react';
import {Link} from 'react-router';

export default class Carousel extends Component {
	componentDidMount() {
		setInterval(function(){
			let body = $('body');
			if (body.hasClass('background1')) {

			} else if (body.hasClass('background2')) {

			} else if (body.hasClass('background3')) {

			}

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
			  <div className="carousel-item carousel1" href="#one!">
			    <h2>Education</h2>
			    <p>Attend or teach a class</p>
			  </div>
			  <div className="carousel-item carousel2" href="#two!">
			    <h2>Entertainment</h2>
			    <p>Stream yourself to friends</p>
			  </div>
			  <div className="carousel-item carousel3" href="#three!">
			    <h2>Everyone</h2>
			    <p>Do you stream?</p>
			  </div>
			</div>
		)
	}
}
