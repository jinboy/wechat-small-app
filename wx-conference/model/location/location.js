import {LocationUtils} from "../../utils/location";

class Location {
    static async getLocation() {
        LocationUtils.getLocation();
    }
}

export {
    Location
}