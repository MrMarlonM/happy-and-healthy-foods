import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

const Asset = ({ message }) => {
    return (
        <div className={`${styles.Asset} p-4`}>
            {Spinner && <Spinner animation="border" />}
            {message && <p className="mt-4">{message}</p>}
        </div>
    )
};

export default Asset;