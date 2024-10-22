import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CheatController')
export class CheatController extends Component {
    @property(Label)
    private flowerLabel: Label;

    private receivedDiamondsKey = "receivedDiamonds";
    private revivedHeartsCountKey = "revivedHeartsCount";
    private magnetLevelKey = "magnetLevel";
    private freezerLevelKey = "freezerLevel";
    private slowdownLevelKey = "slowdownLevel";
    private doubleLevelKey = "doubleLevel";
    private superHeroLevelKey = "superHeroLevel";

    public resetItemsLevel() {
        let zero = 0;
        localStorage.setItem(this.magnetLevelKey, zero.toString())
        localStorage.setItem(this.freezerLevelKey, zero.toString())
        localStorage.setItem(this.slowdownLevelKey, zero.toString())
        localStorage.setItem(this.doubleLevelKey, zero.toString())
        localStorage.setItem(this.superHeroLevelKey, zero.toString())
    }

    public addFlowers() {
        let money = parseInt(localStorage.getItem(this.receivedDiamondsKey));
        money += 1000;
        this.flowerLabel.string = money.toString();
        localStorage.setItem(this.receivedDiamondsKey, money.toString());
    }
}


