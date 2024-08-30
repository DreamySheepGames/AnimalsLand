import { _decorator, Component, Node, input, Input, EventTouch, EventKeyboard, KeyCode, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property private speed: number = 100; // Adjust the default speed value as needed

    private inputAxis: number = 0;

    start() {
        // Register input event listeners
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    update(deltaTime: number) {
        // Move left and right based on input
        let movement = this.inputAxis * this.speed * deltaTime;
        this.node.setPosition(this.node.position.x + movement, this.node.position.y);
    }

    onDestroy() {
        // Unregister input event listeners
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onTouchStart(event: EventTouch) {
        console.log(event.getLocation());  // location on screen space
        //console.log(event.getUILocation());  // location on UI space
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.inputAxis = -1;
                log('Left arrow pressed');
                break;
            case KeyCode.ARROW_RIGHT:
                this.inputAxis = 1;
                log('Right arrow pressed');
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_RIGHT:
                this.inputAxis = 0;
                console.log('Arrow key released');
                break;
        }
    }
}
