import React from 'react';
import "../styles/ButtonComponentStyle/ButtonStyle.css"

// @ts-ignore
const ButtonComponent = ({children, onClick}) => {



    return (
        <div>
            <div className="button-general" onClick={onClick}>
                {children}
            </div>
        </div>
    );
};

export default ButtonComponent;