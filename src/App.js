import { useState, useEffect, useRef } from "react";

const STEP = 2; // px
const PADDING = 5; // px
const DELAY = 6; // ms
const DIRECTIONS = {
  left_top: {
    x: -STEP,
    y: -STEP,
  },
  left_bottom: {
    x: -STEP,
    y: STEP,
  },
  right_top: {
    x: STEP,
    y: -STEP,
  },
  right_bottom: {
    x: STEP,
    y: STEP,
  },
};
const COLORS = [
  "#504985",
  "#ff5b22",
  "#d644ce",
  "#8130bf",
  "#ff3a61",
  "#45a359",
  "#577c9d",
  "#56d5e0",
  "#fb5928",
  "#f1ca51",
];

function App() {
  const [isMoving, setIsMoving] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(
    DIRECTIONS["right_top"],
  );
  const isDirtyRef = useRef(true);
  const currentDirectionRef = useRef(currentDirection);
  const intervalIdRef = useRef(null);
  const textElRef = useRef(null);
  const positionRef = useRef();
  const [textColor, setTextColor] = useState("#131313");
  const getWidth = () => window.innerWidth;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const getHeight = () => window.innerHeight;
  const isDirectionsEquel = (a, b) => a.x === b.x && a.y === b.y;
  const setRandomColor = () =>
    setTextColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  const intervalCallback = () => {
    if (
      isDirectionsEquel(currentDirectionRef.current, DIRECTIONS["right_top"]) &&
      positionRef.current.y < 0 // потолок | право верх
    ) {
      setCurrentDirection((prev) => DIRECTIONS["right_bottom"]);
    } else if (
      isDirectionsEquel(currentDirectionRef.current, DIRECTIONS["left_top"]) &&
      positionRef.current.y < 0 // потолок | лево верх
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_bottom"]);
    } else if (
      isDirectionsEquel(currentDirectionRef.current, DIRECTIONS["right_top"]) &&
      positionRef.current.x + textElRef.current.clientWidth + PADDING >=
        getWidth() // правая сторона | право верх
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_top"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["right_bottom"],
      ) &&
      positionRef.current.x + textElRef.current.clientWidth + PADDING >=
        getWidth() // правая сторона | право низ
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_bottom"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["left_bottom"],
      ) &&
      positionRef.current.y + textElRef.current.clientHeight + PADDING >=
        getHeight() // пол | лево низ
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_top"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["right_bottom"],
      ) &&
      positionRef.current.y + textElRef.current.clientHeight + PADDING >=
        getHeight() // пол | право низ
    ) {
      setCurrentDirection((prev) => DIRECTIONS["right_top"]);
    } else if (
      isDirectionsEquel(currentDirectionRef.current, DIRECTIONS["left_top"]) &&
      positionRef.current.x < 0 // левая сторона | лево верх
    ) {
      setCurrentDirection((prev) => DIRECTIONS["right_top"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["left_bottom"],
      ) &&
      positionRef.current.x < 0 // левая сторона | лево низ
    ) {
      setCurrentDirection((prev) => DIRECTIONS["right_bottom"]);
    }

    setPosition((prev) => {
      return {
        x: prev.x + currentDirectionRef.current.x,
        y: prev.y + currentDirectionRef.current.y,
      };
    });
  };

  const stopInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const startInterval = () => {
    stopInterval();
    intervalIdRef.current = setInterval(intervalCallback, DELAY);
  };

  const handleKeyDown = (event) => {
    if (
      event.type === "pointerdown" || // Мышь
      event.code === "Space" || // Клавиатура
      event.type === "touchstart" // Касание
    ) {
      event.preventDefault();
      if (isDirtyRef.current) isDirtyRef.current = false;
      setIsMoving((prev) => {
        const newState = !prev;
        if (newState) {
          startInterval();
        } else {
          stopInterval();
        }
        return newState;
      });
    }
  };

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    currentDirectionRef.current = currentDirection;
    setRandomColor();
  }, [currentDirection]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleKeyDown);
    setPosition({
      x: getWidth() / 2 - textElRef.current.clientWidth / 2,
      y: getHeight() / 2 - textElRef.current.clientHeight / 2,
    });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleKeyDown);
      stopInterval();
    };
  }, []);

  return (
    <div className="App">
      <div
        className={"text"}
        ref={textElRef}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          color: textColor,
        }}
      >
        Такая-то
        <br />
        Такая-то
      </div>
      {isDirtyRef.current && <div className={"help-text"}>Клик!</div>}
    </div>
  );
}

export default App;
