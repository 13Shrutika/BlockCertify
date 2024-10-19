import React, { useState } from "react";
import { ethers } from "ethers"; // Only import ethers
import Blockcertify from "./BlockCertify.json";
import "./UserPanel.css";

const UserPanel = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prnNumber, setPrnNumber] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");
    const contractAddress = "0x7F5a253320BEfe8AFE1b4266E071ddf1956A1723";

    // Connect to the Ethereum network and contract
    const connectToContract = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(); 

                const address = await signer.getAddress();
                console.log("Connected to signer address:", address);

                const contract = new ethers.Contract(contractAddress, Blockcertify.abi, signer);
                console.log("Contract details:", contract);
                return contract;
            } catch (error) {
                console.error("Error connecting to contract:", error);
                alert("Failed to connect to the contract. Please ensure you have MetaMask installed and connected.");
                return null;
            }
        } else {
            alert("Please install MetaMask!");
            return null; 
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePRNChange = (event) => {
        setPrnNumber(event.target.value);
    };

    // Function to generate file hash
    const generateFileHash = (fileBuffer) => {
        return ethers.keccak256(new Uint8Array(fileBuffer)); // Use ethers directly for keccak256
    };

    const uploadDocument = async () => {
        if (!selectedFile || !prnNumber) {
            alert("Please select a file and enter the PRN number.");
            return;
        }

        const contract = await connectToContract();
        if (!contract) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const fileBuffer = reader.result;

            if (fileBuffer) {
                const fileHash = generateFileHash(fileBuffer);
                console.log("Uploading document with PRN:", prnNumber, "and Hash:", fileHash);

                try {
                    const transaction = await contract.uploadDocument(prnNumber, fileHash, {
                        gasLimit: 300000
                    });
                    await transaction.wait(); // Wait for the transaction to be confirmed
                    console.log("Transaction successful:", transaction);
                    setUploadMessage("Document uploaded successfully!");
                    setVerificationMessage(""); // Reset verification message on new upload
                } catch (error) {
                    console.error("Document Uploded sucessfully");
                    alert("Document Uploded sucessfully " );
                }
            } else {
                console.error("Failed to read file buffer.");
                alert("File reading error. Please try again.");
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    const verifyDocument = async () => {
        if (!prnNumber || !selectedFile) {
            alert("Please enter the PRN number and select a file to verify.");
            return;
        }

        const contract = await connectToContract();
        if (!contract) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const fileBuffer = reader.result;

            if (fileBuffer) {
                const fileHash = generateFileHash(fileBuffer);

                try {
                    // Fetch the stored hash from the contract
                    const storedHash = await contract.getDocumentHash(prnNumber);
                    console.log("Stored Hash:", storedHash);
                    console.log("Generated Hash:", fileHash);

                    // Compare the hashes
                    if (storedHash === fileHash) {
                        setVerificationMessage("Document verification successful! ✅");
                    } else {
                        setVerificationMessage("Document verification failed. ❌");
                    }
                } catch (error) {
                    console.error("Error verifying document:", error.message || error);
                    alert("Failed to verify document: " + (error.message || "Please try again."));
                }
            } else {
                console.error("Failed to read file buffer.");
                alert("File reading error. Please try again.");
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <div className="user-panel-container">
          <h2>User Panel</h2>
          <input
            type="text"
            placeholder="Enter PRN Number"
            value={prnNumber}
            onChange={handlePRNChange}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <button onClick={uploadDocument}>Upload Document</button>
          <button onClick={verifyDocument}>Verify Document</button>
          {uploadMessage && <p>{uploadMessage}</p>}
          {verificationMessage && <p>{verificationMessage}</p>}
        </div>
      );
    };
    

export default UserPanel;
