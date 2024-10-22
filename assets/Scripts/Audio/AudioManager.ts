import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager;

    public static get Instance(): AudioManager {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }

    @property({ type: AudioSource })
    private musicSource: AudioSource;

    @property({ type: AudioSource })
    private sfxSource: AudioSource;

    @property({ type: AudioClip })
    public background: AudioClip;

    @property({ type: AudioClip })
    public buttonPressed: AudioClip;

    @property({ type: AudioClip })
    public enemyCollide: AudioClip;

    @property({ type: AudioClip })
    public itemCollect: AudioClip;

    @property({ type: AudioClip })
    public winSFX: AudioClip;

    onLoad() {
        AudioManager._instance = this;
    }

    start() {
        this.musicSource.clip = this.background;
        //this.musicSource.play();

        // assign volume for music and sfx
        this.musicSource.volume = SettingsData.getInstance().MusicVol;
        console.log(this.musicSource.volume);
        this.sfxSource.volume = SettingsData.getInstance().SfxVol;
        console.log(this.sfxSource.volume);
    }

    public playSFX(clip: AudioClip) {
        if (this.sfxSource && clip) {
            this.sfxSource.playOneShot(clip);
        }
    }

    public PauseMusic()
    {
        this.musicSource.pause();
    }

    public ResumeMusic()
    {
        this.musicSource.play();
    }
}


