import { useState, useEffect, useRef } from "react";

const STEP = 6;
const DELAY = 10; // ms
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

function App() {
  const [isMoving, setIsMoving] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(
    DIRECTIONS["right_top"],
  );
  const currentDirectionRef = useRef(currentDirection);
  const intervalIdRef = useRef(null);
  const textElRef = useRef(null);
  const getWidth = () => window.innerWidth;
  const getHeight = () => window.innerHeight;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const isDirectionsEquel = (a, b) => a.x === b.x && a.y === b.y;

  useEffect(() => {
    positionRef.current = position;
    currentDirectionRef.current = currentDirection;
  }, [position, currentDirection]);

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
      positionRef.current.x + textElRef.current.clientWidth + 10 >= getWidth() // правая сторона | право верх
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_top"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["right_bottom"],
      ) &&
      positionRef.current.x + textElRef.current.clientWidth + 10 >= getWidth() // правая сторона | право низ
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_bottom"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["left_bottom"],
      ) &&
      positionRef.current.y + textElRef.current.clientHeight + 10 >= getHeight() // пол | лево низ
    ) {
      setCurrentDirection((prev) => DIRECTIONS["left_top"]);
    } else if (
      isDirectionsEquel(
        currentDirectionRef.current,
        DIRECTIONS["right_bottom"],
      ) &&
      positionRef.current.y + textElRef.current.clientHeight + 10 >= getHeight() // пол | право низ
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
    if (event.code === "Space") {
      event.preventDefault();
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
    document.addEventListener("keydown", handleKeyDown);
    setPosition({
      x: getWidth() / 2 - textElRef.current.clientWidth / 2,
      y: getHeight() / 2 - textElRef.current.clientHeight / 2,
    });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
        }}
      >
        Такая-то
        <br />
        Такая-то
      </div>
      <div className={"help-text"}>Нажми SPACE</div>
    </div>
  );
}

export default App;
