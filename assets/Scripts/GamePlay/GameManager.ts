import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static instance: GameManager;
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
}


