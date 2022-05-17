import React, { useEffect, useState } from "react";
import { Food } from "./Food";
import { Snake } from "./Snake";

type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";
interface Directions {
    up: Direction;
    right: Direction;
    down: Direction;
    left: Direction;
}
const dir: Directions = {
    up: "UP",
    right: "RIGHT",
    down: "DOWN",
    left: "LEFT",
};

const getRandomCoords = () => {
    const min = 1;
    const max = 98;
    const x = Math.floor((Math.random() * max + min) / 2) * 2;
    const y = Math.floor((Math.random() * max + min) / 2) * 2;
    return [x, y];
};

function App() {
    const [snakeDots, setSnakeDots] = useState([
        [0, 0],
        [2, 0],
        [4, 0],
    ]);
    const [foodPos, setFoodPos] = useState(getRandomCoords());
    const [direction, setDirection] = useState<Direction>(dir.right);
    const [updateInt, setUpdateInt] = useState(500);
    const [remainingTime, setRemainingTime] = useState(updateInt);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    useEffect(() => {
        document.onkeydown = (e: KeyboardEvent) => {
            const key = e.code;
            switch (key) {
                case "ArrowUp":
                    if (direction !== dir.down) setDirection(dir.up);
                    break;
                case "ArrowRight":
                    if (direction !== dir.left) setDirection(dir.right);
                    break;
                case "ArrowDown":
                    if (direction !== dir.up) setDirection(dir.down);
                    break;
                case "ArrowLeft":
                    if (direction !== dir.right) setDirection(dir.left);
                    break;
                default:
                    break;
            }
        };
    }, [direction]);

    useEffect(() => {
        const int = setInterval(() => {
            setSnakeDots((prevDots) => {
                let dots = [...prevDots];
                let head = dots[dots.length - 1];
                switch (direction) {
                    case dir.up:
                        head = [head[0], head[1] - 2];
                        break;
                    case dir.right:
                        head = [head[0] + 2, head[1]];
                        break;
                    case dir.down:
                        head = [head[0], head[1] + 2];
                        break;
                    case dir.left:
                        head = [head[0] - 2, head[1]];
                        break;
                }
                dots.push(head);
                dots.shift();
                return dots;
            });
            setLastUpdate(Date.now());
            setRemainingTime(updateInt);
        }, remainingTime);
        return () => {
            const remaining = updateInt - (Date.now() - lastUpdate);
            setRemainingTime(remaining);
            clearInterval(int);
        };
    }, [direction, remainingTime]);
    return (
        <div className="gameArea">
            <Snake dots={snakeDots} />
            <Food position={foodPos} />
        </div>
    );
}

export default App;
