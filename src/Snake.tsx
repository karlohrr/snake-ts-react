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
                return <div className="snakeDot" key={i} style={style}></div>;
            })}
        </div>
    );
};
