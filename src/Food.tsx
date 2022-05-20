import React from "react";

interface Props {
    positions: number[][];
}

export const Food: React.FC<Props> = ({ positions }) => {
    return (
        <div>
            {positions.map((dot, i) => {
                // console.log(dot);
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`,
                };
                return <div className="food" key={i} style={style}></div>;
            })}
        </div>
    );
};
