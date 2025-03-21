import { AreaService } from "@/app/services/areaService";
import CreateSubPartnerPage from "./page.client";

export default async function Page() {
    const regionsOptions = await AreaService.getRegionsAsComponent();
    
    return <CreateSubPartnerPage regionsOptions={regionsOptions} />
}
