import React from "react";

const Description = ({ text }) => {
    // console.log(text);

    return (
        <div>
            {text.split('\n').map((line, index) => (
                <span key={index}>
                    {line}
                    <br />
                </span>
            ))}
        </div>
    );
};

export default Description;
