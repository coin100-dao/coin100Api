// Import necessary modules with import assertion for JSON
import Web3 from 'web3';
import dotenv from 'dotenv';
const contractABI = await import('../config/coin100-contract-abi.json', {
    assert: { type: 'json' }
});

dotenv.config();

const CONTRACT_ADDRESS = '0x6402778921629ffbfeb3b683a4da099f74a2d4c5'; // Consider using process.env.CONTRACT_ADDRESS for flexibility
const web3 = new Web3(process.env.WEB3_PROVIDER_URL || 'https://polygon-mainnet.infura.io');
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

/**
 * Execute rebase operation on the COIN100 contract
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const executeRebase = async (req, res) => {
    try {
        const { newMarketCap, walletAddress } = req.body;

        if (!newMarketCap || !walletAddress) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: newMarketCap or walletAddress'
            });
        }

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

        // Return the transaction data for MetaMask to execute
        res.status(200).json({
            success: true,
            data: {
                to: CONTRACT_ADDRESS,
                from: walletAddress,
                data: rebaseData,
                gasLimit: web3.utils.toHex(300000), // Estimated gas limit
            }
        });

    } catch (error) {
        console.error('Rebase preparation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error preparing rebase transaction',
            error: error.message
        });
    }
};

/**
 * Get current rebase metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRebaseMetrics = async (req, res) => {
    try {
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
        console.error('Error fetching rebase metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rebase metrics',
            error: error.message
        });
    }
};
