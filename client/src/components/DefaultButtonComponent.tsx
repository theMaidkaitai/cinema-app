import React from 'react';
import "../styles/DefaultButtonComponentStyle/DefaultButtonStyle.css"

const DefaultButtonComponent = ({children, onClick}: {children: string, onClick: () => void}) => {
    return (
        <div>
            <button type="button" className="btn-default" onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default DefaultButtonComponent;