import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { CreditsButton, DashboardButton, PlayButton, WalletConnectButton } from "../UIComponents/UIButton";
import { NotificationManager } from "../utils/Notifications";

export class MainMenu extends Scene {
    logo: GameObjects.Image;

    constructor() {
        super("MainMenu");
    }

    create() {
        // Initialize notification system
        NotificationManager.init(this);

        // Add wallet connect button
        new WalletConnectButton(this, 512, 50);

        this.logo = this.add.image(512, 250, "escape").setOrigin(0.5).setDepth(100).setScale(0.7);

        new PlayButton(this, 512, 450, () => {
            this.changeScene("LevelSelection");
        }).setOrigin(0.5);

        new DashboardButton(this, 512, 550, () => {
            // Open player dashboard in a new window
            window.open('http://localhost:3000', '_blank');
        }).setOrigin(0.5);

        new CreditsButton(this, 1020, 760, () => {
            this.changeScene("Credits");
        }).setOrigin(1);
    
        EventBus.emit("current-scene-ready", this);
    }

    changeScene(scene?: string) {
        this.scene.start(scene ?? "MainMenu");
    }
}
