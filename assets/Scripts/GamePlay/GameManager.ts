import { _decorator, Component, Node, Slider, Toggle } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static instance: GameManager;

    @property(Slider)
    private musicSlider: Slider;

    @property(Slider)
    private sfxSlider: Slider;

    @property(Toggle)
    private vibrateToggle: Toggle;

    @property([Node])
    private reviveHearts: Node[] = [];

    private isEndless:boolean = true;
    private currentSavedHeartsCount: number;

    // create singleton
    public static get Instance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    // play mode getter and setter
    public get isEndlessMode(): boolean {
        return this.isEndless;
    }

    public set isEndlessMode(value: boolean) {
        this.isEndless = value;
    }

    onLoad()
    {
        // generate revive hearts
        this.ReviveHeartsDataLoading();

        CharacterData.getInstance().onLoad();

        this.musicSlider.progress = SettingsData.getInstance().MusicVol;
        this.sfxSlider.progress = SettingsData.getInstance().SfxVol;
        this.vibrateToggle.isChecked = SettingsData.getInstance().IsVibrate;


    }

    start()
    {
        for (let i = 0; i < 5; i++)
        {
            this.reviveHearts[i].active = i < parseInt(localStorage.getItem('revivedHeartsCount'), 10) ? true : false;
        }
    }

    ReviveHeartsDataLoading()
    {
        // Retrieve the current saved hearts from localStorage, if any
        const savedDiamonds = localStorage.getItem('revivedHeartsCount');

        // Convert the saved value to a number, defaulting to 3 if it's null
        this.currentSavedHeartsCount = savedDiamonds ? parseInt(savedDiamonds, 10) : 3;
        EndlessGameData.getInstance().ReviveHearts = this.currentSavedHeartsCount;


        // Save the updated total back to localStorage
        localStorage.setItem('revivedHeartsCount', this.currentSavedHeartsCount.toString());

        // testing, not important
        // let testSet: number = 3;
        // localStorage.setItem('revivedHeartsCount', testSet.toString());
    }
}


