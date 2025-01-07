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

	public run() {
		if (this.targetStructure === null || this.state == SupplierState.IDLE) {
			if (
				this.creep.store.getFreeCapacity() !== 0 && (
					this.state !== SupplierState.HARVESTING && this.creep.store[RESOURCE_ENERGY] === 0 ||
					this.state === SupplierState.IDLE && this.creep.store.getFreeCapacity() > 0
				)
			) {
				this.state = SupplierState.HARVESTING;
			} else if (this.creep.store.getFreeCapacity() === 0) {
				this.targetStructure = this.findTargetStructure();

				this.state = SupplierState.SUPPLYING;
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

	private findTargetStructure(): typeof this.targetStructure {
		// Get Structure to refill
		const energyCapacityRatio = (structure: EnergyReceivingStructures) => {
			return structure.store.getFreeCapacity(RESOURCE_ENERGY) / structure.store.getCapacity(RESOURCE_ENERGY)
		}
		const structures = this.room.getEnergyReceivingStructures(true)
		.sort((a, b) =>
			structurePriority.indexOf(a.structureType) - structurePriority.indexOf(b.structureType) ||
			energyCapacityRatio(b) - energyCapacityRatio(a)
		)
		for (const struc of structures) {
			if (struc.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
				return struc;
			}
		}

		// Get Construction site to progress
		const constructionSites = this.room.getConstructionSites(true)
		.sort((a, b) =>
			b.progressTotal - a.progressTotal
		)
		for (const site of constructionSites) {
			if (site.progressTotal > 0) {
				return site;
			}
		}

		return null;
	}

	private doHarvest() {
		if (this.targetStructure === null) {
			this.targetStructure = getBestEnergySource(this.creep);
		}

		// if (this.creep.harvest(this.targetSource) == ERR_NOT_IN_RANGE) {
		// 	if (!this.creepInstance.move(this.targetStructure.pos)) {
		// 		this.targetStructure = null;
		// 	}
		// }

		this.doSupply();

		if (
			this.creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ||
			(this.targetStructure instanceof Source && this.targetStructure.energy === 0)
		) {
			this.targetStructure = null;
		}
	}

	private doSupply() {
		if (this.targetStructure === null) {
			this.targetStructure = this.controller;
		}

		const transferMethod = () => {
			if (this.targetStructure instanceof Source) {
				return this.creep.harvest(this.targetStructure)
			} else if (this.targetStructure instanceof ConstructionSite) {
				return this.creep.build(this.targetStructure)
			} else if (this.targetStructure!.structureType === 'controller') {
				return this.creep.upgradeController(this.targetStructure as StructureController)
			} else {
				return this.creep.transfer(this.targetStructure!, RESOURCE_ENERGY)
			}
		}

		const response = transferMethod();
		// console.log(response)
		if (response == ERR_NOT_IN_RANGE) {
			if (!this.creepInstance.move(this.targetStructure.pos)) {
				this.targetStructure = null;
			}
		} else if (([ERR_FULL, ERR_BUSY] as number[]).includes(response)) {
			this.targetStructure = null;
		}

		if (this.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 || (
				(this.targetStructure as Structure)?.isEnergyReceivingStructures &&
				(this.targetStructure as EnergyReceivingStructures).store.getFreeCapacity() === 0
			) || (
				this.targetStructure instanceof ConstructionSite &&
				this.targetStructure.progressTotal === 0
			)
		) {
			this.targetStructure = null;
		}
	}
}
