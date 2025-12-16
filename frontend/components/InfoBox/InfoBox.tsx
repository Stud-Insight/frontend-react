import React from "react";
import { MdInfo } from "react-icons/md";
import "./InfoBox.css"

interface InfoBoxInterface {
    label: string;
};

export default function InfoBox({label}: InfoBoxInterface){
    return (
        <div className="info-box">
            <MdInfo size={40}/>
            <label>{label}</label>
        </div>
    );
}