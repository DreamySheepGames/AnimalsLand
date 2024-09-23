import { _decorator, Component, Node, Event, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SettingsData')
export class SettingsData {
    private static instance: SettingsData;

    private musicVol: number = 1;
    private sfxVol: number = 1;
    private isVibrate: boolean = true;

    get MusicVol(): number {
        return this.musicVol;
    }

    set MusicVol(value: number) {
        this.musicVol = value;
    }

    get SfxVol(): number {
        return this.sfxVol;
    }

    set SfxVol(value: number) {
        this.sfxVol = value;
    }

    get IsVibrate(): boolean {
        return this.isVibrate;
    }

    set IsVibrate(value: boolean) {
        this.isVibrate = value;
    }

    // Static method to get the singleton instance of CharacterData
    public static getInstance(): SettingsData {
        if (!SettingsData.instance) {
            //console.error('CharacterData instance is not loaded in the scene.');
            SettingsData.instance = new SettingsData();
        }
        return SettingsData.instance;
    }
}


