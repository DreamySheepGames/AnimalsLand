import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, tween, Vec3, Node } from 'cc';
import {PlayerController} from "db://assets/Scripts/Player/PlayerController";
import {EndlessGameManager} from "db://assets/Scripts/GamePlay/EndlessGameManager";
import {InvincibleMeterController} from "db://assets/Scripts/UI/InvincibleMeterController";
import {Diamond} from "db://assets/Scripts/EnemyAndItems/Diamond";
import {TimerManager} from "db://assets/Scripts/GamePlay/TimerManager";
import {EndlessGameData} from "db://assets/Scripts/GameData/EndlessGameData";
import {MissionProgressBarController} from "db://assets/Scripts/UI/MissionProgressBarController";
import {PlayerAnimController} from "db://assets/Scripts/ANIM/Player/PlayerAnimController";
import {PlayerVFXController} from "db://assets/Scripts/PlayerVFX/PlayerVFXController";
import {AudioManager} from "db://assets/Scripts/Audio/AudioManager";
import {SettingsData} from "db://assets/Scripts/GameData/SettingsData";
const { ccclass, property } = _decorator;

@ccclass('PlayerColliderController')
export class PlayerColliderController extends Component {
    @property({ type: InvincibleMeterController})
    private invincibleMeter: InvincibleMeterController;

    @property({ type: PlayerController })
    private playerController: PlayerController = null; // Reference to the PlayerController

    @property({type: TimerManager})
    private timerManager: TimerManager;

    @property(MissionProgressBarController)
    private missionProgressBarController: MissionProgressBarController;

    private playerAnimController: PlayerAnimController;
    private playerVFXController: PlayerVFXController;


    start() {
        this.playerAnimController = this.node.getComponent(PlayerAnimController);
        this.playerVFXController = this.node.getComponent(PlayerVFXController);

        var collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        // Check if the other collider is the enemy (tag = 1)
        if (otherCollider.tag === 1 && !this.playerController.isReturnAfterEnemyHit && !this.playerController.isInvincible) {
            this.hitEnemy();
        }

        // Check if the other collider is the gaze hitbox of the enemy (tag = 0.5)
        if (otherCollider.tag === 0.5 && !this.playerController.isReturnAfterEnemyHit && !this.playerController.isInvincible) {
            this.hitEnemyGaze();
        }

        if (!this.playerController.isReturnAfterEnemyHit)
        {
            switch (otherCollider.tag)
            {
                case 2:     // other collider is diamond (tag = 2)
                    this.hitDiamond(otherCollider);
                    break;

                case 3:     // super hero item (tag = 3)
                    if (!this.playerController.isInvincible)
                        this.hitSuperHeroItem(otherCollider);
                    break;

                case 4:     // double item hit (tag = 4)
                    this.hitDouble(otherCollider);
                    otherCollider.enabled = false;
                    break;

                case 5:     // slowdown item hit (tag = 5)
                    this.hitSlowdown(otherCollider);
                    otherCollider.enabled = false;
                    break;

                case 6:     // freeze item hit (tag = 6)
                    this.hitFreeze(otherCollider);
                    otherCollider.enabled = false;
                    break;

                case 7:     // magnet item hit (tag = 7)
                    this.hitMagnet(otherCollider);
                    otherCollider.enabled = false;
                    break;
            }
        }

        // if (!this.playerController.isReturnAfterEnemyHit && otherCollider.tag == 4)
        //     this.hitDouble(otherCollider);
        // if (!this.playerController.isReturnAfterEnemyHit && otherCollider.tag == 5)
        //     this.hitSlowdown(otherCollider);
        // if (!this.playerController.isReturnAfterEnemyHit && otherCollider.tag == 6)
        //     this.hitFreeze(otherCollider);
        // if (!this.playerController.isReturnAfterEnemyHit && otherCollider.tag == 7)
        //     this.hitMagnet(otherCollider);
    }

