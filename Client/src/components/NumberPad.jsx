function NumberPad({ numbers, onSelect }) {
  return (
    <div className="pad-section">
      <div className="pad-label">Numbers</div>
      <div className="number-pad">
        {numbers.map((num, index) => (
          <button
            key={index}
            className="number-tile"
            disabled={num.used}
            onClick={() => onSelect(index)}
          >
            {num.value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NumberPad;
