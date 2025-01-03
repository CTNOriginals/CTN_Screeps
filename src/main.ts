import 'definitions/definitions';

import { creepData, CreepInstance, mainSpawn } from "index";
import { validateCreeps } from "spawnManager";
import { ErrorMapper } from "utils/ErrorMapper";



// RoomPosition.prototype.terrainType = (this: RoomPosition) => {
// 	this.
// }

//? This functions runs once the first spawn is placed
function Init() {
	console.log(`\n---- INITIATE ----`);
}

let reloaded: boolean = false;
//? This function runs each time the code is reloaded
function OnReload() {
	console.log(`\n---- RELOAD ----`);
	for (const name in Memory.creeps) {
		creepData[name] = new CreepInstance(name)
	}
}

let loopCycle = 0;
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	if (!Memory.initiated) {
		Init();
		Memory.initiated = true;
	}
	if (!reloaded) {
		OnReload();
		reloaded = true;
	}

	console.log(`\n---- LOOP ${loopCycle} ----`);

	const room = mainSpawn.room;
	console.log(room.controller!.safeModeAvailable)

	for (const name in Memory.creeps) {
		const creep = creepData[name];

		// Automatically delete memory of missing creeps
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name];
			delete creepData[name];
			continue;
		}

		creep.role.run();
	}

	validateCreeps();

	loopCycle++;
});


