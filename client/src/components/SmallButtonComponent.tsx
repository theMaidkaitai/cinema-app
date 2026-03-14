import React from 'react';
import "../styles/SmallButtonStyle/SmallButtonStyle.css"

// @ts-ignore
const SmallButtonComponent = ({children, onClick}) => {



    return (
        <div>
            <div className={`button-general-small`} onClick={onClick}>
                {children}
            </div>
        </div>
    );
};

export default SmallButtonComponent;