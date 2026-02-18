import { useState, useEffect } from "react";
import MainPage from "./components/MainPage";
import TargetDisplay from "./components/TargetDisplay";
import NumberPad from "./components/NumberPad";
import OperatorPad from "./components/OperatorPad";
import ExpressionDisplay from "./components/ExpressionDisplay";
import "./GamePage.css";

function App() {
  const [page, setPage] = useState("main");
  const [target, setTarget] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [expression, setExpression] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  /* ---------------- FETCH PUZZLE ---------------- */

  const fetchPuzzle = async () => {
    try {
      const response = await fetch("http://localhost:5000/puzzle");
      const data = await response.json();

      setTarget(data.target);

      const formattedNumbers = data.numbers.map(num => ({
        value: num,
        used: false
      }));

      setNumbers(formattedNumbers);
      setExpression([]);
      setMessage("");
      setMessageType("");
    } catch (error) {
      setMessage("Could not load puzzle.");
      setMessageType("error");
    }
  };

  // Load first puzzle when entering game page
  useEffect(() => {
    if (page === "game") {
      fetchPuzzle();
    }
  }, [page]);

  /* ---------------- ADD NUMBER ---------------- */

  const handleAddNumber = (index) => {
    if (numbers[index].used) return;

    if (
      expression.length > 0 &&
      typeof expression[expression.length - 1] === "number"
    ) {
      return;
    }

    const updatedNumbers = numbers.map((num, i) =>
      i === index ? { ...num, used: true } : num
    );

    setNumbers(updatedNumbers);
    setExpression([...expression, updatedNumbers[index].value]);
  };

  /* ---------------- ADD OPERATOR ---------------- */

  const handleAddOperator = (operator) => {
    if (expression.length === 0) return;
    if (typeof expression[expression.length - 1] !== "number") return;

    setExpression([...expression, operator]);
  };

  /* ---------------- CLEAR ---------------- */

  const handleClear = () => {
    const resetNumbers = numbers.map(num => ({ ...num, used: false }));
    setNumbers(resetNumbers);
    setExpression([]);
    setMessage("");
    setMessageType("");
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    const allUsed = numbers.every(num => num.used);

    if (!allUsed) {
      setMessage("You must use all numbers.");
      setMessageType("error");
      return;
    }

    if (
      expression.length === 0 ||
      typeof expression[expression.length - 1] !== "number"
    ) {
      setMessage("Expression must end with a number.");
      setMessageType("error");
      return;
    }

    const nums = expression.filter((_, i) => i % 2 === 0);
    const ops = expression.filter((_, i) => i % 2 === 1);

    try {
      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: nums, ops, target })
      });

      const data = await response.json();

      if (data.valid) {
        setMessage("🎉 Correct! Loading next puzzle...");
        setMessageType("success");
        setTimeout(() => { fetchPuzzle(); }, 1500);
      } else {
        setMessage(data.message);
        setMessageType("error");
        setExpression([]);
        const resetNumbers = numbers.map(num => ({ ...num, used: false }));
        setNumbers(resetNumbers);
      }

    } catch (error) {
      setMessage("Server error. Is backend running?");
      setMessageType("error");
    }
  };

  /* ---------------- ROUTING ---------------- */

  if (page === "main") {
    return <MainPage onEnterLab2={() => setPage("game")} />;
  }

  /* ---------------- GAME UI ---------------- */

  return (
    <div className="game-page">
      {/* Navbar */}
      <nav className="game-navbar">
        <button className="game-back-btn" onClick={() => setPage("main")}>
          ← Home
        </button>
        <span className="game-nav-title">Quantize</span>
        <div style={{ width: "80px" }} />
      </nav>

      <div className="game-container">
        <h1 className="game-title">Quantize</h1>

        {target !== null && <TargetDisplay target={target} />}

        <ExpressionDisplay expression={expression} />

        <NumberPad numbers={numbers} onSelect={handleAddNumber} />
        <OperatorPad onSelect={handleAddOperator} />

        <div className="game-actions">
          <button className="game-btn game-btn--clear" onClick={handleClear}>
            Clear
          </button>
          <button className="game-btn game-btn--submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {message && (
          <p className={`game-message game-message--${messageType}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
