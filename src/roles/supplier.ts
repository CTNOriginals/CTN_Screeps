import { getBestEnergySource } from "utils";
import { BaseRole, ABaseRole } from "./base";
import { object } from "lodash";

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
	public state: TSupplierState = SupplierState.IDLE;
	private targetStructure: EnergyReceivingStructures | null = null;

	constructor(public name: string) {
		super(name);
		this.state = this.creep.memory.state ?? SupplierState.IDLE;
	}

	public get room() {
		return this.creep.room;
	}

	public run() {
		if (
			this.state !== SupplierState.HARVESTING && this.creep.store[RESOURCE_ENERGY] === 0 ||
			this.state === SupplierState.IDLE && this.creep.store.getFreeCapacity() > 0
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
					this.state = SupplierState.SUPPLYING;
					this.targetStructure = struc;
					foundStructure = true;
					break;
				}
			}
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
		this.creep.say('🔄 harvest');

		let source = getBestEnergySource(this.creep);
		if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
			this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}

	private doSupply() {
		if (this.targetStructure !== null) {
			this.creep.say('📦 supply');
			if (this.creep.transfer(this.targetStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		} else {
			this.creep.say('⚡ upgrade');
			if (this.creep.upgradeController(this.creep.room.controller!) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(this.creep.room.controller!.pos, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
}
