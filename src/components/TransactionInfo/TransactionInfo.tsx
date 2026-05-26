import React from 'react';
import './TransactionInfo.css';

type TransactionInfoProps = {
	merchant: string;
	description: string;
	date: string;
};

const TransactionInfo = ({
	merchant,
	description,
	date,
}: TransactionInfoProps) => {
	return (
		<div className='transaction-meta'>
			<div className='transaction-merchant'>{merchant}</div>
			<div className='transaction-description'>{description}</div>
			<div className='transaction-date'>
				{new Date(date).toLocaleDateString(undefined, {
					month: 'short',
					day: 'numeric',
					year: '2-digit',
				})}
			</div>
		</div>
	);
};

export default TransactionInfo;
