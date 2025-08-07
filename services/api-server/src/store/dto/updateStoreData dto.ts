import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type UpadteStoreDataDto = {
    name?: string,
    image?: string;
    description?:string;
    address?: string;
    locationLat?: string; 
    locationLng?: string; 
    placeId?: string; 
    businessTypeId?: number;
}