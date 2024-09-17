import { _decorator, Component, Node, Vec3, tween } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
const { ccclass, property } = _decorator;

@ccclass('InvincibleMeterController')
export class InvincibleMeterController extends Component {

    @property(Node)
    invincibleFiller: Node;

    @property({type: PlayerController})
    playerController: PlayerController;

    private fillingStep = 2;
    private currentStep = 0;
    private meterTweenDuration = 0.25;
    private fillerTweenDuration = 0.25;
    private invincibleDuration = 4;

    start() {
        this.node.setScale(0, 0);
        this.invincibleFiller.setScale(0, 0, 0);
    }

    public increaseFiller()
    {
        this.currentStep++;

        // if invincible meter scale isn't 1 than tween the scale to 1, else do nothing
        if (this.node.getScale() != new Vec3(1, 1, 1))
        {
            tween(this.node)
                .to(this.meterTweenDuration, { scale: new Vec3(1, 1, 1) })
                .start();
        }

        // get scale value then increase the vaue
        let fillerScaleX = this.invincibleFiller.getScale().x + 1/this.fillingStep;
        let fillerScaleY = this.invincibleFiller.getScale().y + 1/this.fillingStep;
        let fillerScaleZ = this.invincibleFiller.getScale().z + 1/this.fillingStep;

        if (fillerScaleX > 1 || fillerScaleY > 1 || fillerScaleZ > 1)
        {
            fillerScaleX = fillerScaleY = fillerScaleZ = 1;
        }

        // set scale value
        let scaleValue = new Vec3 (fillerScaleX, fillerScaleY, fillerScaleZ);

        // tween the scale of the filler
        tween(this.invincibleFiller)
            .to(this.fillerTweenDuration, { scale: scaleValue })
            .call(() => {
                // turn on the invincible ability
                if (this.currentStep == this.fillingStep)
                    this.turnOnInvincible();
                else        // patch invincible bug (meter hasn't done tweening but current step = 0)
                {
                    if (this.currentStep == 0)
                        this.decreaseFillerNoCurrentStep();
                }
            })
            .start();
    }

    decreaseFiller()
    {
        this.currentStep = 0;

        if (this.node.getScale() != new Vec3(0, 0, 0))
        {
            tween(this.node)
                .to(this.meterTweenDuration, { scale: new Vec3(0, 0, 0) })
                .start();

            tween(this.invincibleFiller)
                .to(this.fillerTweenDuration, { scale: new Vec3(0, 0, 0) })
                .start();
        }
    }

    decreaseFillerNoCurrentStep()
    {
        if (this.node.getScale() != new Vec3(0, 0, 0))
        {
            tween(this.node)
                .to(this.meterTweenDuration, { scale: new Vec3(0, 0, 0) })
                .start();

            tween(this.invincibleFiller)
                .to(this.fillerTweenDuration, { scale: new Vec3(0, 0, 0) })
                .start();
        }
    }

    turnOnInvincible()
    {
        // turn on invincibility
        this.playerController.turnOnInvincible();

        tween(this.invincibleFiller)
            .to(this.invincibleDuration, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                tween(this.node)
                    .to(this.meterTweenDuration, { scale: new Vec3(0, 0, 0) })
                    .call(() => {
                        // turn off invincibility after assigned duration
                        this.playerController.turnOffInvincible();
                        this.currentStep = 0;
                    })
                    .start();
            })
            .start();
    }
}


