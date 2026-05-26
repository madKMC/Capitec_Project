import React from 'react';
import './CardTitle.css';

type CardTitleProps = {
	title: string;
	subtitle?: string;
};

const CardTitle = ({ title, subtitle }: CardTitleProps) => {
	return (
		<div className='chart-header' aria-hidden='true'>
			<h2 className='chart-title' id='trend-chart-title'>
				{title}
			</h2>

			{subtitle && <p className='chart-subtitle'>{subtitle}</p>}
		</div>
	);
};

export default CardTitle;
