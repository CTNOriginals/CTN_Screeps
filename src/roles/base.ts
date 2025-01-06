import { creepData } from "creepManager";
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
	new RoleDefinition('supplier', [WORK, CARRY, MOVE, MOVE], 5),
];


export abstract class ABaseRole {
	public abstract run(): void;
}

export class BaseRole implements ABaseRole {
	// public targetStructure: EnergyReceivingStructures | null;

	constructor(public name: string) {
		// Game.creeps[name].memory.role = 'harvester';
		// this.targetStructure = this.creep.memory.targetStructure ?? null;
	}

	public get creep() {
		return Game.creeps[this.name];
	}
	public get creepInstance() {
		return creepData[this.name];
	}

	public get targetSource() {
		return (this.creep.memory.targetSourceId === null) ? null : Game.getObjectById<Source>(this.creep.memory.targetSourceId!);
	}
	public set targetSource(value) {
		this.creep.memory.targetSourceId = value?.id;
	}

	public get targetStructure(): Structure | null {
		return (this.creep.memory.targetStructureId === null) ? null : Game.getObjectById<Structure>(this.creep.memory.targetStructureId!);
	}
	public set targetStructure(value: Structure | null) {
		this.creep.memory.targetStructureId = value?.id;
	}

	public run() {}
}
