import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import html2canvas from "html2canvas";
import MainPage from "./components/MainPage";
import TargetDisplay from "./components/TargetDisplay";
import NumberPad from "./components/NumberPad";
import OperatorPad from "./components/OperatorPad";
import ExpressionZone from "./components/ExpressionZone";
import "./GamePage.css";

function App() {
  const [page, setPage] = useState("main");
  const [target, setTarget] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [expression, setExpression] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [activeDrag, setActiveDrag] = useState(null); // { type, value }
  const [isSolved, setIsSolved] = useState(false);
  const gameRef = useRef(null);

  /* ---------------- FETCH PUZZLE ---------------- */

  const fetchPuzzle = async () => {
    try {
      const response = await fetch("https://quantize-2pq1.onrender.com/puzzle");
      const data = await response.json();
      setTarget(data.target);
      const formattedNumbers = data.numbers.map(num => ({ value: num, used: false }));
      setNumbers(formattedNumbers);
      setExpression([]);
      setMessage("");
      setMessageType("");
      setIsSolved(false);
    } catch (error) {
      setMessage("Could not load puzzle.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (page === "game") fetchPuzzle();
  }, [page]);

  /* ---------------- KEYBOARD SUPPORT ---------------- */

  useEffect(() => {
    if (page !== "game") return;

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        removeLastToken();
      }
      if (event.key === "Enter") handleSubmit();
      if (event.key.toLowerCase() === "r") fetchPuzzle();
      if (["+", "-", "*", "/"].includes(event.key)) handleAddOperator(event.key);
      if (/^[0-9]$/.test(event.key)) {
        const index = numbers.findIndex(
          n => n.value.toString() === event.key && !n.used
        );
        if (index !== -1) handleAddNumber(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, numbers, expression]);

  /* ---------------- ADD NUMBER ---------------- */

  const handleAddNumber = (index) => {
    if (numbers[index].used) return;
    if (
      expression.length > 0 &&
      typeof expression[expression.length - 1] === "number"
    ) return;

    const updatedNumbers = numbers.map((num, i) =>
      i === index ? { ...num, used: true } : num
    );
    setNumbers(updatedNumbers);
    setExpression(prev => [...prev, updatedNumbers[index].value]);
  };

  /* ---------------- ADD OPERATOR ---------------- */

  const handleAddOperator = (operator) => {
    if (expression.length === 0) return;
    if (typeof expression[expression.length - 1] !== "number") return;
    setExpression(prev => [...prev, operator]);
  };

  /* ---------------- CLEAR ---------------- */

  const handleClear = () => {
    setNumbers(numbers.map(num => ({ ...num, used: false })));
    setExpression([]);
    setMessage("");
    setMessageType("");
  };

  /* ---------------- REMOVE LAST TOKEN (Backspace) ---------------- */

  const removeLastToken = () => {
    if (expression.length === 0) return;
    const last = expression[expression.length - 1];
    const newExpression = expression.slice(0, -1);

    if (typeof last === "number") {
      const idx = numbers.findIndex(n => n.value === last && n.used);
      if (idx !== -1) {
        setNumbers(numbers.map((n, i) => i === idx ? { ...n, used: false } : n));
      }
    }
    setExpression(newExpression);
    setMessage("");
    setMessageType("");
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const allUsed = numbers.every(num => num.used);
    if (!allUsed) { setMessage("You must use all numbers."); setMessageType("error"); return; }
    if (expression.length === 0 || typeof expression[expression.length - 1] !== "number") {
      setMessage("Expression must end with a number."); setMessageType("error"); return;
    }

    const nums = expression.filter((_, i) => i % 2 === 0);
    const ops = expression.filter((_, i) => i % 2 === 1);

    try {
      const response = await fetch("https://quantize-2pq1.onrender.com/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: nums, ops, target })
      });
      const data = await response.json();

      if (data.valid) {
        setMessage("🎉 Correct! You can now share your achievement.");
        setMessageType("success");
        setIsSolved(true);
      } else {
        setMessage(data.message);
        setMessageType("error");
        setExpression([]);
        setNumbers(numbers.map(num => ({ ...num, used: false })));
      }
    } catch (error) {
      setMessage("Server error. Is backend running?"); setMessageType("error");
    }
  };

  /* ---------------- CAPTURE ---------------- */

  const handleCapture = async () => {
    if (!gameRef.current) return;
    try {
      const canvas = await html2canvas(gameRef.current, {
        backgroundColor: "#0d0f1a", // Matches .game-page background
        scale: 2, // Higher quality
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `quantize-achievement-${target}.png`;
      link.click();
    } catch (err) {
      console.error("Capture failed", err);
    }
  };

  /* ---------------- DRAG HANDLERS ---------------- */

  const handleDragStart = (event) => {
    setActiveDrag(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    setActiveDrag(null);
    const { over, active } = event;
    if (!over || over.id !== "expression-zone") return;

    const data = active.data.current;
    if (data.type === "number") {
      handleAddNumber(data.index);
    } else if (data.type === "operator") {
      handleAddOperator(data.value);
    }
  };

  /* ---------------- ROUTING ---------------- */

  if (page === "main") {
    return <MainPage onEnterLab2={() => setPage("game")} />;
  }

  /* ---------------- GAME UI ---------------- */

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="game-page">
        {/* Navbar */}
        <nav className="game-navbar">
          <button className="game-back-btn" onClick={() => setPage("main")}>
            ← Home
          </button>
          <span className="game-nav-title">Quantize</span>
          <div style={{ width: "80px" }} />
        </nav>

        <div className="game-container" ref={gameRef}>
          <h1 className="game-title">Quantize</h1>

          {target !== null && <TargetDisplay target={target} />}

          {/* Droppable expression zone */}
          <ExpressionZone expression={expression} />

          <NumberPad numbers={numbers} onSelect={handleAddNumber} />
          <OperatorPad onSelect={handleAddOperator} />

          <div className="game-actions">
            <button className="game-btn game-btn--clear" onClick={handleClear} disabled={isSolved}>
              Clear
            </button>
            <button className="game-btn game-btn--submit" onClick={handleSubmit} disabled={isSolved}>
              Submit
            </button>
          </div>

          {isSolved && (
            <div className="game-actions">
              <button className="game-btn game-btn--next" onClick={fetchPuzzle}>
                Next Puzzle →
              </button>
            </div>
          )}

          <div className="game-actions">
            <button className="game-btn game-btn--share" onClick={handleCapture}>
              📸 Share Achievement
            </button>
          </div>

          {message && (
            <p className={`game-message game-message--${messageType}`}>
              {message}
            </p>
          )}

          {/* Keyboard hint */}
          <div className="keyboard-hint">
            <span className="hint-item"><kbd>1</kbd>–<kbd>9</kbd> numbers</span>
            <span className="hint-sep">·</span>
            <span className="hint-item"><kbd>+</kbd><kbd>-</kbd><kbd>*</kbd><kbd>/</kbd> operators</span>
            <span className="hint-sep">·</span>
            <span className="hint-item"><kbd>Enter</kbd> submit</span>
            <span className="hint-sep">·</span>
            <span className="hint-item"><kbd>Backspace</kbd> undo</span>
            <span className="hint-sep">·</span>
            <span className="hint-item"><kbd>R</kbd> new puzzle</span>
          </div>
        </div>
      </div>

      {/* Floating tile under cursor while dragging */}
      <DragOverlay>
        {activeDrag?.type === "number" && (
          <div className="drag-overlay drag-overlay--number">{activeDrag.value}</div>
        )}
        {activeDrag?.type === "operator" && (
          <div className="drag-overlay drag-overlay--operator">{activeDrag.value}</div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
