import { web3Manager, BadgeType } from '../../web3';
import { showSuccess, showError } from '../utils/Notifications';

export interface Achievement {
    rarity: string;
    id: string;
    name: string;
    description: string;
    event: string;
    earned: boolean;
    badge: string;
}

export const achievements: { [key: string]: Achievement } = {
    defeat5Enemies: {
        rarity: "silver",
        id: "defeat5Enemies",
        name: "Pentakill",
        description: "Defeat 5 enemies",
        event: "defeated5Enemies",
        earned: false,
        badge: "silver",
    },
    defeat10Enemies: {
        rarity: "silver",
        id: "defeat10Enemies",
        name: "Decakill",
        description: "Defeat 10 enemies",
        event: "defeated10Enemies",
        earned: false,
        badge: "silver",
    },
    mvPlayer: {
        rarity: "gold",
        id: "mvPlayer",
        name: "Master",
        description: "Defeat 10 enemies with not less than 75% health",
        event: "health75",
        earned: false,
        badge: "gold",
    },
    opPlayer: {
        rarity: "platinum",
        id: "opPlayer",
        name: "Godlike",
        description: "Defeat 10 enemies without getting hit",
        event: "noDamage",
        earned: false,
        badge: "platinum",
    }
};

class AchievementManager {
    private achievementState: { [key: string]: Achievement };
    private initialized: boolean = false;

    constructor() {
        this.achievementState = { ...achievements };
    }

    async initialize() {
        if (this.initialized) return;

        if (typeof window.ethereum === 'undefined') {
            showError('Please install MetaMask to earn achievements');
            return;
        }

        try {
            await web3Manager.connect();
            this.initialized = true;
            await this.syncAchievements();
        } catch (error) {
            console.error('Failed to initialize web3:', error);
            if (error instanceof Error && error.message?.includes('Please connect to Core Blockchain Testnet2')) {
                const switchToCore = window.confirm('Please switch to Core Testnet2 network. Click OK to switch automatically.');
                if (switchToCore) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x45A',
                                chainName: 'Core Blockchain Testnet2',
                                nativeCurrency: {
                                    name: 'tCORE',
                                    symbol: 'tCORE',
                                    decimals: 18
                                },
                                rpcUrls: ['https://rpc.test2.btcs.network'],
                                blockExplorerUrls: ['https://scan.test2.btcs.network']
                            }]
                        });
                        // Try connecting again after switching network
                        await web3Manager.connect();
                        this.initialized = true;
                        await this.syncAchievements();
                    } catch (switchError) {
                        console.error('Failed to switch network:', switchError);
                        showError('Failed to switch to Core Testnet2. Please switch manually in MetaMask.');
                    }
                }
            } else {
                showError('Failed to connect to MetaMask. Please try again.');
            }
        }
    }

    private async syncAchievements() {
        if (!web3Manager.isConnected()) return;

        try {
            const silverEarned = await web3Manager.hasAchievement(BadgeType.SILVER);
            const goldEarned = await web3Manager.hasAchievement(BadgeType.GOLD);
            const platinumEarned = await web3Manager.hasAchievement(BadgeType.PLATINUM);

            Object.values(this.achievementState).forEach(achievement => {
                if (achievement.rarity === 'silver' && silverEarned) {
                    achievement.earned = true;
                } else if (achievement.rarity === 'gold' && goldEarned) {
                    achievement.earned = true;
                } else if (achievement.rarity === 'platinum' && platinumEarned) {
                    achievement.earned = true;
                }
            });
        } catch (error) {
            console.error('Error syncing achievements:', error);
            if (error instanceof Error) {
                showError(`Failed to sync achievements: ${error.message}`);
            }
        }
    }

    private getBadgeType(rarity: string): BadgeType {
        switch (rarity.toLowerCase()) {
            case 'silver': return BadgeType.SILVER;
            case 'gold': return BadgeType.GOLD;
            case 'platinum': return BadgeType.PLATINUM;
            default: throw new Error('Invalid badge type');
        }
    }

    async unlockAchievement(id: string) {
        const achievement = this.achievementState[id];
        if (!achievement || achievement.earned) return;

        achievement.earned = true;

        if (web3Manager.isConnected()) {
            try {
                const badgeType = this.getBadgeType(achievement.rarity);
                await web3Manager.mintAchievement(
                    badgeType,
                    achievement.name,
                    achievement.description
                );
                showSuccess(`Achievement Unlocked: ${achievement.name}! NFT has been minted to your wallet.`);
            } catch (error) {
                console.error('Error minting achievement NFT:', error);
                if (error instanceof Error) {
                    showError(`Failed to mint achievement NFT: ${error.message}`);
                }
                achievement.earned = false;
            }
        } else {
            showError('Connect MetaMask to Core Testnet2 to earn achievement NFTs!');
        }
    }

    getAchievement(id: string): Achievement | undefined {
        return this.achievementState[id];
    }

    getAllAchievements(): Achievement[] {
        return Object.values(this.achievementState);
    }
}

export const achievementManager = new AchievementManager();
