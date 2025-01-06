Object.defineProperty(Structure.prototype, 'isEnergyReceivingStructures', {
	get: function (): boolean {
		const instance = this as Structure;
		return ([STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_STORAGE] as string[]).includes(instance.structureType)
	},
	configurable: false, // Prevents redefinition
	enumerable: false,   // Hides it from enumeration
});
