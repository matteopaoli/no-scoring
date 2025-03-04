import { migrateEarnings } from "@/app/services/migrate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await migrateEarnings();
    return NextResponse.json(
        { message: "OK!" },
        { status: 200 }
    );
}