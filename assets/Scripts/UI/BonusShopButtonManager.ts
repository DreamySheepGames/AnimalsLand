import { _decorator, Component, Node, Event, RichText } from 'cc';
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {MenuDataManager} from "db://assets/Scripts/GameData/MenuDataManager";
const { ccclass, property } = _decorator;

@ccclass('BonusShopButtonManager')
export class BonusShopButtonManager extends Component {
    // @property item name
    @property(RichText) private magnetName: RichText;
    @property(RichText) private freezerName: RichText;
    @property(RichText) private slowdownName: RichText;
    @property(RichText) private doubleName: RichText;
    @property(RichText) private superHeroName: RichText;

    @property(Node) private buttonMagnet: Node;
    @property(Node) private buttonFreezer: Node;
    @property(Node) private buttonSlowdown: Node;
    @property(Node) private buttonDouble: Node;
    @property(Node) private buttonSuperHero: Node;

    @property(Node) private tickMagnet: Node;
    @property(Node) private tickFreezer: Node;
    @property(Node) private tickSlowdown: Node;
    @property(Node) private tickDouble: Node;
    @property(Node) private tickSuperHero: Node;

    @property(RichText) private priceMagnet: RichText;
    @property(RichText) private priceFreezer: RichText;
    @property(RichText) private priceSlowdown: RichText;
    @property(RichText) private priceDouble: RichText;
    @property(RichText) private priceSuperHero: RichText;

    @property(RichText) private playerDiamond: RichText;
    @property(RichText) private menuDiamondCount: RichText;

    // @property layout to turn off button, turn on tick icon

    private magnetLevelKey: string = "magnetLevel";
    private freezerLevelKey: string = "freezerLevel";
    private slowdownLevelKey: string = "slowdownLevel";
    private doubleLevelKey: string = "doubleLevel";
    private superHeroLevelKey: string = "superHeroLevel";

    start()
    {
        this.updateItemName();
        this.updatePrices();
    }

    public incrementItemLevel(event: Event, CustomEventData)
    {
        const buttonNode = event.currentTarget as Node; // Get the button node

        switch (CustomEventData) {
            case "magnet":
                this.incrementLevel(this.magnetLevelKey);
                break;
            case "freezer":
                this.incrementLevel(this.freezerLevelKey);
                break;
            case "slowdown":
                this.incrementLevel(this.slowdownLevelKey);
                break;
            case "double":
                this.incrementLevel(this.doubleLevelKey);
                break;
            case "superHero":
                this.incrementLevel(this.superHeroLevelKey);
                break;
        }

    }

    incrementLevel(dataKey: string)
    {
        // read the level of the item
        let savedDataValue = parseInt(localStorage.getItem(dataKey), 10);

        // pay the price based on the level of that item
        // get the resource of the player
        let playerResource = parseInt(localStorage.getItem('receivedDiamonds'), 10);

        if (playerResource - EndlessGameData.getInstance().ItemPrices[savedDataValue] >= 0)
        {
            // pay
            playerResource -= EndlessGameData.getInstance().ItemPrices[savedDataValue];
            // safe the resource and update new resource string
            localStorage.setItem('receivedDiamonds', playerResource.toString());
            this.playerDiamond.string = playerResource.toString();

            if (this.menuDiamondCount)
                this.menuDiamondCount.string = playerResource.toString();

            if (savedDataValue < 3)
            {
                savedDataValue += 1;
                EndlessGameData.getInstance().updateItemLevels();
                localStorage.setItem(dataKey, savedDataValue.toString());
            }
            // change the name of the item
            this.updateItemName();
            this.updatePrices();
        }
    }

    updateItemName()
    {
        if (parseInt(localStorage.getItem("magnetLevel")) < 3) {
            this.magnetName.string = "Magnet lv: " + (parseInt(localStorage.getItem("magnetLevel")) + 1).toString();
            this.TickIconOff(this.tickMagnet, this.buttonMagnet);
        }
        else {
            this.magnetName.string = "Magnet lv: 3";
            this.TickIconOn(this.tickMagnet, this.buttonMagnet);
        }

        if (parseInt(localStorage.getItem("freezerLevel")) < 3) {
            this.freezerName.string = "Freezer lv: " + (parseInt(localStorage.getItem("freezerLevel")) + 1).toString();
            this.TickIconOff(this.tickFreezer, this.buttonFreezer);
        }
        else {
            this.freezerName.string = "Freezer lv: 3";
            this.TickIconOn(this.tickFreezer, this.buttonFreezer);
        }

        if (parseInt(localStorage.getItem("slowdownLevel")) < 3) {
            this.slowdownName.string = "Slowdown lv: " + (parseInt(localStorage.getItem("slowdownLevel")) + 1).toString();
            this.TickIconOff(this.tickSlowdown, this.buttonSlowdown);
        }
        else {
            this.slowdownName.string = "Slowdown lv: 3";
            this.TickIconOn(this.tickSlowdown, this.buttonSlowdown);
        }

        if (parseInt(localStorage.getItem("doubleLevel")) < 3) {
            this.doubleName.string = "Double lv: " + (parseInt(localStorage.getItem("doubleLevel")) + 1).toString();
            this.TickIconOff(this.tickDouble, this.buttonDouble);
        }
        else {
            this.doubleName.string = "Double lv: 3";
            this.TickIconOn(this.tickDouble, this.buttonDouble);
        }

        if (parseInt(localStorage.getItem("superHeroLevel")) < 3) {
            this.superHeroName.string = "Super Hero lv: " + (parseInt(localStorage.getItem("superHeroLevel")) + 1).toString();
            this.TickIconOff(this.tickSuperHero, this.buttonSuperHero);
        }
        else {
            this.superHeroName.string = "Super Hero lv: 3";
            this.TickIconOn(this.tickSuperHero, this.buttonSuperHero);
        }
    }

    updatePrices()
    {
        if (parseInt(localStorage.getItem("magnetLevel")) < 3)
            this.priceMagnet.string = EndlessGameData.getInstance().ItemPrices[parseInt(localStorage.getItem("magnetLevel"),10)].toString();
        if (parseInt(localStorage.getItem("freezerLevel")) < 3)
            this.priceFreezer.string = EndlessGameData.getInstance().ItemPrices[parseInt(localStorage.getItem("freezerLevel"),10)].toString();
        if (parseInt(localStorage.getItem("slowdownLevel")) < 3)
            this.priceSlowdown.string = EndlessGameData.getInstance().ItemPrices[parseInt(localStorage.getItem("slowdownLevel"),10)].toString();
        if (parseInt(localStorage.getItem("doubleLevel")) < 3)
            this.priceDouble.string = EndlessGameData.getInstance().ItemPrices[parseInt(localStorage.getItem("doubleLevel"),10)].toString();
        if (parseInt(localStorage.getItem("superHeroLevel")) < 3)
            this.priceSuperHero.string = EndlessGameData.getInstance().ItemPrices[parseInt(localStorage.getItem("superHeroLevel"),10)].toString();
    }

    TickIconOn(tick: Node, button: Node) {
        tick.active = true;
        button.active = false;
    }

    TickIconOff(tick: Node, button: Node) {
        tick.active = false;
        button.active = true;
    }
}


