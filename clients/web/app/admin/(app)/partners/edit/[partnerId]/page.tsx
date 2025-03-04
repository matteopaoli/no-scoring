import Client from './page.client'
import { UserService } from "@/app/services/userService";
import { AreaService } from "@/app/services/areaService";


export default async function EditPartnerPage(props: { params: Promise<{ partnerId: string }> }) {
  const params = await props.params;
  const partner = await UserService.getUserById(params.partnerId);
  const regionsOptions = await AreaService.getRegionsAsComponent();

  return (
    <Client existingPartner={partner} regionsOptions={regionsOptions} />
  );
}
