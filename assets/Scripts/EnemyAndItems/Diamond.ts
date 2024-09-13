import { _decorator, Component, Node, Label } from 'cc';
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
const { ccclass, property } = _decorator;

@ccclass('Diamond')
export class Diamond extends Component {
    @property(Label)
    private valueLabel: Label;

    private value: number;
    private currentStage: number;
    private stage2MinValue: number = 8;
    private stage2MaxValue: number = 10;
    private stage3MinValue: number = 15;
    private stage3MaxValue: number = 20;
    private stage4MinValue: number = 25;
    private stage4MaxValue: number = 30;
    private stage5MinValue: number = 35;
    private stage5MaxValue: number = 40;

    get Value(): number {
        return this.value;
    }

    start()
    {
        this.currentStage = EndlessGameManager.Instance.CurrentStage;

        this.assignDiamondValue();
    }

    assignDiamondValue()
    {
        switch (this.currentStage)
        {
            case 1:
                break;
            case 2:
                this.value = Math.floor(Math.random() * (++this.stage2MaxValue - this.stage2MinValue) + this.stage2MinValue);
                break;
            case 3:
                this.value = Math.floor(Math.random() * (++this.stage3MaxValue - this.stage3MinValue) + this.stage3MinValue);
                break;
            case 4:
                this.value = Math.floor(Math.random() * (++this.stage4MaxValue - this.stage4MinValue) + this.stage4MinValue);
                break;
            default:
                this.value = Math.floor(Math.random() * (++this.stage5MaxValue - this.stage5MinValue) + this.stage5MinValue);
                break;
        }

        this.valueLabel.string = this.value.toString();
    }
}


