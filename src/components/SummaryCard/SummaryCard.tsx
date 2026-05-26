import './SummaryCard.css';

const SummaryCard = ({
	title,
	value,
}: {
	title: string;
	value: string | number;
}) => {
	return (
		<article className='summary-card'>
			<h3>{title}</h3>
			<p>{value}</p>
		</article>
	);
};

export default SummaryCard;