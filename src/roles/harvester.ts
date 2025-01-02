import { ABaseRole, BaseRole } from "./base";
import { sortByDistance } from "utils";


export class Harvester extends BaseRole implements ABaseRole {
	constructor(public name: string) {
		super(name);
	}

	public run() {
		if(this.creep.store.getFreeCapacity() > 0) {
			var sources = sortByDistance(this.creep.pos, this.creep.room.find(FIND_SOURCES));

			if(this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
		else {
			if (this.creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
}

