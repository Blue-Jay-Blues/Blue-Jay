import React from 'react';

const SearchFilter = ({filterOptions}) => {

	return (
		<select 
			id={filterOptions.title}
			data-handler={filterOptions.handler}
			multiple
			defaultValue={filterOptions.selected}
		>
			<option value="" disabled>{filterOptions.title}</option>
			{ filterOptions.options.map((option) => {
				return (
					<option 
						key={option}
						value={option}
					>
					{option}
				</option>
				)
			}) }
		</select>
	)
}

export default SearchFilter;