import { useDraggable } from "@dnd-kit/core";

function DraggableNumber({ num, index, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `number-${index}`,
    data: { type: "number", index, value: num.value },
    disabled: num.used,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={`number-tile ${isDragging ? "number-tile--dragging" : ""}`}
      disabled={num.used}
      onClick={() => onSelect(index)}
      {...listeners}
      {...attributes}
    >
      {num.value}
    </button>
  );
}

function NumberPad({ numbers, onSelect }) {
  return (
    <div className="pad-section">
      <div className="pad-label">Numbers</div>
      <div className="number-pad">
        {numbers.map((num, index) => (
          <DraggableNumber
            key={index}
            num={num}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default NumberPad;
