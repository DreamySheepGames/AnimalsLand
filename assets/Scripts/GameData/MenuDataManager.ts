import { _decorator, Component, Node, RichText, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuDataManager')
export class MenuDataManager extends Component {
    @property(Label)
    private mainMenuDiamondText: Label;

    @property(RichText)
    private bonusShopDiamondText: RichText;

    @property(RichText)
    private iapShopDiamondText: RichText;

    start()
    {
        this.updateDiamondTexts();
    }

    public updateDiamondTexts()
    {
        this.mainMenuDiamondText.string = localStorage.getItem('receivedDiamonds');
        this.bonusShopDiamondText.string = localStorage.getItem('receivedDiamonds');
        this.iapShopDiamondText.string = localStorage.getItem('receivedDiamonds');
    }
}


