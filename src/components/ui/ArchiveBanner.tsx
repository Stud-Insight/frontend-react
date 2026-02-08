import React from "react";
import { FaArchive } from "react-icons/fa";
import "./ArchiveBanner.css";

export default function ArchiveBanner() {
    return (
        <div className="archive-banner">
            <FaArchive className="archive-icon" />
            <span className="archive-message">
                Cette période est archivée. Les données sont en lecture seule et ne peuvent pas être modifiées.
            </span>
        </div>
    );
}