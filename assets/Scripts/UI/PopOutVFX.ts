import { _decorator, Component, Node, tween, Vec3, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopOutVFX')
export class PopOutVFX extends Component {
    @property private pauseBeforePopOut: number = 0.01;
    @property private popOutDuration: number = 0.4;

    onLoad() {
        //this.node.getComponent(Sprite).active = false;
        this.node.setScale(0, 0);
    }

    start() {
        this.scheduleOnce(() => this.popOut(), this.pauseBeforePopOut);
    }

    popOut() {
        //this.node.active = true;
        tween(this.node)
            .to(this.popOutDuration, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }
}


