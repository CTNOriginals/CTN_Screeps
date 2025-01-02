import { ABaseRole, BaseRole } from "./base";
import { sortByDistance } from "utils";


export class Builder extends BaseRole implements ABaseRole {
	constructor(public name: string) {
		super(name);
	}

	public run() {

	}
}

