export class NotificationManager {
    private static gameScene: Phaser.Scene | null = null;

    static init(scene: Phaser.Scene) {
        this.gameScene = scene;
    }

    static show(message: string, isError: boolean = false) {
        if (!this.gameScene) return;

        const style = {
            fontFamily: 'Arial',
            fontSize: '18px',
            backgroundColor: isError ? '#ff4444' : '#44ff44',
            color: '#ffffff',
            padding: { x: 16, y: 8 },
            borderRadius: 8,
            wordWrap: { width: 300 }
        };

        const text = this.gameScene.add.text(
            this.gameScene.cameras.main.centerX,
            50,
            message,
            style as Phaser.Types.GameObjects.Text.TextStyle
        );
        text.setOrigin(0.5);
        text.setDepth(1000);

        this.gameScene.tweens.add({
            targets: text,
            alpha: 0,
            y: 30,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => {
                text.destroy();
            }
        });
    }
}

export const showSuccess = (message: string) => NotificationManager.show(message, false);
export const showError = (message: string) => NotificationManager.show(message, true);