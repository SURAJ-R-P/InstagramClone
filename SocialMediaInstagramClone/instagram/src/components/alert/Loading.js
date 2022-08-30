import React from 'react'

const Loading = () => {
    return (
        <div className='loadings position-fixed w-100 h-100 text-center'
        style={{background:"#0008", color:"white", top: 0, left: 0 , zIndex:50}}>
            <svg width="205" height="205" viewBox='0 0 40 50'>
                <circle className="path" fill="transparent" strokeWidth="1" cx="19" cy="19" r="10" stroke="url(#gradient)"/>
                <linearGradient id="gradient">
                                <stop offset="50%" stopColor="#42d179" stopOpacity="1"/>
                                <stop offset="65%" stopColor="#42d179" stopOpacity=".5"/>
                                <stop offset="100%" stopColor="#42d179" stopOpacity="0"/>
                </linearGradient>
                <text x="45%" y="40%" textAnchor="middle" fill="white" fontSize="3.5px">Loading</text>
            </svg>
        </div>
    )
}

export default Loading