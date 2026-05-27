import React from 'react';
import './FilterButton.css';

type DateRangePreset = {
	label: string;
	value: string;
};
type FilterButtonProps = {
	filter: DateRangePreset;
	isActive: boolean;
	onSelect: () => void;
};

const FilterButton = ({ filter, isActive, onSelect }: FilterButtonProps) => {
	return (
		<button
			className={`filter-button ${isActive ? 'filter-button--active' : ''}`}
			onClick={onSelect}
			aria-pressed={isActive}
			aria-label={`Filter by ${filter.label}`}
		>
			{filter.label}
		</button>
	);
};

export default FilterButton;