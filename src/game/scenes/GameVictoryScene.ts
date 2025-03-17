import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { levelObjectives } from "../logic/LevelObjectives";
import { DashboardButton, LevelSelectButton } from "../UIComponents/UIButton";
import { achievementManager } from "../logic/PlayerAchievement";
import { NotificationManager, showError } from "../utils/Notifications";
import { web3Manager } from "../../web3";

interface PlayerStats {
    enemiesDefeated: number;
    currentHealth: number;
    maxHealth: number;
    hitsTaken: number;
}

export class GameVictory extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    back: Phaser.GameObjects.Text;
    next: Phaser.GameObjects.Text;
    playerStats: PlayerStats;

    constructor() {
        super("GameVictory");
    }

    preload() {
        this.load.image("complete", "assets/hex-c.png");
        this.load.image("fail", "assets/hex-inc2.png");
    }

    private async checkAndUnlockAchievements(stats: PlayerStats) {
        try {
            // Initialize achievement manager first
            await achievementManager.initialize();
            
            // Check defeat5Enemies achievement
            if (stats.enemiesDefeated >= 5) {
                await achievementManager.unlockAchievement('defeat5Enemies');
            }

            // Check defeat10Enemies achievement
            if (stats.enemiesDefeated >= 10) {
                await achievementManager.unlockAchievement('defeat10Enemies');
            }

            // Check mvPlayer achievement (75% health)
            if (stats.enemiesDefeated >= 10 && (stats.currentHealth / stats.maxHealth >= 0.75)) {
                await achievementManager.unlockAchievement('mvPlayer');
            }

            // Check opPlayer achievement (no damage)
            if (stats.enemiesDefeated >= 10 && stats.hitsTaken === 0) {
                await achievementManager.unlockAchievement('opPlayer');
            }

            // If achievements were earned but wallet not connected, show notification
            if (stats.enemiesDefeated >= 5 && !web3Manager.isConnected()) {
                showError('Connect MetaMask to Core Testnet2 to earn achievement NFTs!');
            }
        } catch (error) {
            console.error('Error unlocking achievements:', error);
        }
    }

    displayVictory(levelKey: string, playerStats: PlayerStats): void {
        const levelData = levelObjectives[levelKey];
        if (!levelData) {
            console.error("Level data not found for:", levelKey);
            return;
        }

        const completedObjectives = this.checkObjectives(levelKey, playerStats);
        
        // Check achievements after completing objectives
        this.checkAndUnlockAchievements(playerStats);

        console.log(`Victory! Level: ${levelData.name}`);
        console.log("Objectives:");

        let yOffset = 270;
        const xOffset = 150;

        levelData.stars.forEach((star, index) => {
            const completed = completedObjectives[index];
            const statusText = `  ${star.objective} `;

            this.add
                .text(xOffset, yOffset - 8, statusText, {
                    fontFamily: "Rubik Dirt",
                    fontSize: 32,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "left",
                })
                .setOrigin(0)
                .setDepth(100);

            // Add completion status image
            this.add
                .image(xOffset - 15, yOffset + 15, completed ? "complete" : "fail")
                .setOrigin(0.5)
                .setDepth(100)
                .setScale(0.07);

            yOffset += 50;
        });
    }

    private checkObjectives(
        levelKey: string,
        playerStats: PlayerStats
    ): boolean[] {
        const levelData = levelObjectives[levelKey];
        const completedObjectives: boolean[] = [];

        if (!levelData) return [];

        levelData.stars.forEach((star, index) => {
            let completed = false;
            if (star.objective === "Defeat 10 enemies") {
                completed = playerStats.enemiesDefeated >= 10;
            } else if (star.objective === "Defeat 5 enemies") {
                completed = playerStats.enemiesDefeated >= 5;
            } else if (
                star.objective === "Complete the stage with 25% health or above"
            ) {
                completed =
                    playerStats.currentHealth / playerStats.maxHealth >= 0.25;
            }
            levelData.stars[index].completed = completed;
            completedObjectives.push(completed);
        });

        return completedObjectives;
    }

    create(data: { levelKey: string; playerStats: PlayerStats }): void {
        // Initialize notification manager
        NotificationManager.init(this);

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(512, 150, "Victory", {
                fontFamily: "Rubik Dirt",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);

        if (data && data.levelKey && data.playerStats) {
            this.displayVictory(data.levelKey, data.playerStats);
        } else {
            console.error("Level key or player stats not provided.");
        }

        new LevelSelectButton(this, 220, 550, () => {
            this.changeScene("LevelSelection");
        }).setOrigin(0.5);

        this.next = this.add
            .text(850, 550, "Next Level >>", {
                fontFamily: "Rubik Dirt",
                fontSize: 24,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        new DashboardButton(this, 512, 625, () => {
            // Open player dashboard in new window
            window.open('http://localhost:3000', '_blank');
        }).setOrigin(0.5).setScale(0.5);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }
}