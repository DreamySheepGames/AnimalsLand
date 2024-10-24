import { _decorator, Component, Node, UITransform, tween, Size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TransitionCanvasController')
export class TransitionCanvasController extends Component {
    @property private transitionDuration: number = 4;     // transition will happen in x seconds

    @property(Node)
    private canvas: Node;

    @property(Node)
    private loadingLabel: Node;

    get TransitionDuration(): number {return this.transitionDuration;}
    set TransitionDuration(value: number) {this.transitionDuration = value;}

    private isInTransition: boolean;
    private isOutTransition: boolean;

    onLoad() {
        this.isInTransition = false;        // anti spam "in" or "out" anim
        this.isOutTransition = false;
    }

    start() {
        this.inTransition();
    }

    public inTransition() {
        if (this.canvas) {
            this.node.setSiblingIndex(this.canvas.children.length - 1); // Move to the last child
        }

        const uiTransform = this.node.getComponent(UITransform);

        if (uiTransform && !this.isInTransition) {
            this.isInTransition = true;

            // Start the tween to modify the content size from (0, 0) to (1200, 1200)
            tween(uiTransform)
                .to(this.transitionDuration, { contentSize: new Size(1300, 1500) })
                .start();
        }
    }

    public outTransition() {
        if (this.canvas) {
            this.node.setSiblingIndex(this.canvas.children.length - 1); // Move to the last child
        }

        const uiTransform = this.node.getComponent(UITransform);

        if (uiTransform && !this.isOutTransition) {
            this.isOutTransition = true;
            tween(uiTransform)
                .to(this.transitionDuration, { contentSize: new Size(0, 0) })
                .call(() => {
                    if (this.loadingLabel)
                        this.loadingLabel.active = true;
                })
                .start();
        }
    }
}
