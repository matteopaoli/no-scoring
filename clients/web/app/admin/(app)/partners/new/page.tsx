import { AreaService } from "@/app/services/areaService";
import CreatePartnerPage from "./page.client";

export default async function Page() {
  const regionsOptions = await AreaService.getRegionsAsComponent();
  return <CreatePartnerPage regionsOptions={regionsOptions}/>
}
