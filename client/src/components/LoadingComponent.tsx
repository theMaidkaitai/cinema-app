import React from 'react';
import "../styles/LoadingComponentStyle/LoadingStyle.css"

const LoadingComponent = ({children}: {children: string}) => {
    return (
        <div className={"loading-component"}>
            {children}
        </div>
    );
};

export default LoadingComponent;