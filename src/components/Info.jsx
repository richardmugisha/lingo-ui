import React from 'react';

const backgroundColors = {
    warning: 'rgb(245, 224, 149)',
    success: 'rgb(193, 246, 86)',
    info: 'rgb(108, 173, 244)',
    danger: 'rgb(250, 115, 105)'
}

const infoStyler = (info) => {
    return {
        minWidth: '500px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1em 3em',
        marginBottom: '1em',
        boxShadow: '0 0 1em rgba(0, 0, 0, 0.5',
        background: backgroundColors[info.type]
    }
}

const Info = ({ info }) => {
    console.log(info)
    return <div style={infoStyler(info)} >
          {info.message}
    </div>
}


export default Info
