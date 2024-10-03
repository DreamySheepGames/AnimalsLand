import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UserDataManager')
export class UserDataManager {
    private static instance: UserDataManager;

    // Static method to get the singleton instance
    public static getInstance(): UserDataManager {
        if (!UserDataManager.instance) {
            UserDataManager.instance = new UserDataManager();
        }
        return UserDataManager.instance;
    }

    private userData: any = null;

    public saveUserData() {
        // read the user id
        // then read the database to read user's data
        // save it to 'userData' json file
    }

    public loadUserData() {
        resources.load('userData', JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('Failed to load player data:', err);
                return;
            }

            this.userData = jsonAsset.json;
            console.log('Player data loaded:', this.userData);
        });
    }

    public updateUserData() {
        // update this.userData.dataThisDataThat = local keys
        // update this.userData.dataThisDataThat to database
    }

    // - character skin/id (is all character bundle is purchased, which characters are unlocked)

    // - current mission (which current mission the player is doing)

    // - default 5 hearts (has the player purchased the max health bundle)

    // - items level (the level of the items player has unlocked)
    // double
    // freezer
    // magnet
    // slowdown
    // superhero

    // - mission progress (read/load the mission progress for receiving diamond and scoring)
    // diamond
    // scoring

    // - received diamonds (how many diamonds the player has collected)

    // revivedHeartsCount

    // - one more heart time mark (spinning wheel prize for 24 hours)
    // - double diamond time mark (spinning wheel prize for 24 hours)

    // update/export user data json
}


