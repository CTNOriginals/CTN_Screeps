import { creepData, CreepInstance } from "index";
import { BaseRole, Builder, Harvester, Upgrader } from "roles";
import { validateCreeps } from "spawnManager";
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
	/*
	Example types, expand on these or remove them and add your own.
	Note: Values, properties defined here do no fully *exist* by this type definiton alone.
	You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

	Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
	Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
	*/
	// Memory extension samples
	interface Memory {
		uuid: number;
		log: any;
		initiated: boolean;
	}

	type CreepRole = 'harvester' | 'upgrader' | 'builder';

	interface CreepMemory {
		role: CreepRole;
		room: string;
		working: boolean;
		upgrading?: boolean;
	}

	// Syntax for adding proprties to `global` (ex "global.log")
	namespace NodeJS {
		interface Global {
			log: any;
		}
	}
}

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

	// console.log(`Current game tick is ${Game.time}`);

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
});


