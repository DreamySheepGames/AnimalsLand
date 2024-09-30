import { _decorator, Component, Node, Slider, Toggle, RichText } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {MissionManager} from "db://assets/Scripts/GameData/MissionManager";
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static instance: GameManager;

    // create singleton
    public static get Instance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    @property(Slider)
    private musicSlider: Slider;

    @property(Slider)
    private sfxSlider: Slider;

    @property(Toggle)
    private vibrateToggle: Toggle;

    @property([Node])
    private reviveHearts: Node[] = [];

    @property(RichText)
    private missionLabel: RichText;

    private isEndless:boolean = true;
    private currentSavedHeartsCount: number;

    // data key
    private receivedDiamondsKey = "receivedDiamons";
    private revivedHeartsCountKey = "revivedHeartsCount";
    private magnetLevelKey = "magnetLevel";
    private freezerLevelKey = "freezerLevel";
    private slowdownLevelKey = "slowdownLevel";
    private doubleLevelKey = "doubleLevel";
    private superHeroLevelKey = "superHeroLevel";
    private itemKeys: string[] = [this.magnetLevelKey, this.freezerLevelKey, this.slowdownLevelKey, this.doubleLevelKey, this.superHeroLevelKey];

    // play mode getter and setter
    public get isEndlessMode(): boolean {
        return this.isEndless;
    }

    public set isEndlessMode(value: boolean) {
        this.isEndless = value;
    }

    onLoad()
    {
        // generate revive hearts, data, mission
        this.reviveHeartsDataLoading();
        this.itemDataLoading();
        MissionManager.getInstance().generateMission();

        CharacterData.getInstance().onLoad();

        this.musicSlider.progress = SettingsData.getInstance().MusicVol;
        this.sfxSlider.progress = SettingsData.getInstance().SfxVol;
        this.vibrateToggle.isChecked = SettingsData.getInstance().IsVibrate;
    }

    start()
    {
        EndlessGameData.getInstance().checkSpinWheelDoubleStatus();
        this.updateReviveHeartsLayout();
        this.updateReceivedDiamond();
        this.updateMissionLabel();
    }

    reviveHeartsDataLoading()
    {
        // Retrieve the current saved hearts from localStorage, if any
        const savedDiamonds = localStorage.getItem(this.revivedHeartsCountKey);

        // Convert the saved value to a number, defaulting to 3 if it's null
        this.currentSavedHeartsCount = savedDiamonds ? parseInt(savedDiamonds, 10) : 3;
        if (this.currentSavedHeartsCount > 5)
            this.currentSavedHeartsCount = 5;

        EndlessGameData.getInstance().ReviveHearts = this.currentSavedHeartsCount;

        // Save the updated total back to localStorage
        localStorage.setItem(this.revivedHeartsCountKey, this.currentSavedHeartsCount.toString());

        // testing, not important
        // let testSet: number = 3;
        // localStorage.setItem('revivedHeartsCount', testSet.toString());
    }

    updateReviveHeartsLayout()      // update hearts layout in main menu
    {
        for (let i = 0; i < 5; i++)
        {
            this.reviveHearts[i].active = i < parseInt(localStorage.getItem(this.revivedHeartsCountKey), 10) ? true : false;
        }
    }

    itemDataLoading()
    {
        for (let i = 0; i < this.itemKeys.length; i++)
        {
            // Retrieve the current saved hearts from localStorage, if any
            const savedItemData = localStorage.getItem(this.itemKeys[i]);

            // Convert the saved value to a number, defaulting to 3 if it's null
            let currentSavedItemData = savedItemData ? parseInt(savedItemData, 10) : 0;
            if (currentSavedItemData > 3)
                currentSavedItemData = 3;

            // use switch i here
            switch (i) {
                case 0:
                    EndlessGameData.getInstance().MagnetLevel = currentSavedItemData;
                    break;
                case 1:
                    EndlessGameData.getInstance().FreezerLevel = currentSavedItemData;
                    break;
                case 2:
                    EndlessGameData.getInstance().SlowdownLevel = currentSavedItemData;
                    break;
                case 3:
                    EndlessGameData.getInstance().DoubleLevel = currentSavedItemData;
                    break;
                case 4:
                    EndlessGameData.getInstance().SuperHeroLevel = currentSavedItemData;
                    break;
            }

            // Save the updated total back to localStorage
            localStorage.setItem(this.itemKeys[i], currentSavedItemData.toString());

            // testing, not important
            EndlessGameData.getInstance().MagnetLevel = 0;
            EndlessGameData.getInstance().FreezerLevel = 0;
            EndlessGameData.getInstance().SlowdownLevel = 0;
            EndlessGameData.getInstance().DoubleLevel = 0;
            EndlessGameData.getInstance().SuperHeroLevel = 0;

            let zero = 0;
            localStorage.setItem(this.magnetLevelKey, zero.toString())
            localStorage.setItem(this.freezerLevelKey, zero.toString())
            localStorage.setItem(this.slowdownLevelKey, zero.toString())
            localStorage.setItem(this.doubleLevelKey, zero.toString())
            localStorage.setItem(this.superHeroLevelKey, zero.toString())

        }
    }

    updateReceivedDiamond()
    {
        const receivedDiamonds = localStorage.getItem(this.receivedDiamondsKey);
        let currentSavedDiamondCount = receivedDiamonds ? parseInt(receivedDiamonds, 10) : 0;
        localStorage.setItem("receivedDiamonds", currentSavedDiamondCount.toString());

        // test, not importatnt
        const money = 10000;
        localStorage.setItem("receivedDiamonds", money.toString());
    }

    updateMissionLabel()
    {
        let currentMission = localStorage.getItem("currentMission");

        switch (currentMission)
        {
            case "missionGetDiamond":
                let diamondMissions = JSON.parse(localStorage.getItem("missionGetDiamond"));
                this.missionLabel.string = "collect " + diamondMissions[0].toString() + " crystals";
                break;
            case "missionScoreNoBump":
                let scoreMissions = JSON.parse(localStorage.getItem("missionScoreNoBump"));
                this.missionLabel.string = scoreMissions[0].toString() + " points without bump";
                break;
            default:
                this.missionLabel.string = "no mission found...";
                break;
        }
    }
}