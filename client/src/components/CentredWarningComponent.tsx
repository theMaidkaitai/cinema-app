import React from 'react';
import "../styles/CentredWarningComponentStyle/CentredWarningStyle.css"

const CentredWarningComponent = ({child}) => {
    return (
        <div className={"message"}>
            {child}
        </div>
    );
};

export default CentredWarningComponent;