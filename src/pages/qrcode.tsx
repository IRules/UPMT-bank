"use client";
// components/QRCodeScanner.js
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import QrReader component only
const QrReader = dynamic(
    () => import("react-qr-reader").then((mod) => mod.QrReader),
    { ssr: false }
);

const QRCodeScanner = () => {
    const [result, setResult] = useState("");

    const handleScan = (data: any) => {
        if (data) {
            setResult(data.text); // Extract the text property from the scanned data
        }
    };

    return (
        <div>
            <h1>QR Code Scanner</h1>
            <QrReader onResult={handleScan} constraints={{
                    facingMode: "environment",
            }} />
            <p>Scanned QR Code: {result}</p>
        </div>
    );
};

export default QRCodeScanner;