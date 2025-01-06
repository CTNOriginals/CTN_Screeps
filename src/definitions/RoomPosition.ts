import { includesAll } from "utils";

Object.defineProperty(RoomPosition.prototype, 'terrainType', {
	get: function (): Terrain {
		const instance = this as RoomPosition;

		// Check if the value is already cached
		if (!Object.prototype.hasOwnProperty.call(instance, '_terrainType')) {
			// Compute and cache the terrain type
			Object.defineProperty(instance, '_terrainType', {
				value: instance.lookFor('terrain')[0],
				writable: false,
				configurable: false,
				enumerable: false,
			});
		}

		// Return the cached value
		return (instance as any)._terrainType;
	},
	configurable: false, // Prevents redefinition
	enumerable: false,   // Hides it from enumeration
});

Object.defineProperty(RoomPosition.prototype, 'isOccupiedBy', {
	get: function (): LookConstant | null {
		const instance = this as RoomPosition; // Explicitly cast 'this' to RoomPosition

		// Check for structures that block movement
		const structures = instance.lookFor(LOOK_STRUCTURES);
		if (structures.some(struct =>
			struct.structureType !== STRUCTURE_ROAD &&
			struct.structureType !== STRUCTURE_CONTAINER &&
			!(struct.structureType === STRUCTURE_RAMPART /* !! also needs to evaluate if the structure is owned by me */)
		)) {
			return LOOK_STRUCTURES;
		}

		// Check for terrain that blocks movement
		if (instance.terrainType === 'wall') {
			return LOOK_TERRAIN;
		}

		// Check for creeps at the position
		const creeps = instance.lookFor(LOOK_CREEPS);
		if (creeps.length > 0) {
			return LOOK_CREEPS;
		}

		return null;
	},
	configurable: false, // Prevents redefinition
	enumerable: false,   // Hides it from enumeration
});

Object.defineProperty(RoomPosition.prototype, 'isOccupied', {
	get: function (): boolean {
		const instance = this as RoomPosition; // Explicitly cast 'this' to RoomPosition
		return (instance.isOccupiedBy === null) ? false : true;
	},
	configurable: false, // Prevents redefinition
	enumerable: false,   // Hides it from enumeration
});

RoomPosition.prototype.getSurroundingPositions = function (): (RoomPosition | null)[] {
	const instance = this as RoomPosition; // Explicitly cast 'this' to RoomPosition
	const pos = (x: number, y: number): (RoomPosition | null) => {
		return Game.rooms[instance.roomName].getPositionAt(x, y) ?? null;
	}
	return [
		pos(instance.x - 1, instance.y - 1), 	pos(instance.x, instance.y - 1), 	pos(instance.x + 1, instance.y - 1),
		pos(instance.x - 1, instance.y), 		/* source */ 						pos(instance.x + 1, instance.y),
		pos(instance.x - 1, instance.y + 1), 	pos(instance.x, instance.y + 1), 	pos(instance.x + 1, instance.y + 1),
	]
}

RoomPosition.prototype.getUnoccupiedSpaces = function (ignoreCreeps: Creep[] = []): RoomPosition[] {
	const instance = this as RoomPosition; // Explicitly cast 'this' to RoomPosition
	const surroundings = instance.getSurroundingPositions();
	let out: RoomPosition[] = [];

	for (const pos of surroundings) {
		if (pos !== null && (
			!pos?.isOccupied || (pos.isOccupiedBy === LOOK_CREEPS && includesAll(pos.lookFor('creep'), ignoreCreeps))
		)) {
			out.push(pos);
		}
	}

	return out;
}


export {};
