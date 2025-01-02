import { ABaseRole, BaseRole } from "./base";
import { getBestEnergySource, sortByDistance } from "utils";

export class Upgrader extends BaseRole implements ABaseRole {
	constructor(public name: string) {
		super(name);
	}

	public run() {
		if(this.creep.memory['upgrading'] && this.creep.store[RESOURCE_ENERGY] == 0) {
            this.creep.memory['upgrading'] = false;
            this.creep.say('🔄 harvest');
	    }
	    if(!this.creep.memory['upgrading'] && this.creep.store.getFreeCapacity() == 0) {
	        this.creep.memory['upgrading'] = true;
	        this.creep.say('⚡ upgrade');
	    }

	    if(this.creep.memory['upgrading']) {
            if(this.creep.upgradeController(this.creep.room.controller!) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller!.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var source = getBestEnergySource(this.creep);
            if(this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
}
