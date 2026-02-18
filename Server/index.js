const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.send("Quantize Server Running");
});

app.post("/evaluate", (req, res) => {
  const { numbers, target, ops } = req.body;

  if (
    !Array.isArray(numbers) ||
    !Array.isArray(ops) ||
    numbers.length !== 3 ||
    ops.length !== 2
  ) {
    return res.status(400).json({
      valid: false,
      message: "Expected { numbers: [n,n,n], ops: [op,op], target: number }"
    });
  }

  try {
    const correct = checkSolution(numbers, target, ops);
    const result = evaluate(numbers, ops);

    return res.json({
      valid: correct,
      result,
      message: correct ? "Correct!" : `Incorrect. Result was ${result}`
    });
  } catch (error) {
    return res.status(400).json({
      valid: false,
      message: error.message
    });
  }
});

app.get("/puzzle", (req, res) => {
  const puzzle = generatePuzzle();
  res.json(puzzle);
});

/* ---------------- EVALUATOR ---------------- */

const operators = ["+", "-", "*"];

function evaluate(numbers, ops) {
  // Validate inputs before passing to Function to keep this safe
  if (!numbers.every(n => typeof n === "number") ||
      !ops.every(op => operators.includes(op))) {
    throw new Error("Invalid numbers or operators");
  }

  const expression = `${numbers[0]} ${ops[0]} ${numbers[1]} ${ops[1]} ${numbers[2]}`;
  return Function(`"use strict"; return (${expression})`)();
}

function isReachable(numbers, target) {
  for (const op1 of operators) {
    for (const op2 of operators) {
      if (evaluate(numbers, [op1, op2]) === target) return true;
    }
  }
  return false;
}

function generatePuzzle() {
  let numbers, target;

  do {
    numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 20) + 1);
    const ops = [
      operators[Math.floor(Math.random() * 3)],
      operators[Math.floor(Math.random() * 3)]
    ];
    target = evaluate(numbers, ops);
  } while (!isReachable(numbers, target));

  return { numbers, target };
}

function checkSolution(numbers, target, playerOps) {
  return evaluate(numbers, playerOps) === target;
}

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});