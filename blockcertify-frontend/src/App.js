import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BlockCertifyContract from './BlockCertify.json'; // Import your contract ABI
import AdminPanel from './AdminPanel';
import UserPanel from './UserPanel'; // Import UserPanel
import logo from './kyc-page-image.jpg'; // Replace with your image file

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [role, setRole] = useState('');

    useEffect(() => {
        const initEthers = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum, { ens: null }); // Disable ENS
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);

                const network = await provider.getNetwork();
                const deployedNetwork = BlockCertifyContract.networks[network.chainId];

                const signer = provider.getSigner();
                const instance = new ethers.Contract(
                    deployedNetwork && deployedNetwork.address,
                    BlockCertifyContract.abi,
                    signer
                );
                setContract(instance);
            } else {
                alert('MetaMask is not installed. Please install it to use this DApp.');
            }
        };

        initEthers();
    }, []);

    const handleAdminLogin = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setRole('admin');
    };

    const handleUserLogin = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setRole('user');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>BlockCertify </h1>
            <div style={styles.imageContainer}>
                <img src={logo} alt="BlockCertify" style={styles.image} />
            </div>
            {role === '' && (
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handleAdminLogin}>Login as Admin</button>
                    <button style={styles.button} onClick={handleUserLogin}>Login as User</button>
                </div>
            )}
            {role === 'admin' && <AdminPanel contract={contract} account={account} />}
            {role === 'user' && <UserPanel />}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e0f7fa', // Light blue background
        color: '#006064', // Dark teal text color
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        marginBottom: '20px',
        fontSize: '3rem',
        fontWeight: 'bold',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    image: {
        width: '250px', // Adjust the width as needed
        height: '200px',
        borderRadius: '20%', // Rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a shadow for depth
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
    },
    button: {
        padding: '15px 30px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        backgroundColor: '#00796b', // Teal button background
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a shadow for depth
    },
};

// Adding hover effect on buttons
const buttonHoverStyle = {
    backgroundColor: '#004d40', // Darker teal for hover
};

export default App;
