import { regions, db } from "@paytomorrow/db";
import React from "react";

export class AreaService {
  static async getRegions() {
    return await db
      .select()
      .from(regions)
  }

  static async getRegionsAsComponent() {
    const regions = (await AreaService.getRegions()).sort((a,b) => {
      if (a.name < b.name) {
        return -1;
      } else if (b.name < a.name) {
        return 1;
      }
      return 0;
    })
    
    return regions.map((r) => 
      React.createElement("option", { value: r.id, key: r.id }, r.name)
    );
  }
}
