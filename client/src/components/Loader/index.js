import React from 'react'
import Spinner from "./loading.gif"
import "./Loader.css";
function Loader() {
    return (
        <div className="fp-container">
            <img src={Spinner} className="fp-loader" alt=""/>
        </div>
    )
}

export default Loader
