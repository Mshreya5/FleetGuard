const SummaryCard = ({ title, value, detail, accent }) => {
  return (
    <article className={`summary-card ${accent}`}>
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{detail}</span>
    </article>
  );
};

export default SummaryCard;
