import { Builder, Harvester, Upgrader, AnyRoleClass } from "roles";

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
				case "harvester": 	this._role = new Harvester(this.name); break;
				case "upgrader": 	this._role = new Upgrader(this.name); break;
				case "builder": 	this._role = new Builder(this.name); break;
			}
		}

		return this._role;
	}
}
