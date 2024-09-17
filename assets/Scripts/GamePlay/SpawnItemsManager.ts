import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import {SpawnDiamondManager} from "db://assets/Scripts/GamePlay/SpawnDiamondManager";
const { ccclass, property } = _decorator;

@ccclass('SpawnItemsManager')
export class SpawnItemsManager extends Component {
    @property({ type: [Prefab] })
    private itemPrefabs: Prefab[] = [];

    @property(SpawnDiamondManager)
    private spawnDiamondManager: SpawnDiamondManager;

    @property(Node)
    private canvas: Node;

    @property
    private spawnRate:number = 0.35;    // after scoring, items will be spawned with this rate

    private boughtItemsIndexes: number[] = [];
    private spawnX1: number = -262;
    private spawnX2: number = 262;
    private spawnYPositions: number[] = [];

    onLoad()
    {
        // read player data, select available items
        // fake scenario: if from player data we created this bought items array:
        //let dataPlayerBoughtItem = ["SuperHero", "Double", "Slowdown", "Freeze", "Magnet"];
        let dataPlayerBoughtItem = ["Magnet"];

        // get all the prefab's names into an array
        let prefabNames = this.getPrefabNames();

        for (let i = 0; i < this.itemPrefabs.length; i++) {
            // Check if the data player bought item name appears in the prefab name arrays
            if (prefabNames.indexOf(dataPlayerBoughtItem[i]) !== -1) {
                // push the index of the item in
                this.boughtItemsIndexes.push(prefabNames.indexOf(dataPlayerBoughtItem[i]));
            }
        }
    }

    spawnItems()
    {
        // Randomly select x1 or x2 for X coordinate
        const randomX = Math.random() < 0.5 ? this.spawnX1 : this.spawnX2;

        // Get y positions
        this.spawnYPositions = this.spawnDiamondManager.UnUsedYPos;
        const randomY = this.spawnYPositions[Math.floor(Math.random() * this.spawnYPositions.length)];

        // Decide if we should spawn or not
        let shouldSpawn = Math.random() <= this.spawnRate ? true : false;

        if (shouldSpawn)
        {
            // randomly select bought items indexes
            const randomBoughtIndex = this.boughtItemsIndexes[Math.floor(Math.random() * this.boughtItemsIndexes.length)];

            // Spawn item
            const item = instantiate(this.itemPrefabs[randomBoughtIndex]);

            if (this.canvas) {
                item.parent = this.canvas; // Set parent to Canvas
            } else {
                console.error("Canvas not found in the scene.");
                return;
            }

            // Set the position of the diamond to (randomX, spawnYPos)
            item.setPosition(randomX, randomY, 0);
        }
    }

    getPrefabNames(): string[] {
        // Create an array to store the names of the prefabs
        const prefabNames: string[] = [];

        // Iterate through the itemPrefabs array and push the name of each prefab into prefabNames
        this.itemPrefabs.forEach(prefab => {
            if (prefab) {
                prefabNames.push(prefab.name);
            }
        });

        return prefabNames;
    }
}


