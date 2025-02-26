// src/app/api/search/route.ts
import { NextResponse } from "next/server";
import { searchPartner } from "@/app/db"; // Adjust the import according to your folder structure
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const user = await getUserFromAuth();

  if (user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      { status: 403 }
    );
  }

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const users = await searchPartner(query);
    const resultSet = users.map((user) => ({
      heading: `${user.firstName} ${user.lastName}`,
      subheading: user.email,
      url:
        user.role === "partner"
          ? `/admin/partners/${user.id}`
          : `/admin/subpartners/${user.id}`,
    }));

    return NextResponse.json({ partners: resultSet });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
