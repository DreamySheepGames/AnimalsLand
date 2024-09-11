import { _decorator, Component, Prefab, Node, instantiate} from 'cc';
import { EndlessGameManager } from 'db://assets/Scripts/GamePlay/EndlessGameManager';
import {MoveSideWay} from "db://assets/Scripts/EnemyAndItems/MoveSideWay";
const { ccclass, property } = _decorator;

@ccclass('SpawnEnemyManager')
export class SpawnEnemyManager extends Component {
    @property({ type: [Prefab] })
    private enemyPrefabs: Prefab[] = [];

    @property(Node)
    private canvas: Node;

    private spawnX1: number = -262;
    private spawnX2: number = 262;
    private spawnYMin: number = -133;
    private spawnYMax: number = 166;

    public spawnEnemy(spawnAmount: number) {
        for (let i = 0; i < spawnAmount; i++) {
            const randomIndex = Math.floor(Math.random() * this.enemyPrefabs.length);
            const enemy = instantiate(this.enemyPrefabs[randomIndex]);

            if (this.canvas) {
                enemy.parent = this.canvas; // Set parent to Canvas
            } else {
                console.error("Canvas not found in the scene.");
            }

            // Randomly select x1 or x2 for X coordinate
            const randomX = Math.random() < 0.5 ? this.spawnX1 : this.spawnX2;

            // Randomly select a Y coordinate between spawnYMin and spawnYMax
            const randomY = Math.random() * (this.spawnYMax - this.spawnYMin) + this.spawnYMin;

            // Set the position of the enemy to (randomX, randomY)
            enemy.setPosition(randomX, randomY, 0);

            // Set move direction based on randomX
            enemy.getComponent(MoveSideWay).MoveDirection = randomX == this.spawnX1 ? 1 : -1;

            // Push the enemy to the enemyQueue
            EndlessGameManager.Instance.enemyQueue.push(enemy);

            // Push spawnAmount to the enemyAmountQueue
            // EndlessGameManager.Instance.enemyAmountQueue.push(spawnAmount);
        }
    }

}


