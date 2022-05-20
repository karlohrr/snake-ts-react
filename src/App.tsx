import React, { useEffect, useState, useRef } from "react";
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

const getFoodPositions = (count: number) => {
    const positions: number[][] = [];
    for (let i = 0; i < count; i++) {
        positions.push(getRandomCoords());
    }
    return positions;
};

const getNextHeadPosition = (currDir: Direction, head: number[]) => {
    switch (currDir) {
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
    return head;
};
const checkInBounds = (head: number[]) => {
    const min = 0;
    const max = 98;

    return head[0] >= min && head[1] >= min && head[0] <= max && head[1] <= max;
};

const checkCollideBody = (head: number[], body: number[][]) => {
    console.log(head);
    console.log(body);
    for (const dot of body) {
        if (head[0] === dot[0] && head[1] === dot[1]) return true;
    }
    return false;
};

const checkCheckEat = (head: number[], foods: number[][]) => {
    for (const food of foods) {
        if (head[0] === food[0] && head[1] === food[1]) return true;
    }
    return false;
};

const startDots = [
    [0, 0],
    [2, 0],
    [4, 0],
];
const calcInterval = (perSec: number) => {
    return 1000 / perSec;
};

const updateStep = 1;
const foodDots = 10;
function App() {
    const [snakeDots, setSnakeDots] = useState(startDots);
    const [foodPos, setFoodPos] = useState(getFoodPositions(foodDots));
    const [direction, setDirection] = useState<Direction>(dir.right);
    const [prevDirection, setPrevDirection] = useState(dir.up);
    const [updatesPerSec, setUpdatesPerSec] = useState(4);
    const [score, setScore] = useState(0);
    const snakeDotsRef = useRef(startDots);
    snakeDotsRef.current = snakeDots;
    const dirRef = useRef(dir.right);
    dirRef.current = direction;
    const prevDirRef = useRef(dir.up);
    prevDirRef.current = prevDirection;
    const updatesPerSecRef = useRef(updatesPerSec);
    updatesPerSecRef.current = updatesPerSec;
    const foodPosRef = useRef(foodPos);
    foodPosRef.current = foodPos;

    useEffect(() => {
        document.onkeydown = (e: KeyboardEvent) => {
            const key = e.code;
            const currDir = dirRef.current;
            const prevDir = prevDirRef.current;
            if (currDir !== prevDir) setPrevDirection(currDir);
            switch (key) {
                case "ArrowUp":
                    if (currDir !== dir.down) setDirection(dir.up);
                    break;
                case "ArrowRight":
                    if (currDir !== dir.left) setDirection(dir.right);
                    break;
                case "ArrowDown":
                    if (currDir !== dir.up) setDirection(dir.down);
                    break;
                case "ArrowLeft":
                    if (currDir !== dir.right) setDirection(dir.left);
                    break;
                default:
                    break;
            }
        };
        return () => {
            document.onkeydown = null;
        };
    }, []);

    useEffect(() => {
        let currentTimeout: NodeJS.Timeout;
        const moveSnake = () => {
            const currDir = dirRef.current;
            const prevDir = prevDirRef.current;
            let dots = [...snakeDotsRef.current];
            let originalHead = dots[dots.length - 1];
            let neck = dots[dots.length - 2];
            const body = [...dots];
            body.pop();

            // prevent from going backward if direction input is fast
            let head = getNextHeadPosition(currDir, originalHead);
            if (head[0] === neck[0] && head[1] === neck[1])
                head = getNextHeadPosition(prevDir, originalHead);

            dots.push(head);
            if (!checkInBounds(head) || checkCollideBody(head, body)) {
                //TODO: move to new func "reset"
                dots = startDots;
                setDirection(dir.right);
                setFoodPos(getFoodPositions(10));
                setUpdatesPerSec(4);
                setScore(0);
            } else {
                if (!checkCheckEat(head, foodPosRef.current)) {
                    dots.shift();
                } else {
                    //TODO: move to new func "progress"
                    setFoodPos(getFoodPositions(10));
                    setUpdatesPerSec((prev) => prev + updateStep);
                    setScore((prev) => prev + 1);
                }
            }
            setSnakeDots(dots);
            currentTimeout = setTimeout(
                moveSnake,
                calcInterval(updatesPerSecRef.current)
            );
        };
        currentTimeout = setTimeout(moveSnake, updatesPerSecRef.current);
        return () => {
            clearTimeout(currentTimeout);
        };
    }, []);

    return (
        <div>
            <div className="gameInfo">Score: {score}</div>
            <div className="gameArea">
                <Snake dots={snakeDots} />
                <Food positions={foodPos} />
            </div>
            <div className="gameInfo">Current speed: {updatesPerSec}/sec</div>
        </div>
    );
}

export default App;
