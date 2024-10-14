import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpinVFX')
export class SpinVFX extends Component {
    @property
    private spinDuration: number = 4;

    @property
    private clockWise: boolean = false;

    start() {
        this.startSpin();
    }

    private startSpin() {
        const rotationAngle = this.clockWise ? -360 : 360;

        // Create a loop to rotate the node 360 degrees with a linear easing
        tween(this.node)
            .repeatForever(
                tween()
                    .to(this.spinDuration, { eulerAngles: new Vec3(0, 0, rotationAngle) }, { easing: 'linear' })
                    .set({ eulerAngles: new Vec3(0, 0, 0) })  // Reset rotation for continuous spin
            )
            .start();
    }
}
