import { useEffect } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Achievement } from "./game/logic/PlayerAchievement";
import { EventBus } from "./game/EventBus";

function ToastNotifications() {
    useEffect(() => {
        // Take the achievement event to auto-mint the badge once the achievement is unlocked

        const handleAchievement = async (achievement: Achievement) => {
            console.log(achievement.badge);
            
            // Initialize achievement manager and attempt to mint
            const { achievementManager } = await import('./game/logic/PlayerAchievement');
            await achievementManager.initialize();
            await achievementManager.unlockAchievement(achievement.id);

            toast(
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={`./assets/badges/${achievement.badge}-badge.png`} // Adjust the path to your image
                        style={{
                            width: "70px",
                            height: "70px",
                            margin: 0,
                            paddingRight: 20
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong>{achievement.name}</strong>
                        <p style={{ margin: 0, paddingBottom: 10 }}>"{achievement.description}"</p>
                        <p style={{ margin: 0, fontStyle: "italic", fontSize: 12 }}>Check your dashboard</p>
                    </div>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                    theme: "light",
                    style: { width: "300px" },
                    transition: Slide,
                    rtl: false,            
                }
            );
        };

        EventBus.on("achievementUnlocked", handleAchievement);

        return () => {
            EventBus.off("achievementUnlocked", handleAchievement);
        };
    }, []);

    return <ToastContainer />;
}

export default ToastNotifications;
