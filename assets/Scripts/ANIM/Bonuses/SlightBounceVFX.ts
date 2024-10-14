import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SlightBounceVFX')
export class SlightBounceVFX extends Component {
    @property private scaleUp: number = 1;    // Scale when fully expanded
    @property private scaleDown: number = 0.9; // Scale when shrunk
    @property private tweenDuration: number = 0.5; // Duration for each tween

    start() {
        this.playBounceVFX();
    }

    playBounceVFX() {
        // Repeat the scale up and down effect using an infinite tween loop
        tween(this.node)
            .to(this.tweenDuration, { scale: new Vec3(this.scaleUp, this.scaleUp, this.scaleUp) }, { easing: 'sineOut' })
            .to(this.tweenDuration, { scale: new Vec3(this.scaleDown, this.scaleDown, this.scaleDown) }, { easing: 'sineIn' })
            .union() // Combine both tweens into a sequence
            .repeatForever() // Repeat the sequence infinitely
            .start();
    }
}
