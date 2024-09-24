import { _decorator, Component, Node, Event, director, Sprite, Slider, AudioSource, Toggle} from 'cc';
import {AudioManager} from "db://assets/Scripts/Audio/AudioManager";
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
const { ccclass, property } = _decorator;

@ccclass('ButttonManager')
export class ButttonManager extends Component {

    @property([Node])
    private panels: Node[] = []; // Array to store panel nodes

    @property(Node)
    private darkLayer: Node;

    @property(Slider)
    private musicSlider: Slider;

    @property(Slider)
    private sfxSlider: Slider;

    @property(Toggle)
    private vibrateToggle: Toggle;

    @property(AudioSource)
    private musicSource: AudioSource;

    @property(AudioSource)
    private sfxSource: AudioSource;

    public openPanel(event: Event, CustomEventData) {
        // Turn on dark layer
        if (this.darkLayer)
            this.darkLayer.active = true;

        // First, close all panels
        this.panels.forEach(panel => panel.active = false);

        // Then, open the desired panel based on the index
        if (this.panels[CustomEventData]) {
            this.panels[CustomEventData].active = true;
        }
    }

    public closeParent(event: Event) {
        if (this.darkLayer)
            this.darkLayer.active = false;

        const buttonNode = event.currentTarget as Node; // Get the button node
        const parentNode = buttonNode.parent; // Get the grandparent of the button (assuming this is the panel)

        if (parentNode) {
            parentNode.active = false; // Set the parent (panel) to inactive
        }
    }

    public onClick()
    {
        console.log("Button Clicked");
    }

    public playButtonPressedSFX()
    {
        AudioManager.Instance.playSFX(AudioManager.Instance.buttonPressed);
    }

    public openMenuScene()
    {
        director.loadScene('MainMenu');
    }

    public openEndlessScene()
    {
        director.loadScene('Endless');
    }

    public chooseCharacter(event: Event)
    {
        const buttonNode = event.currentTarget as Node; // Get the button node
        CharacterData.getInstance().CharacterName = buttonNode.getComponent(Sprite).spriteFrame.name;
    }

    public doneChooseCharacter(event: Event)
    {
        const buttonNode = event.currentTarget as Node; // Get the button node
        buttonNode.parent.parent.parent.active = false;
        this.darkLayer.active = false;
    }

    public changingMusicVolume(event: Event)
    {
        if (this.musicSlider) {
            SettingsData.getInstance().MusicVol = this.musicSlider.progress;
            this.musicSource.volume = this.musicSlider.progress;
        } else {
            console.error('Slider component is missing on the target node.');
        }
    }

    public changingSfxVolume(event: Event)
    {
        if (this.sfxSlider) {
            SettingsData.getInstance().SfxVol = this.sfxSlider.progress;
            this.sfxSource.volume = this.sfxSlider.progress;
        } else {
            console.error('Slider component is missing on the target node.');
        }
    }

    public changingVibration()
    {
        if (this.vibrateToggle) {
            SettingsData.getInstance().IsVibrate = this.vibrateToggle.isChecked;
        } else {
            console.error("Toggle commponent is missing on the target node.");
        }
    }

    public closeEndGamePanel()
    {
        director.loadScene("GameOver");
    }

    public doubleDiamond()
    {
        // advertisement then double
        EndlessGameManager.Instance.ReceivedDiamond *= 2;
        EndlessGameData.getInstance().ReceivedDiamond = EndlessGameManager.Instance.ReceivedDiamond;

        this.closeEndGamePanel();
    }

    public revive(event: Event)
    {
        const buttonNode = event.currentTarget as Node; // Get the button node

        // close the dark layer and the panel
        buttonNode.parent.active = false;
        this.darkLayer.active = false;

        // increase a heart then decrease revive count
        EndlessGameManager.Instance.Heart[0].active = true;
        --EndlessGameData.getInstance().ReviveHearts;
        localStorage.setItem('revivedHeartsCount', EndlessGameData.getInstance().ReviveHearts.toString());

        EndlessGameManager.Instance.cancelScheduledGameOver();
    }
}


