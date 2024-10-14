import { _decorator, Component, Node, Sprite, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharacterData')
export class CharacterData{
    private static instance: CharacterData;

    // read and push from character id data file
    private characterID: number[] = [];
    private characterName: string;

    private opponentSkinID: number;

    get CharacterID(): number[] {return this.characterID;}
    set CharacterID(value: number[]) {this.characterID = value;}

    get CharacterName(): string {return this.characterName;}
    set CharacterName(value: string) {this.characterName = value;}

    get OpponentSkinID() {return this.opponentSkinID;}
    set OpponentSkinID(value: number) {this.opponentSkinID = value;}

    public onLoad()
    {
        if (!CharacterData.instance) {
            CharacterData.instance = this;
        }

        // premium character IDs: 24 to 29
        // read characterID from local storage, if there's no data file then create with id 0

        // Define the key for character data in localStorage
        const characterDataKey = 'characterIDs';

        // Check if the data already exists in localStorage
        const storedData = localStorage.getItem(characterDataKey);

        if (storedData) {
            // If data exists, parse it back into the characterID array
            this.characterID = JSON.parse(storedData);
        } else {
            // If no data exists, initialize the array with the default value
            this.characterID = [0]; // Default value (id 0)

            // Save the default array to localStorage
            localStorage.setItem(characterDataKey, JSON.stringify(this.characterID));
        }

        // testing, unimportant
        // this.characterID = [0]; // Default value (id 0)
        // localStorage.setItem(characterDataKey, JSON.stringify(this.characterID));
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