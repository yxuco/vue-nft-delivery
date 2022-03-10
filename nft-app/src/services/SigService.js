import axios from 'axios';
import { ethers } from 'ethers';

export async function getContracts() {
    const response = await axios.get('/api/contracts');
    return response.data;
}

export async function verifyToken(data) {
    console.log("verify token: ", data.signature)
    const response = await axios.post('/api/verify', data);
    return response.data;
}

export async function signMessage(tokenId, contract) {
    try {
        if (!window.ethereum) {
            return {error: "Crypto wallet not found. Please login to a wallet."};
        }
        const message = contract + "-" + tokenId;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(message);
        const address = await signer.getAddress();
    
        return {
            message,
            signature,
            address
        };
    } catch (err) {
        return {error: err.message};
    }
}