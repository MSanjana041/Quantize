function ExpressionDisplay({ expression }) {
  return (
    <div className="expression-card">
      {expression.length === 0 ? (
        <span className="expression-placeholder">Tap numbers &amp; operators</span>
      ) : (
        <span className="expression-text">{expression.join("  ")}</span>
      )}
    </div>
  );
}

export default ExpressionDisplay;
