import { _decorator, Component, Node, Slider, Toggle } from 'cc';
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
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

    private isEndless:boolean = true;

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
        CharacterData.getInstance().onLoad();

        this.musicSlider.progress = SettingsData.getInstance().MusicVol;
        this.sfxSlider.progress = SettingsData.getInstance().SfxVol;
        this.vibrateToggle.isChecked = SettingsData.getInstance().IsVibrate;
    }
}


