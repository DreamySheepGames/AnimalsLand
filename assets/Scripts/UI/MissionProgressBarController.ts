import { _decorator, Component, Node, Slider, UITransform, tween, Vec3 } from 'cc';
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {MissionManager} from "db://assets/Scripts/GameData/MissionManager";
const { ccclass, property } = _decorator;

@ccclass('MissionProgressBarController')
export class MissionProgressBarController extends Component {
    @property({ type: Slider })
    private slider: Slider = null;

    @property({ type: Node })
    private fillNode: Node = null;

    start()
    {
        this.updateFill();
    }

    public updateFill() {
        const currentMission = localStorage.getItem("currentMission");
        let progressValue = 0;

        switch (currentMission) {
            case "missionGetDiamond":
                let currentDiamondProgress = EndlessGameManager.Instance.MissionGetDiamond;
                const diamondMissions = JSON.parse(localStorage.getItem(currentMission));
                const targetDiamondProgress = diamondMissions[0];
                progressValue = currentDiamondProgress / targetDiamondProgress;
                break;

            case "missionScoreNoBump":
                let currentProgress = EndlessGameManager.Instance.MissionScoreWithoutBump;
                const scoreNoBumpMissions = JSON.parse(localStorage.getItem(currentMission));
                const targetScoreProgress = scoreNoBumpMissions[0];
                progressValue = currentProgress / targetScoreProgress;
                break;
        }

        const fillTransform = this.fillNode.getComponent(UITransform);
        const barTransform = this.slider.node.getComponent(UITransform);

        // Update the fill width based on the slider's progress
        fillTransform.width = barTransform.width * progressValue;
    }

    public resetProgressBarFiller()
    {
        this.fillNode.getComponent(UITransform).width = 0;
    }
}


