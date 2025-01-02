export function getDistance(a: RoomPosition, b: RoomPosition): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

export function sortByDistance(origin: RoomPosition, sources: Source[]): Source[] {
	return sources.sort((a, b) => getDistance(origin, a.pos) - getDistance(origin, b.pos));
}

export function getBestEnergySource(creep: Creep) {
	var sources = sortByDistance(creep.pos, creep.room.find(FIND_SOURCES));

	let best = sources[0];

}


export function capitalizeFirstLetter(input: string) {
	return input.charAt(0).toUpperCase() + input.slice(1);
}


