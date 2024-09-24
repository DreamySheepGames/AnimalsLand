import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import {MenuDataManager} from "db://assets/Scripts/GameData/MenuDataManager";
const { ccclass, property } = _decorator;

@ccclass('SpinWheel')
export class SpinWheel extends Component {
    @property(Node)
    private wheel: Node;

    @property(MenuDataManager)
    private menuDataManager: MenuDataManager;

    private smallDiamondPackage: number = 500;
    private mediumDiamondPackage: number = 1000;
    private hugeDiamondPackage: number = 5000;

    onEnable()
    {
        // Reset the wheel's angle back to 0
        this.wheel.setRotationFromEuler(0, 0, 0);
    }

    public spin() {
        // Generate a random number between 0 and 7
        const randomStop = Math.floor(Math.random() * 8);

        // Calculate the target rotation angle (360 + 45 * randomStop)
        const targetAngle = 720 + 45 * randomStop;

        // Create a tween to spin the wheel to the target angle over 2 seconds
        tween(this.wheel)
            .to(2, { eulerAngles: new Vec3(0, 0, -targetAngle) }, { easing: 'cubicOut' }) // Spin counter-clockwise
            .call(() => {
                this.prize(randomStop);
            })
            .start();
    }

    private prize(prizeIndex: number)
    {
        switch (prizeIndex)
        {
            case 0:     // small diamond package
                this.saveReceivedDiamond(this.smallDiamondPackage);
                break;

            case 1:     // unlock premium character 1

                break;

            case 2:     // +1 heart

                break;

            case 3:     // unlock premium character 2

                break;

            case 4:     // huge diamond package
                this.saveReceivedDiamond(this.hugeDiamondPackage);
                break;

            case 5:     // unlock premium character 3

                break;

            case 6:     // medium premium character 3
                this.saveReceivedDiamond(this.mediumDiamondPackage);
                break;

            case 7:     // double received diamond

                break;

        }
    }

    saveReceivedDiamond(receivedDiamond: number) {
        // Retrieve the current saved diamonds from localStorage, if any
        const savedDiamonds = localStorage.getItem('receivedDiamonds');

        // Convert the saved value to a number, defaulting to 0 if it's null
        const currentSavedDiamonds = savedDiamonds ? parseInt(savedDiamonds, 10) : 0;

        // Add the current ReceivedDiamond value to the saved value
        const updatedDiamonds = currentSavedDiamonds + receivedDiamond;

        // Save the updated total back to localStorage
        localStorage.setItem('receivedDiamonds', updatedDiamonds.toString());

        this.menuDataManager.updateDiamondTexts();
    }
}
