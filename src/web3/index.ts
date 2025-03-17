import { ethers } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
    "function mintAchievement(address player, uint8 badgeType, string name, string description) public",
    "function hasAchievement(address, uint8) public view returns (bool)"
];

export enum BadgeType {
    SILVER = 0,
    GOLD = 1,
    PLATINUM = 2
}

interface Web3Error extends Error {
    code?: number;
    data?: unknown;
}

class Web3Manager {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.Signer | null = null;
    private contract: ethers.Contract | null = null;
    private account: string | null = null;

    async connect() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.account = await this.signer.getAddress();
        
        // Check if we're on the right network (Core Testnet2)
        const network = await this.provider.getNetwork();
        if (network.chainId !== BigInt(1114)) {
            throw new Error('Please connect to Core Blockchain Testnet2');
        }

        if (!CONTRACT_ADDRESS) {
            throw new Error('Contract address not configured');
        }

        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    }

    async mintAchievement(badgeType: BadgeType, name: string, description: string) {
        if (!this.contract || !this.account) {
            throw new Error('Web3 not initialized');
        }

        try {
            const tx = await this.contract.mintAchievement(
                this.account,
                badgeType,
                name,
                description
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            const web3Error = error as Web3Error;
            console.error('Error minting achievement:', web3Error);
            throw web3Error;
        }
    }

    async hasAchievement(badgeType: BadgeType): Promise<boolean> {
        if (!this.contract || !this.account) {
            throw new Error('Web3 not initialized');
        }

        try {
            return await this.contract.hasAchievement(this.account, badgeType);
        } catch (error) {
            const web3Error = error as Web3Error;
            console.error('Error checking achievement:', web3Error);
            throw web3Error;
        }
    }

    isConnected(): boolean {
        return this.account !== null;
    }

    getAccount(): string | null {
        return this.account;
    }
}

export const web3Manager = new Web3Manager();