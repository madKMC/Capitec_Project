import './SummaryCard.css';

const SummaryCard = ({
  title,
  value,
  change,
}: {
  title: string;
  value: string | number;
  change?: number;
}) => {
  const isPositive = change !== undefined && change >= 0;
  const colour = isPositive ? 'var(--success)' : 'var(--danger)';

  return (
    <article className='summary-card'>
      <h3>{title}</h3>
      <p>{value}</p>
      {change !== undefined && (
        <span
          className='summary-card-change'
          style={{ color: colour }}
          aria-label={`${Math.abs(change)}% ${isPositive ? 'increase' : 'decrease'} from previous period`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% vs previous
        </span>
      )}
    </article>
  );
};

export default SummaryCard;