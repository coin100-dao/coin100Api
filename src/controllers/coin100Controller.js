// src/controllers/coin100Controller.js

import Web3 from 'web3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js'; // Ensure logger is correctly set up

dotenv.config();

// Environment Variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x315caf51ae1e1fa93662f3f83e332dd0e1dab70e';
const WEB3_PROVIDER_URL = process.env.WEB3_PROVIDER_URL || 'https://polygon-mainnet.infura.io';

// Initialize Web3 instance
const web3 = new Web3(WEB3_PROVIDER_URL);

// Variables to store contract instance
let contractInstance = null;

/**
 * Function to dynamically load the Contract ABI with import assertion
 * @returns {Object} - Parsed Contract ABI
 */
const loadContractABI = async () => {
    try {
        // Resolve the absolute path to the ABI JSON file
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const abiPath = path.join(__dirname, '../config/coin100-contract-abi.json');

        // Dynamically import the JSON file with import assertion
        const module = await import(abiPath, { assert: { type: 'json' } });
        return module.default;
    } catch (error) {
        logger.error('Failed to load contract ABI:', error);
        throw new Error('Contract ABI loading failed');
    }
};

/**
 * Function to initialize and retrieve the Contract instance
 * Utilizes a singleton pattern to ensure only one instance exists
 * @returns {Object} - Web3 Contract Instance
 */
const getContractInstance = async () => {
    if (!contractInstance) {
        const contractABI = await loadContractABI();
        contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        logger.info('Contract instance initialized successfully');
    }
    return contractInstance;
};

/**
 * Execute rebase operation on the COIN100 contract
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const executeRebase = async (req, res) => {
    try {
        const { newMarketCap, walletAddress } = req.body;

        // Validate request parameters
        if (!newMarketCap || !walletAddress) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: newMarketCap or walletAddress'
            });
        }

        // Retrieve the contract instance
        const contract = await getContractInstance();

        // Verify if the wallet has admin rights
        const isAdmin = await contract.methods.isAdmin(walletAddress).call();
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Wallet does not have admin rights to execute rebase'
            });
        }

        // Prepare the rebase transaction data
        const rebaseData = contract.methods.rebase(newMarketCap).encodeABI();

        // Estimate gas limit (you may adjust this value based on actual contract requirements)
        const gasLimit = web3.utils.toHex(300000);

        // Return the transaction data for MetaMask or other wallet integrations to execute
        res.status(200).json({
            success: true,
            data: {
                to: CONTRACT_ADDRESS,
                from: walletAddress,
                data: rebaseData,
                gasLimit
            }
        });

    } catch (error) {
        logger.error('Rebase preparation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error preparing rebase transaction',
            error: error.message
        });
    }
};

/**
 * Get current rebase metrics from the COIN100 contract
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRebaseMetrics = async (req, res) => {
    try {
        // Retrieve the contract instance
        const contract = await getContractInstance();

        // Fetch rebase-related metrics from the contract
        const totalSupply = await contract.methods.totalSupply().call();
        const lastMarketCap = await contract.methods.lastMarketCap().call();
        const gonsPerFragment = await contract.methods._gonsPerFragment().call();

        res.status(200).json({
            success: true,
            data: {
                totalSupply: web3.utils.fromWei(totalSupply, 'ether'),
                lastMarketCap: web3.utils.fromWei(lastMarketCap, 'ether'),
                gonsPerFragment
            }
        });

    } catch (error) {
        logger.error('Error fetching rebase metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rebase metrics',
            error: error.message
        });
    }
};
