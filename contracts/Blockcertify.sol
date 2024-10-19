// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockCertify {
    struct Document {
        bytes32 hash; // Hash of the document
        bool isVerified; // Verification status
    }

    mapping(string => Document) private documents; // Maps PRN to Document
    address public admin; // Address of the admin

    event DocumentUploaded(string prn, bytes32 hash);
    event DocumentVerified(string prn, bool status);

    // Modifier to restrict access to the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized. Only admin can perform this action.");
        _;
    }

    // Constructor to set the contract deployer as the admin
    constructor() {
        admin = msg.sender; // Set the deployer as the admin
    }

    // Function to upload a document
    function uploadDocument(string memory prn, bytes32 hash) public onlyAdmin {
        // Ensure that the document is not already uploaded
        require(documents[prn].hash == 0, "Document already uploaded.");
        
        documents[prn] = Document(hash, false); // Store document
        emit DocumentUploaded(prn, hash); // Emit event for upload
    }

    // Function to verify a document
    function verifyDocument(string memory prn, bytes32 hash) public {
        Document storage doc = documents[prn];

        // Check if the document exists and if the hashes match
        require(doc.hash != 0, "Document not found.");
        require(doc.hash == hash, "Hash does not match.");

        // Update verification status
        doc.isVerified = true; 
        
        // Emit verification event
        emit DocumentVerified(prn, true); // Emit event for successful verification
    }

    // Function to get verification status
    function getVerificationStatus(string memory prn) public view returns (bool) {
        return documents[prn].isVerified; // Return the verification status
    }

    // Function to get the document hash
    function getDocumentHash(string memory prn) public view returns (bytes32) {
        return documents[prn].hash; // Return the document hash
    }
}
