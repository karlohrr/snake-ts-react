import React from "react";

interface Props {
    position: number[];
}

export const Food: React.FC<Props> = ({ position }) => {
    const style = {
        left: `${position[0]}%`,
        top: `${position[1]}%`,
    };
    return <div className="food" style={style}></div>;
};
