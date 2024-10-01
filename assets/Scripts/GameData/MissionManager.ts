import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MissionManager')
export class MissionManager {
    private static instance: MissionManager

    public static getInstance(): MissionManager {
        if (!MissionManager.instance) {
            MissionManager.instance = new MissionManager();
        }
        return MissionManager.instance;
    }

    private diamondMissions: number[] = [];
    private scoreMissions: number[] = [];
    private diamondMissionsKey = "missionGetDiamond";
    private scoreMissionsKey = "missionScoreNoBump";
    private missionKeys: string[] = [this.diamondMissionsKey, this.scoreMissionsKey];
    private currentMissionKey = "currentMission";
    private currentMission: string = "";
    private unlockedCountKey = "unlockedCount";

    get DiamondMissions(): number[] {return this.diamondMissions;}
    set DiamondMissions(value: number[]) {this.diamondMissions = value;}

    get ScoreMissions(): number[] {return this.scoreMissions;}
    set ScoreMissions(value: number[]) {this.scoreMissions = value;}

    get MissionKeys(): string[] {return this.missionKeys;}

    get CurrentMission(): string {return this.currentMission;}
    set CurrentMission(value: string) {this.currentMission = value;}

    generateMission()
    {
        // testing, not important
        // localStorage.removeItem(this.diamondMissionsKey);
        // localStorage.removeItem(this.scoreMissionsKey);
        // localStorage.removeItem(this.unlockedCountKey);
        // localStorage.removeItem(this.currentMissionKey);
        //localStorage.setItem(this.currentMissionKey, this.diamondMissionsKey);

        // loop through all the data keys, use switch i to read or generate data for each key
        for (let i = 0; i < this.missionKeys.length; i++)
        {
            let storedMissionData = localStorage.getItem(this.missionKeys[i]);
            if (storedMissionData) {
                switch (i) {
                    // read diamond mission data from json
                    case 0: this.diamondMissions = JSON.parse(storedMissionData); break;
                    case 1: this.scoreMissionsKey = JSON.parse(storedMissionData); break;
                }
            } else {    // generate mission data and save it to json
                switch (i) {
                    case 0:
                        this.diamondMissions = [50, 80, 100, 150, 200, 300, 500, 1000, 1500, 2000];
                        localStorage.setItem(this.missionKeys[i], JSON.stringify(this.diamondMissions));
                        break;
                    case 1:
                        this.scoreMissions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                        localStorage.setItem(this.missionKeys[i], JSON.stringify(this.scoreMissions));
                        break;
                }
            }
        }

        this.generateCurrentMission();
    }

    generateCurrentMission()
    {
        const storedCurrentMission = localStorage.getItem(this.currentMissionKey);
        this.currentMission = storedCurrentMission ? storedCurrentMission : this.missionKeys[1];
        localStorage.setItem(this.currentMissionKey, this.currentMission);
    }

    changeCurrentMission()
    {
        const oldMission = localStorage.getItem(this.currentMissionKey);
        let newMission;
        // change mission
        do {
            // pick random item in this.missionKeys array
            newMission = this.missionKeys[Math.floor(Math.random() * this.missionKeys.length)]
        } while (newMission == oldMission)

        this.currentMission = newMission    // update current mission
        localStorage.setItem(this.currentMissionKey, newMission);
    }

    missionCompleted()
    {
        // +1 characterUnlockedCount in a data file
        // if there's a data file then increment the value
        const storedUnlockedCount = localStorage.getItem(this.unlockedCountKey);
        if (storedUnlockedCount) {
            let unlockedCount = parseInt(storedUnlockedCount, 10);
            unlockedCount++;
            localStorage.setItem(this.unlockedCountKey, unlockedCount.toString());
        } else {    // else generate it with value = 1
            let unlockedCount = 1;
            localStorage.setItem(this.unlockedCountKey, unlockedCount.toString());
        }
    }
}


