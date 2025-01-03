import { Supplier } from "./supplier";

export type AnyRoleClass = Supplier;

export class RoleDefinition {
	constructor(
		public role: CreepRole,
		public bodyParts: BodyPartConstant[],
		public targetCount: number = 0
	) {}

	public spawn(name: string, spawn: StructureSpawn): ScreepsReturnCode {

		const response = spawn.spawnCreep(this.bodyParts, name, {memory: {
			role: this.role,
			room: spawn.room.name,
			working: false
		}});

		if (response === 0) {
			console.log(`spawning "${name}"`);
		} else {
			console.log(`Unable to spawn "${name}\nResponse: ${response}`);
		}

		return response;
	}

	public drySpawn(name: string, spawn: StructureSpawn): ScreepsReturnCode {
		return spawn.spawnCreep(this.bodyParts, name, {memory: {
			role: this.role,
			room: spawn.room.name,
			working: false
		}, dryRun: true});
	}
}

export const roleDefinitions: RoleDefinition[] = [
	new RoleDefinition('supplier', [WORK, CARRY, MOVE], 4),
];

export abstract class ABaseRole {
	public abstract run(): void;
}


export class BaseRole implements ABaseRole {
	constructor(public name: string) {
		// Game.creeps[name].memory.role = 'harvester';
	}

	public get creep() {
		return Game.creeps[this.name];
	}

	public run() {}
}
