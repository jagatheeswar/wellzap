import React from 'react'
import './Sidebar.css'

function SidebarComponent({logo,name}) {
    return (
        <div className="drawer__container">
            <img src={`/assets/${logo}.png`} width="25px" height="25px" alt="" />
            <h1>{name}</h1>
        </div>
    )
}

export default SidebarComponent
