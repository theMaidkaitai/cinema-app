import React from 'react';
import "../styles/ButtonSubmitComponentStyle/ButtonSubmitStyle.css"


const ButtonSubmitComponent = ({children, onClick}: {children: string, onClick: () => void}) => {
    return (
        <div>
            <button type="submit" className="btn-submit" onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default ButtonSubmitComponent;