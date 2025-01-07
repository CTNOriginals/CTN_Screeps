Room.prototype.getEnergyReceivingStructures = function (owned: boolean = false): EnergyReceivingStructures[] {
	const instance = this as Room;
	return instance.find((owned) ? FIND_STRUCTURES : FIND_MY_STRUCTURES).filter((structure) => {
        if (
            structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_TOWER ||
            structure.structureType === STRUCTURE_STORAGE
        ) {
            const store = (structure as StructureStorage).store;
            if (store) {
                return store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            if ('energy' in structure) {
                const s = structure as StructureExtension | StructureSpawn | StructureTower;
                return s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
            }
        }
        return false;
    }) as EnergyReceivingStructures[];
}
Room.prototype.getConstructionSites = function (owned: boolean = false): ConstructionSite[] {
	const instance = this as Room;
	return instance.find((owned) ? FIND_MY_CONSTRUCTION_SITES : FIND_CONSTRUCTION_SITES) as ConstructionSite[];
}

Room.prototype.isValidPath = function (origin: RoomPosition, target: RoomPosition): boolean {
	const instance = this as Room; // Explicitly cast 'this' to RoomPosition
	let movePath = instance.findPath(origin, target);

	const dest = movePath[movePath.length - 1];
	if (dest.x !== target.x || dest.y !== target.y) {
		return false;
	}

	return true;
}


export {}
