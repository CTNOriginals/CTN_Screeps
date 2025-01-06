import { getBestEnergySource } from "utils";
import { BaseRole, ABaseRole } from "./base";

export const SupplierState = {
	IDLE: 'Idle',
	/** Refilling energy storage */
	HARVESTING: 'harvesting',
	/** Supplying a structure with energy (usually a spawn)*/
	SUPPLYING: 'supplying',
} as const;

export type TSupplierState = typeof SupplierState[keyof typeof SupplierState];

/** The priority sort order of for each structure */
const structurePriority: EnergyReceivingStructureTypes[] = [
	STRUCTURE_SPAWN,
	STRUCTURE_EXTENSION,
	STRUCTURE_TOWER,
	STRUCTURE_STORAGE,
]

export class Supplier extends BaseRole implements ABaseRole {
	public state: TSupplierState;

	constructor(public name: string) {
		super(name);
		this.state = this.creep.memory.state ?? SupplierState.IDLE;
	}

	public get room() {
		return this.creep.room;
	}

	public get controller() {
		return Game.spawns['Spawn1'].room.controller as StructureController;
	}

	public get targetSource() {
		return (this.creep.memory.targetSourceId === null) ? null : Game.getObjectById<Source>(this.creep.memory.targetSourceId!);
	}
	public set targetSource(value) {
		this.creep.memory.targetSourceId = value?.id;
	}

	public run() {
		if (
			this.creep.store.getFreeCapacity() !== 0 && (
				this.state !== SupplierState.HARVESTING && this.creep.store[RESOURCE_ENERGY] === 0 ||
				this.state === SupplierState.IDLE && this.creep.store.getFreeCapacity() > 0
			)
		) {
			this.state = SupplierState.HARVESTING;
		} else if (this.creep.store.getFreeCapacity() === 0) {
			const energyCapacityRatio = (structure: EnergyReceivingStructures) => {
				return structure.store.getFreeCapacity(RESOURCE_ENERGY) / structure.store.getCapacity(RESOURCE_ENERGY)
			}
			const structures = this.room.getEnergyReceivingStructures(true)
			.sort((a, b) =>
				structurePriority.indexOf(a.structureType) - structurePriority.indexOf(b.structureType) ||
				energyCapacityRatio(b) - energyCapacityRatio(a)
			)

			let foundStructure = false;
			this.targetStructure = null;
			for (const struc of structures) {
				if (struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
					this.targetStructure = struc;
					foundStructure = true;
					break;
				}
			}

			this.state = SupplierState.SUPPLYING;
		}

		switch (this.state) {
			case SupplierState.HARVESTING: { this.doHarvest(); } break;
			case SupplierState.SUPPLYING: { this.doSupply(); } break;
			case SupplierState.IDLE: break;
			default: { this.state = SupplierState.IDLE; } break;
		}

		this.creep.memory.state = this.state;
	}

	private doHarvest() {
		// this.creep.say('🔄 harvest');
		if (this.targetSource === null) {
			this.targetSource = getBestEnergySource(this.creep);
		}

		if (this.creep.harvest(this.targetSource) == ERR_NOT_IN_RANGE) {
			if (!this.creepInstance.move(this.targetSource.pos)) {
				this.targetSource = null;
			}
		}
		else if (this.creep.store.getFreeCapacity() === 0) {
			this.targetSource = null;
		}
	}

	private doSupply() {
		if (this.targetStructure !== null) {
			// this.creep.say('📦 supply');
			if (this.creep.transfer(this.targetStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		} else {
			// this.creep.say('⚡ upgrade');
			if (this.creep.upgradeController(this.controller) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.controller.pos, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
}
