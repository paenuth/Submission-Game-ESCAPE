import { GameObjects, Scene } from "phaser";
import { web3Manager } from "../../web3";
import { achievementManager } from "../logic/PlayerAchievement";
import { showError } from "../utils/Notifications";

// This is basic button based on the Phaser textstyle.
export class UIButton extends GameObjects.Sprite {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        text: string,
        callback: () => void
    ) {
        super(scene, x, y, text);
        this.on("pointerdown", callback);
        scene.add.existing(this);
    }
}

export class WalletConnectButton extends GameObjects.Text {
    private isConnected: boolean = false;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "Connect Wallet", {
            fontFamily: 'Rubik Dirt',
            fontSize: 24,
            color: '#d3d3d3',
            stroke: '#000000',
            strokeThickness: 3
        });

        this.scene = scene;
        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.handleClick())
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
        this.checkConnection();
    }

    private async handleClick() {
        if (this.isConnected) return;

        try {
            await web3Manager.connect();
            await achievementManager.initialize();
            this.checkConnection();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            showError('Please install MetaMask and connect to Core Testnet2');
        }
    }

    private async checkConnection() {
        this.isConnected = web3Manager.isConnected();
        if (this.isConnected) {
            const account = web3Manager.getAccount();
            this.setText(`${account?.substring(0, 6)}...${account?.substring(38)}`);
            this.setColor('#90EE90'); // Light green for connected state
        }
    }
}

export class PlayButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "PLAY", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}

export class DashboardButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "DASHBOARD", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}

export class CreditsButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "© Escapicism", {
            fontFamily: 'Arial', fontSize: 24, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
                this.setStyle({ textDecoration: 'underline' });
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
                this.setStyle({ textDecoration: '' });
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}

export class BackButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "<<<", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}

export class RestartButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Restart", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}

export class MainMenuButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "Main Menu", {
            fontFamily: 'Rubik Dirt', fontSize: 48, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}

export class LevelSelectButton extends GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, callback: () => void) {
        super(scene, x, y, "<< Level Select", {
            fontFamily: 'Rubik Dirt', fontSize: 24, color: '#d3d3d3',
            stroke: '#000000', strokeThickness: 3
        });

        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.setTint(0xdedede);
                this.setStroke('000000', 5);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.setTint(0xffffff);
                this.setStroke('000000', 3);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, callback)     
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.setTint(0xffffff);
            });
        scene.add.existing(this);
    }
}
