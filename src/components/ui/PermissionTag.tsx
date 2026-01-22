import React from "react";
import "./PermissionTag.css"

interface PermissionTagProps {
    perm?: "etu" | "prof" | "admin" | "extern";
};

export default function PermissionTag({ perm }: PermissionTagProps){
    switch (perm){
        case "etu": {
            return (
                <div className="permission-tag-style etu">
                    <label>Etudiant</label>
                </div>
            )
        }

        case "prof": {
            return (
                <div className="permission-tag-style prof">
                    <label>Enseignant</label>
                </div>
            )
        }

        case "admin": {
            return (
                <div className="permission-tag-style admin">
                    <label>Administrateur</label>
                </div>
            )
        }

        case "extern": {
            return (
                <div className="permission-tag-style extern">
                    <label>Extern</label>
                </div>
            )
        }
    }

    return (
        <div className="permission-tag-style">
            <label></label>
        </div>
    )
}