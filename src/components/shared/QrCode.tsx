"use client";
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = () => {
    const [result, setResult] = useState("");
    const scannerRef = useRef(null);

    useEffect(() => {
        if (scannerRef.current) {
            const html5QrCodeScanner = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                /* verbose= */ false
            );

            html5QrCodeScanner.render(
                (decodedText, decodedResult) => {
                    setResult(decodedText);
                },
                (errorMessage) => {
                    console.error(errorMessage);
                }
            );

            return () => {
                html5QrCodeScanner.clear().catch(error => {
                    console.error("Failed to clear QR Code scanner", error);
                });
            };
        }
    }, []);

    return (
        <div>
            <h1>QR Code Scanner</h1>
            <div id="qr-reader" ref={scannerRef}></div>
            <p>Scanned QR Code: {result}</p>
        </div>
    );
};

export default QRCodeScanner;