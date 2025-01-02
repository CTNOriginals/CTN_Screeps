import { creepData, CreepInstance, mainSpawn } from "index";
import { Harvester, roleDefinitions } from "roles";
import { capitalizeFirstLetter } from "utils";

export function validateCreeps() {
	if (mainSpawn.spawning !== null) { return; }

	for (let i = 0; i < roleDefinitions.length; i++) {
		const def = roleDefinitions[i];
		const targetCreeps = _.filter(Game.creeps, (c: Creep) => c.memory.role === def.role);
		if (targetCreeps.length < def.targetCount) {
			const name: string = `${def.role}${targetCreeps.length}`;
			def.spawn(name, mainSpawn);
			creepData[name] = new CreepInstance(name);
			return;
		}
	}
}
