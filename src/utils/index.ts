export function getDistance(a: RoomPosition, b: RoomPosition): number {
	// return Math.hypot(b.x - a.x, b.y - a.y);
	return a.findPathTo(b.x, b.y).length;
}

export function sortByDistance(origin: RoomPosition, sources: Source[]): Source[] {
	return sources.sort((a, b) => getDistance(origin, a.pos) - getDistance(origin, b.pos));
}

// export function getSurroundingPositions(origin: RoomPosition): (RoomPosition | null)[] {
// 	const pos = (x: number, y: number): RoomPosition | null => {
// 		return Game.rooms[origin.roomName].getPositionAt(x, y);
// 	}
// 	return [
// 		pos(origin.x - 1, origin.y - 1), 	pos(origin.x, origin.y - 1), 	pos(origin.x + 1, origin.y - 1),
// 		pos(origin.x - 1, origin.y), 		/* source */ 					pos(origin.x + 1, origin.y),
// 		pos(origin.x - 1, origin.y + 1), 	pos(origin.x, origin.y + 1), 	pos(origin.x + 1, origin.y + 1),
// 	]
// // }
// export function getSurroundings(origin: RoomPosition): LookAtResult[][] {
// 	const surroundings = getSurroundingPositions(origin);

// 	let out = [];
// 	for (const place of surroundings) {
// 		out.push((place) ? place?.look() : []);
// 	}

// 	return out;
// }

export function getBestEnergySource(creep: Creep) {
	var sources = sortByDistance(creep.pos, creep.room.find(FIND_SOURCES));

	let best = null;
	for (const source of sources) {
		if (source === best || !creep.room.isValidPath(creep.pos, source.pos)) { continue; }

		// console.log(`-- source ${source.pos.x}x${source.pos.y} --`)
		let availableSpaces = source.pos.getUnoccupiedSpaces([creep]);

		// console.log(`availableSpaces: ${availableSpaces.length}`)

		//TODO Calculate how long a creep is gonna take
		//TODO then compare it to the alternate path it needs to take instead of waiting on that creep

		if (best === null || (best.pos.getUnoccupiedSpaces([creep]).length === 0 && availableSpaces.length > 0)) {
			best = source;
		}
	}

	return best ?? sources[0];
}

export function compareCoordinates(a: RoomPosition, b: RoomPosition): Boolean {
	return (a.x === b.x && a.y === b.y);
}


export function capitalizeFirstLetter(input: string) {
	return input.charAt(0).toUpperCase() + input.slice(1);
}

export function includesAny(target: any|any[], items: any[]): boolean {
	for (const item of items) {
		if (target.includes(item)) { return true; }
	}

	return false;
}

export function includesAll(target: any|any[], items: any[]): boolean {
	for (const item of items) {
		if (!target.includes(item)) { return false; }
	}

	return true;
}
