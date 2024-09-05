import { _decorator, Component, Node, input, Input, EventTouch} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property private speed: number = 100; // Adjust the default speed value as needed

    private inputAxis: number = 0;

    start() {
        // Register input event listeners
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    update(deltaTime: number) {
        // Move left and right based on input
        let movement = this.inputAxis * this.speed * deltaTime;
        this.node.setPosition(this.node.position.x + movement, this.node.position.y);
    }

    onDestroy() {
        // Unregister input event listeners
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onTouchStart(event: EventTouch) {

    }
}
