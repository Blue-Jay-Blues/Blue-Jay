import React from 'react';
import Modal from 'react-modal';
import { SearchResultsModalStyling } from '../styles.js';

const UserStreamsModal = ({selectedStream, modalIsOpen, onRequestClose, editStream}) => {
	if (!modalIsOpen) {
		return <div></div>;
	}

	return (
		<Modal
		  isOpen={ modalIsOpen }
		  onRequestClose={ onRequestClose }
		  style={UserStreamsModalStyling}
		>
			<div>
				<form onSubmit={ editStream }>
					<input type='text' value={selectedStream.title} name='title' />
					<input type='text' value={selectedStream.description} name='description' />
					<input type='submit' value='Submit' className='btn' />
				</form>
			</div>
			<a className='btn blue' onClick={ onRequestClose }>Cancel</a>
		</Modal>
	)
}

export default UserStreamsModal;