import { creepData } from "index";
import { Harvester } from "./harvester";
import { Upgrader } from "./upgrader";
import { capitalizeFirstLetter } from "utils";
import { Builder } from "./builder";

export type AnyRoleClass = Harvester | Upgrader | Builder;

export class RoleDefinition {
	constructor(
		public role: CreepRole,
		public bodyParts: BodyPartConstant[],
		public targetCount: number = 0
	) {}

	public spawn(name: string, spawn: StructureSpawn): ScreepsReturnCode {
		console.log(`spawning "${name}"`);

		const response = spawn.spawnCreep(this.bodyParts, name, {memory: {
			role: this.role,
			room: spawn.room.name,
			working: false
		}});

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
	new RoleDefinition('harvester', [WORK, CARRY, MOVE], 1),
	new RoleDefinition('upgrader', [WORK, CARRY, MOVE], 1),
	new RoleDefinition('builder', [WORK, CARRY, MOVE], 1)
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
