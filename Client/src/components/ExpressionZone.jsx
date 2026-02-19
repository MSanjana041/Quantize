import { useDroppable } from "@dnd-kit/core";

function ExpressionZone({ expression, onDrop }) {
    const { isOver, setNodeRef } = useDroppable({ id: "expression-zone" });

    return (
        <div
            ref={setNodeRef}
            className={`expression-zone ${isOver ? "expression-zone--active" : ""}`}
        >
            {expression.length === 0 ? (
                <span className="expression-placeholder">
                    {isOver ? "Drop here!" : "Drag numbers & operators here"}
                </span>
            ) : (
                <div className="expression-tokens">
                    {expression.map((token, i) => (
                        <span
                            key={i}
                            className={`expression-token ${typeof token === "number"
                                    ? "expression-token--number"
                                    : "expression-token--operator"
                                }`}
                        >
                            {token}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExpressionZone;
