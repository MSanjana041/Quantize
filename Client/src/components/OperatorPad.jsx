const operators = ["+", "-", "*", "/"];

function OperatorPad({ onSelect }) {
  return (
    <div className="pad-section">
      <div className="pad-label">Operators</div>
      <div className="operator-pad">
        {operators.map((op, index) => (
          <button
            key={index}
            className="operator-tile"
            onClick={() => onSelect(op)}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OperatorPad;
