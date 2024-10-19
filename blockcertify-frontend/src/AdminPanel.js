import React, { useState } from "react";
import { ethers } from "ethers";
import Blockcertify from "./BlockCertify.json";
import "./AdminPanel.css";

const AdminPanel = () => {
    const [studentPRN, setStudentPRN] = useState("");
    const [studentName, setStudentName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const contractAddress = "0x7F5a253320BEfe8AFE1b4266E071ddf1956A1723"; // Replace with your actual contract address

    // Function to handle the form submission
    const uploadDocument = async () => {
        if (!studentPRN || !studentName || !selectedFile) {
            alert("Please fill in all the fields and select a file.");
            return;
        }

        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                const contract = new ethers.Contract(contractAddress, Blockcertify.abi, signer);

                // Read the file as an ArrayBuffer
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const fileBuffer = reader.result;

                    if (fileBuffer) {
                        // Hash the file
                        const fileHash = ethers.keccak256(new Uint8Array(fileBuffer));

                        // Upload the document details to the smart contract
                        const transaction = await contract.uploadDocument(studentPRN, fileHash, {
                            gasLimit: 300000
                        });

                        await transaction.wait();
                        setUploadMessage("Document uploaded successfully!");
                    } else {
                        alert("Error reading the file.");
                    }
                };
                reader.readAsArrayBuffer(selectedFile);
            } catch (error) {
                console.error("Error uploading document:", error);
                alert("Failed to upload document. Please try again.");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <div>
                <input
                    type="text"
                    placeholder="Enter Student PRN"
                    value={studentPRN}
                    onChange={(e) => setStudentPRN(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                />
            </div>
            <div>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>
            <button onClick={uploadDocument}>Upload Document</button>
            {uploadMessage && <p>{uploadMessage}</p>}
        </div>
    );
};

export default AdminPanel;
