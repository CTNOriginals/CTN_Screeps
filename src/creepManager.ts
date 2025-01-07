import { AnyRoleClass, Supplier } from "roles";
import { compareCoordinates } from "utils";

export const creepData: {[key: string]: CreepInstance} = {}

export class CreepInstance {
	public moveTarget: RoomPosition | null = null;
	public movePath: PathStep[] = [];

	private _role?: AnyRoleClass;

	constructor(
		public name: string
	) {}

	public get creep() {
		return Game.creeps[this.name];
	}
	public get roleName() {
		return this.creep.memory.role;
	}
	public get role() {
		if (this._role === undefined) {
			switch (this.roleName) {
				case "supplier": {
					this._role = new Supplier(this.name);
				} break;
			}
		}

		return this._role;
	}

	public move(target: RoomPosition): boolean {
		//! Does not work if it goes across more then one room
		let lookAhead = null;
		if (this.movePath.length > 1) {
			lookAhead = new RoomPosition(this.movePath[1].x, this.movePath[1].y, this.creep.pos.roomName);
		}

		if (this.moveTarget === null || !compareCoordinates(this.moveTarget, target) || (lookAhead !== null && lookAhead.isOccupied)) {
			if (this.creep.pos === target) { return false; }

			// console.log(`${this.creep.name} (${this.moveTarget === null} || ${this.moveTarget && !compareCoordinates(this.moveTarget, target)} || (${lookAhead !== null && lookAhead!.isOccupied})) (${(this.moveTarget === null || !compareCoordinates(this.moveTarget, target) || (lookAhead !== null && lookAhead.isOccupied))})`)

			this.moveTarget = target;
			this.movePath = this.creep.room.findPath(this.creep.pos, target);

			const dest = this.movePath[this.movePath.length - 1];
			if (dest.x !== target.x || dest.y !== target.y) {
				return false;
			}
		}

		if (this.movePath.length === 0) { return false; }

		for (let i = 0; i < this.movePath.length - 1; i++) {
			let step = this.movePath[i];
			let next = this.movePath[i + 1];
			this.creep.room.visual.line(step.x, step.y, next.x, next.y, {color: '#ffffff48'});
		}

		this.creep.move(this.movePath[0].direction);
		this.movePath.shift();

		if (this.movePath.length === 0) {
			this.moveTarget = null;
		}

		return true;
	}
}
