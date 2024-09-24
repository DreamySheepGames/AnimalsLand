import { _decorator, Component, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuDataManager')
export class MenuDataManager extends Component {
    @property(RichText)
    private mainMenuDiamondText: RichText;

    @property(RichText)
    private bonusShopDiamondText: RichText;

    @property(RichText)
    private iapShopDiamondText: RichText;

    onLoad()
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


