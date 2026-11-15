
import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt, decrementAt, zeros } from "./matrix.js";


export default function App() {
  const [matrix, setMatrix] = useState(START);
useEffect(() => {
  fetch("/matrix.json")
    .then((response) => response.json())
    .then((data) => setMatrix(data));
}, []);
  function increment(row, col) {
    setMatrix((currentMatrix) =>
      incrementAt(currentMatrix, row, col)
    );
  }

  return (
    <main className="app">
      <Header />

      <div className="workspace">
        <Matrix
          matrix={matrix}
          onIncrement={increment}
        />

        <Stats matrix={matrix} />
      </div>
    </main>
  );
}
function decrement(row, col) {
  setMatrix((currentMatrix) =>
    decrementAt(currentMatrix, row, col)
  );
}

function reset() {
  setMatrix((currentMatrix) =>
    zeros(currentMatrix)
  );
}



