import { ABaseRole, BaseRole } from "./base";
import { getBestEnergySource, sortByDistance } from "utils";


export class Harvester extends BaseRole implements ABaseRole {
	constructor(public name: string) {
		super(name);
	}

	public run() {
		if(this.creep.store.getFreeCapacity() > 0) {
			var source = getBestEnergySource(this.creep);

			if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
		else {
			if (this.creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
}

