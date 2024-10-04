import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;

// data flow:
// - fetch online database -> save local json file -> local keys
//                 if none -> generate json file -> local keys
// - local keys changed -> update local json file -> update online database (no database yet)

// scripts that need to use updateUserData

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

    public loadUserData() {     // database -> json, will be called at the start of the GameManager
        // read the user id
        const userID = this.getUserID();

        // then read the database to read user's data
        // save all of them to 'userData' structured json file and put it in resource file
        // if there's no userData json file then generate it with this.generateUserDataJson() using default values
        // Simulated database query - this will eventually come from an actual database
        const userData = this.queryDatabaseForUser(userID);

        // If no data found, create default user data
        if (!userData) {
            this.generateUserDataJson();
            console.log("No existing user data found, generating default data.");
        } else {
            console.log("User data loaded from database:", userData);
            this.saveUserDataToLocalJson(userData);
        }

        this.updateLocalKey();
    }

    public updateLocalKey() {       // json -> local key
        const userDataJson = localStorage.getItem('userData');

        if (!userDataJson) {
            console.error('No user data found in local storage.');
            return;
        }

        const userData = JSON.parse(userDataJson);

        // Update local keys based on the userData json
        localStorage.setItem('characterIDs', JSON.stringify(userData.skinID));
        localStorage.setItem('currentMission', userData.currentMission);
        localStorage.setItem('default5Hearts', userData.isDefault5Hearts.toString());
        localStorage.setItem('doubleLevel', userData.itemsLevel.double.toString());
        localStorage.setItem('freezerLevel', userData.itemsLevel.freezer.toString());
        localStorage.setItem('magnetLevel', userData.itemsLevel.magnet.toString());
        localStorage.setItem('slowdownLevel', userData.itemsLevel.slowdown.toString());
        localStorage.setItem('superHeroLevel', userData.itemsLevel.superhero.toString());
        localStorage.setItem('missionGetDiamond', JSON.stringify(userData.diamondMissionProgress));
        localStorage.setItem('missionScoreNoBump', JSON.stringify(userData.scoringMissionProgress));
        localStorage.setItem('receivedDiamonds', userData.receivedDiamonds.toString());
        localStorage.setItem('revivedHeartsCount', userData.revivedHeartsCount.toString());
        localStorage.setItem('spinWheelOneMoreHealth', userData.oneMoreHeartTimeMark ? userData.oneMoreHeartTimeMark.toString() : '');
        localStorage.setItem('spinWheelDoubleStartTime', userData.doubleDiamondTimeMark ? userData.doubleDiamondTimeMark.toString() : '');
    }

    public updateUserData() {       // local key -> json -> database
        // Retrieve data from local storage (local keys)
        const characterIDs = JSON.parse(localStorage.getItem('characterIDs') || '[]');
        const currentMission = localStorage.getItem('currentMission') || 'getDiamond';
        const default5Hearts = localStorage.getItem('default5Hearts') === 'true';
        const doubleLevel = Number(localStorage.getItem('doubleLevel')) || 0;
        const freezerLevel = Number(localStorage.getItem('freezerLevel')) || 0;
        const magnetLevel = Number(localStorage.getItem('magnetLevel')) || 0;
        const slowdownLevel = Number(localStorage.getItem('slowdownLevel')) || 0;
        const superHeroLevel = Number(localStorage.getItem('superHeroLevel')) || 0;
        const missionGetDiamond = JSON.parse(localStorage.getItem('missionGetDiamond') || '[0]');
        const missionScoreNoBump = JSON.parse(localStorage.getItem('missionScoreNoBump') || '[0]');
        const receivedDiamonds = Number(localStorage.getItem('receivedDiamonds')) || 0;
        const revivedHeartsCount = Number(localStorage.getItem('revivedHeartsCount')) || 3;
        const spinWheelOneMoreHealth = localStorage.getItem('spinWheelOneMoreHealth') ? Number(localStorage.getItem('spinWheelOneMoreHealth')) : null;
        const spinWheelDoubleStartTime = localStorage.getItem('spinWheelDoubleStartTime') ? Number(localStorage.getItem('spinWheelDoubleStartTime')) : null;

        // Create an updated user data object
        const updatedUserData = {
            skinID: characterIDs,
            currentMission,
            isDefault5Hearts: default5Hearts,
            itemsLevel: {
                freezer: freezerLevel,
                magnet: magnetLevel,
                slowdown: slowdownLevel,
                double: doubleLevel,
                superhero: superHeroLevel,
            },
            diamondMissionProgress: missionGetDiamond,
            scoringMissionProgress: missionScoreNoBump,
            receivedDiamonds,
            revivedHeartsCount,
            oneMoreHeartTimeMark: spinWheelOneMoreHealth,
            doubleDiamondTimeMark: spinWheelDoubleStartTime
        };

        // local key -> data json file
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        // Synchronize with the database (simulated function)
        this.updateDatabaseWithUserData(updatedUserData);
    }

    // this is where we update the database
    private updateDatabaseWithUserData(userData: any) {
        // Simulated database update logic
        console.log('User data has been updated in the database:', userData);
    }


    private getUserID() {
        return localStorage.getItem('userID') || this.generateRandomUserID();
    }

    private generateRandomUserID() {
        const randomID = 'user-' + Date.now();
        localStorage.setItem('userID', randomID);
        return randomID;
    }

    // this is where we read the user data in database
    private queryDatabaseForUser(userID: string) {
        // Simulated response from a database; this would be an API call or similar
        return null; // null means no data for the user found
    }

    // Function to generate default user data if none exists
    private generateUserDataJson() {
        const defaultUserData = {
            skinID: [0], // Default skin
            currentMission: "getDiamond",
            isDefault5Hearts: false,
            itemsLevel: {
                freezer: 0,
                magnet: 0,
                slowdown: 0,
                double: 0,
                superhero: 0
            },
            diamondMissionProgress: [0],
            scoringMissionProgress: [0],
            receivedDiamonds: 0,
            revivedHeartsCount: 3,
            oneMoreHeartTimeMark: null,
            doubleDiamondTimeMark: null
        };

        // Save this data locally in case the database is empty
        localStorage.setItem('userData', JSON.stringify(defaultUserData));
        console.log("Default user data generated and saved.");
    }

    private saveUserDataToLocalJson(userData: any) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
}