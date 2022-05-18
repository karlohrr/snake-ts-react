import React from "react";

interface Props {
    dots: number[][];
}

export const Snake: React.FC<Props> = ({ dots }) => {
    return (
        <div>
            {dots.map((dot, i) => {
                // console.log(dot);
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`,
                };
                const className =
                    i === dots.length - 1 ? "snakeHead" : "snakeDot";
                return <div className={className} key={i} style={style}></div>;
            })}
        </div>
    );
};
