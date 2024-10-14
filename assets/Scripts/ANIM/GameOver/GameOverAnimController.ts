import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverAnimController')
export class GameOverAnimController extends Component {
    private spineComponent: sp.Skeleton = null;

    start() {
        this.spineComponent = this.node.getComponent(sp.Skeleton);

        // Play the "start" animation first
        this.spineComponent.setAnimation(0, "start", false); // 'false' means it's not looping

        // Listen for the completion of the 'start' animation
        this.spineComponent.setCompleteListener(() => {
            // After "start" animation finishes, play the "loop" animation
            this.spineComponent.setAnimation(0, "loop", true); // 'true' means it will loop
        });
    }
}


