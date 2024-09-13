import { _decorator, Component, Node, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpinSprite')
export class SpinSprite extends Component {

    private spinForceMin: number = -10;
    private spinForceMax: number = 10;

    start() {
        var spinForce = Math.random() * (this.spinForceMax - this.spinForceMin) + this.spinForceMin;
        this.getComponent(RigidBody2D).angularVelocity = spinForce;
    }
}


