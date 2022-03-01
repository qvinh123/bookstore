import React from 'react';

const LoaderSmall = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }} >
            <div className="spinner-border" style={{ color: "var(--primary-color)" }}>
            </div>
        </div>
    )
};

export default LoaderSmall;
