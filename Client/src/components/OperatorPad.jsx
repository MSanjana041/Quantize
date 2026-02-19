import { useDraggable } from "@dnd-kit/core";

const operators = ["+", "-", "*", "/"];

function DraggableOperator({ op, index, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `operator-${op}`,
    data: { type: "operator", value: op },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={`operator-tile ${isDragging ? "operator-tile--dragging" : ""}`}
      onClick={() => onSelect(op)}
      {...listeners}
      {...attributes}
    >
      {op}
    </button>
  );
}

function OperatorPad({ onSelect }) {
  return (
    <div className="pad-section">
      <div className="pad-label">Operators</div>
      <div className="operator-pad">
        {operators.map((op, index) => (
          <DraggableOperator
            key={op}
            op={op}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default OperatorPad;
