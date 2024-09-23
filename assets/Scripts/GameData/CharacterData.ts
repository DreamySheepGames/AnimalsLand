import { _decorator, Component, Node, Sprite, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharacterData')
export class CharacterData{
    private static instance: CharacterData;

    // read and push from character id data file
    private characterID: number[] = [];
    private characterName: string;

    get CharacterID(): number[] {
        return this.characterID;
    }

    set CharacterID(value: number[]) {
        this.characterID = value;
    }

    get CharacterName(): string {
        return this.characterName;
    }

    set CharacterName(value: string) {
        this.characterName = value;
    }

    public onLoad()
    {
        if (!CharacterData.instance) {
            CharacterData.instance = this;
        }
        this.characterID = [0, 1, 3]; // Decide which skin is unlocked
    }

    // Static method to get the singleton instance of CharacterData
    public static getInstance(): CharacterData {
        if (!CharacterData.instance) {
            //console.error('CharacterData instance is not loaded in the scene.');
            CharacterData.instance = new CharacterData();
        }
        return CharacterData.instance;
    }
}