import { AnyRoleClass } from "roles";
import { Supplier } from "roles";

export const creepData: {[key: string]: CreepInstance} = {}

export const mainSpawn = Game.spawns['Spawn1'];

export class CreepInstance {
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
		if (!this._role) {
			switch (this.roleName) {
				case "supplier": 	this._role = new Supplier(this.name); break;
			}
		}

		return this._role;
	}
}
