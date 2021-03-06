
import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, PolygonCollider2D } from 'cc';
import { GameManager } from '../GameManager';
import { ColliderGroup } from '../GlobalDefines';
import { BombController } from './BombController';
const { ccclass, property } = _decorator;

@ccclass('ExplosionController')
export class ExplosionController extends Component {

    // ------------------------------------------------------------------------------------
    private gameManager: GameManager = undefined;
    private collider: Collider2D = undefined;

    // ------------------------------------------------------------------------------------
    onLoad() {
    }

    start() {
        this.gameManager = GameManager.instance;

        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.scheduleOnce(function(){
            this.node.destroy();
        }, 0.25);
    }

    update(deltaTime: number) {
    }

    onDestroy() {
    }
    
    // ------------------------------------------------------------------------------------
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log("Explosion touched object group" + otherCollider.group);

        switch (otherCollider.group){
            case ColliderGroup.Bomb:
                console.log("Boom another bomb" + otherCollider.node.toString());
                otherCollider.node.getComponent(BombController).explode();
                break;
            case ColliderGroup.DestroyableNode:
                otherCollider.node.destroy();
                this.gameManager.dropBuffAt(this.node.position);                
                break;
            case ColliderGroup.Buff:
                otherCollider.node.destroy();
                break;
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    }
}