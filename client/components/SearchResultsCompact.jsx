import React from 'react';
import { Button, Modal } from 'react-materialize'
import checkLength from '../utils/lengthHelper.jsx';
import isSubscribed from '../utils/isSubscribed.jsx';
import style from '../styles.js'

const SearchResultsCompact = ({searchResults, openModal, addSubscription, selectedStream, removeSubscription, modalIsOpen, onRequestClose, subscriptions}) => {
	
	const isSubscribed = (stream) => {
	  if (subscriptions.includes(stream.title)) {
	    return (
	      <i onClick={ () => { removeSubscription(stream) } } 
	         className='material-icons circle color1 lighten-3 color1-text text-darken-3'>
	         done
	      </i>
	    );
	  }
	  return (
	    <i onClick={ () => { addSubscription(stream) } } 
	       className='material-icons circle color1-text text-lighten-5'>
	       done
	    </i>
	  );
	}

	const isOnline = (stream) => {
		if (stream.online === 'true') {
			return <i className="material-icons color1-text text-lighten-5">volume_up</i>;
		} else {
			return <i className="material-icons color1-text text-lighten-5">volume_off</i>;
		}
	}

	return (
		<div>
			{ 
				searchResults.map((stream) => {
					return (
						<ul key={stream.id} 
							className="collection with-header col s12 m5 transparent componentGradient"
							style={{ marginRight: '5em' }}
							>
						  <li className="collection-header transparent">
						  	<h5 className="color1-text text-lighten-5">{ checkLength(stream.title, 23) }</h5>
						  </li>
						  <li className="collection-item transparent">
				  	  	<table className='centered'>
				  	  		<tbody>
				  	  			<tr>
				  						<td>{ isSubscribed(stream) }</td>
				  						<td>
				  							<Modal
				  							  header={ checkLength(stream.title, 23) }
				  							  trigger={
				  							    <Button onClick={ () => { openModal(stream); } } waves='light'>Details</Button>
				  							  }>
				  							  <div>
				  									<p>Description: { checkLength(stream.description, 60)  }</p>
				  									<p>Subscriber count: { stream.subscriberCount }</p>
				  									<p>Online: { stream.online }</p>
				  									<p>Creator: { checkLength(stream.creatorName, 60) }</p>
				  							  </div>
				  							</Modal>
				  						</td>
				  						<td>{ isOnline(stream) }</td>
				  						<td><i className="material-icons color1-text text-lighten-5">supervisor_account</i><br/>{ stream.subscriberCount }</td>
				  	  			</tr>
				  	  		</tbody>
				  	  	</table>
						  </li>
						</ul>
					);
				}) 
			}
		</div>
	)
}

export default SearchResultsCompact;
