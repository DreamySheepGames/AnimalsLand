import { _decorator, Component, Node, Event, director, Sprite, Slider, AudioSource, Toggle, RichText, game,
        tween, Vec3, UIOpacity } from 'cc';
import {AudioManager} from "db://assets/Scripts/Audio/AudioManager";
import {CharacterData} from "db://assets/Scripts/GameData/CharacterData";
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {MissionManager} from "db://assets/Scripts/GameData/MissionManager";
import {GameManager} from "db://assets/Scripts/GamePlay/GameManager";
import { showPrerollAd, showInterstitialAd, requestRewardedAd, showRewardedAd } from 'db://assets/adsense-h5g-api/h5_games_ads';
import {RewardedVideoAdEvent} from 'db://assets/adsense-h5g-api/ad_event';

const { ccclass, property } = _decorator;

@ccclass('ButttonManager')
export class ButttonManager extends Component {

    @property([Node])
    private panels: Node[] = []; // Array to store panel nodes

    @property(Node)
    private darkLayer: Node;

    @property(Node)
    private darkLayerOpponent: Node;

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

    @property(RichText)
    private missionLabel: RichText;

    @property(GameManager)
    private gameManager: GameManager;

    start()
    {
        requestRewardedAd("placement_name");
    }

    tweenDarkLayerOpcacityOn(uiOpacity: UIOpacity) {
        if (uiOpacity) {
            tween(uiOpacity)
                .to(0.25, { opacity: 255 })
                .start();
        }
    }

    tweenDarkLayerOpcacityOff(uiOpacity: UIOpacity, darkLayer: Node) {
        if (uiOpacity) {
            tween(uiOpacity)
                .to(0.25, { opacity: 0 })
                .call(() => {darkLayer.active = false;})
                .start();
        }
    }

    public openPanel(event: Event, CustomEventData) {
        // Turn on dark layer
        if (this.darkLayer) {
            this.darkLayer.getComponent(UIOpacity).opacity = 0;
            const uiOpacity = this.darkLayer.getComponent(UIOpacity);
            this.darkLayer.active = true;
            this.tweenDarkLayerOpcacityOn(uiOpacity);
        }

        if (this.darkLayerOpponent) {
            this.darkLayerOpponent.getComponent(UIOpacity).opacity = 0;
            const uiOpacity = this.darkLayerOpponent.getComponent(UIOpacity);
            this.darkLayerOpponent.active = true;
            this.tweenDarkLayerOpcacityOn(uiOpacity);
        }

        // First, close all panels
        this.panels.forEach(panel => panel.active = false);

        // Then, open the desired panel based on the index
        if (this.panels[CustomEventData]) {
            this.panels[CustomEventData].active = true;
            this.panels[CustomEventData].setScale(0.1, 0.1, 0.1);
            tween(this.panels[CustomEventData])
                .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'cubicOut' })
                .to(0.2, { scale: new Vec3(0.9, 1.023, 1) }, { easing: 'backOut' })
                .to(0.25, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
                .start();
        }
    }

    public closeParent(event: Event) {
        if (this.darkLayerOpponent) {
            const uiOpacity = this.darkLayerOpponent.getComponent(UIOpacity);
            this.tweenDarkLayerOpcacityOff(uiOpacity, this.darkLayerOpponent);
        }

        if (this.darkLayer) {
            const uiOpacity = this.darkLayer.getComponent(UIOpacity);
            this.tweenDarkLayerOpcacityOff(uiOpacity, this.darkLayer);
        }

        const buttonNode = event.currentTarget as Node; // Get the button node
        const parentNode = buttonNode.parent; // Get the grandparent of the button (assuming this is the panel)

        if (parentNode) {
            tween(parentNode)
                .to(0.3, { scale: new Vec3(0.1, 0.1, 0.1) }, { easing: 'backIn' })
                .call(() => {parentNode.active = false;})
                .start();
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
        EndlessGameManager.Instance.Heart[3].active = true;
        // --EndlessGameData.getInstance().ReviveHearts;
        // localStorage.setItem('revivedHeartsCount', EndlessGameData.getInstance().ReviveHearts.toString());

        EndlessGameManager.Instance.cancelScheduledGameOver();
    }

    public changeCurrentMission()
    {
        MissionManager.getInstance().changeCurrentMission();
        EndlessGameManager.Instance.assignMission(this.missionLabel);
    }

    public changeCurrentMissionAtCharactersPanel()
    {
        MissionManager.getInstance().changeCurrentMission();
        this.gameManager.updateMissionLabel();
    }

    public startAdToChangeMissionAtCharactersPanel()
    {
        game.on(RewardedVideoAdEvent.AD_VIEWED, this.changeCurrentMissionAtCharactersPanel, this);
        requestRewardedAd("placement_name");
        showRewardedAd();
    }

    public startAdToChangeMission() {
        game.on(RewardedVideoAdEvent.AD_VIEWED, this.changeCurrentMission, this);
        requestRewardedAd("placement_name");
        showRewardedAd();
    }

    public startAdToRevive(event: Event) {
        EndlessGameManager.Instance.cancelScheduledGameOver();
        game.on(RewardedVideoAdEvent.AD_VIEWED, () => {
            this.revive(event); // Pass null if you don't need the event argument
        }, this);
        game.on(RewardedVideoAdEvent.AD_DISMISSED, this.closeEndGamePanel, this);
        requestRewardedAd("placement_name");
        showRewardedAd();
    }

    public startAdToDoubleDiamond() {
        EndlessGameManager.Instance.cancelScheduledGameOver();
        game.on(RewardedVideoAdEvent.AD_VIEWED, this.doubleDiamond, this);
        game.on(RewardedVideoAdEvent.AD_DISMISSED, this.closeEndGamePanel, this);
        requestRewardedAd("placement_name");
        showRewardedAd();
    }
}