    hitEnemy()
    {
        // reset counter for scoring without bump mission
        EndlessGameManager.Instance.MissionScoreWithoutBump = 0;

        EndlessGameManager.Instance.hitVFX();                       // red layer VFX
        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(this.node.position, "FX_collider", 2);

        //audio
        AudioManager.Instance.playSFX(AudioManager.Instance.enemyCollide);

        // player anim
        this.playerAnimController.playAnimOnce("hit");

        // reset the mission progress bar if mission is scoring without bump
        if (localStorage.getItem("currentMission") == "missionScoreNoBump")
            this.missionProgressBarController.resetProgressBarFiller();

        // Trigger a vibration if the device supports it
        if (navigator.vibrate && SettingsData.getInstance().IsVibrate) {
            navigator.vibrate(200); // Vibrate for 200 milliseconds
        } else {
            console.warn('Vibration not supported on this device or no vibration in settings.');
        }

        // mission score without bump

        // decrease invincible filler and heart
        this.invincibleMeter.decreaseFiller();
        EndlessGameManager.Instance.decreaseHeart();

        if (this.playerController.hasGoneUp) {
            // If hasGoneUp is true, set it to false (reverse direction)
            this.playerController.hasGoneUp = false;
        }

        // If hasGoneUp is false, cancel current tween and move back to start position
        if (this.playerController.currentTween) {
            this.playerController.currentTween.stop(); // Cancel the current tween
        }

        this.playerController.returnAfterEnemyHit(); // Move back to start position
    }

    hitEnemyGaze()
    {
        this.invincibleMeter.increaseFiller();
    }

    destroyCollidedNode(otherCollider)
    {
        let itemNode = otherCollider.node;
        this.scheduleOnce(() => {
            if (itemNode && itemNode.isValid) {
                itemNode.destroy();
            }
        }, 0);
    }

    hitDiamond(otherCollider)
    {
        if (!this.playerController.isInvincible)
            this.invincibleMeter.increaseFiller();

        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(otherCollider.node.position, "FX_click", 1);

        //audio
        AudioManager.Instance.playSFX(AudioManager.Instance.itemCollect);

        // mission get diamond
        EndlessGameManager.Instance.doMissionGetDiamond(otherCollider.node.getComponent(Diamond).Value);

        // update total received diamond value
        if (!EndlessGameData.getInstance().IsSpinWheelDiamondDouble)
            EndlessGameManager.Instance.diamondIncrement(otherCollider.node.getComponent(Diamond).Value);
        else
            EndlessGameManager.Instance.diamondIncrement(otherCollider.node.getComponent(Diamond).Value * 2);

        // we have to destroy the diamond AFTER the colliding callback has completed, so we have to use schedule callback
        this.destroyCollidedNode(otherCollider);
    }

    hitSuperHeroItem(otherCollider)
    {
        // turn on invincible
        this.playerController.turnOnInvincible();

        //audio
        AudioManager.Instance.playSFX(AudioManager.Instance.itemCollect);

        // vfx
        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(otherCollider.node.position, "FX_claimBooster", 1);
        this.playerVFXController.fxShieldOn();

        // turn on countdown timer through TimerManager
        this.timerManager.timerSuperHeroOn();

        // destroy item
        this.destroyCollidedNode(otherCollider);
    }

    hitDouble(otherCollider)
    {
        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(otherCollider.node.position, "FX_item", 1);
        this.destroyCollidedNode(otherCollider);

        //audio
        AudioManager.Instance.playSFX(AudioManager.Instance.itemCollect);

        this.playerVFXController.fxX2On();
        EndlessGameManager.Instance.DoubleDiamond = true;
        this.timerManager.timerDoubleOn();
    }

    hitSlowdown(otherCollider)
    {
        // vfx
        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(otherCollider.node.position, "FX_claim", 1);
        this.destroyCollidedNode(otherCollider);
        AudioManager.Instance.playSFX(AudioManager.Instance.itemCollect);
        EndlessGameManager.Instance.slowdownEnemy();
        this.timerManager.timerSlowdownOn();
    }

    hitFreeze(otherCollider)
    {
        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(otherCollider.node.position, "FX_item", 1);
        this.destroyCollidedNode(otherCollider);
        AudioManager.Instance.playSFX(AudioManager.Instance.itemCollect);
        this.playerVFXController.fxFreezeOn();
        EndlessGameManager.Instance.freezeEnemy();
        this.timerManager.timerFreezeOn();
    }

    hitMagnet(otherCollider)
    {
        EndlessGameManager.Instance.vfxManager.PlayVFXOnce(otherCollider.node.position, "FX_item", 1);
        this.destroyCollidedNode(otherCollider);
        AudioManager.Instance.playSFX(AudioManager.Instance.itemCollect);
        this.playerVFXController.fxMagnetOn();
        EndlessGameManager.Instance.Magnet = true;
        this.timerManager.timerMagnetOn();
    }
}
