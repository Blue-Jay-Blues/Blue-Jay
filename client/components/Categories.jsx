import React from 'react';
import {Link} from 'react-router';

export default () => {
	return (
		<div>
			<ul className="collection with-header">
				<li className="collection-header color-component-foreground">
				<h5 className='align-center'>Categories</h5>
				</li>
			</ul>
			<ul className="collapsible color-component-foreground" data-collapsible="accordion">
				<li>
					<div className="collapsible-header"><i className="material-icons">place</i>Astronomy</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
				<li>
					<div className="collapsible-header"><i className="material-icons">whatshot</i>Games</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
				<li>
					<div className="collapsible-header"><i className="material-icons">filter_drama</i>Guitar</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
				<li>
					<div className="collapsible-header"><i className="material-icons">place</i>History</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
				<li>
					<div className="collapsible-header"><i className="material-icons">whatshot</i>Politics</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
				<li>
					<div className="collapsible-header"><i className="material-icons">filter_drama</i>Space</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
				<li>
					<div className="collapsible-header"><i className="material-icons">place</i>XYZ</div>
					<div className="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
				</li>
			</ul>
		</div>
	)
}