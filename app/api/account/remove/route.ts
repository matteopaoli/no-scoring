import { NextResponse } from "next/server";
import { deleteUser, getUser } from "@/app/db";
import { auth } from "@/app/auth";

export async function POST(
  request: Request,
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 403 }
      );
    }
    const user = await getUser(session.user.email)

    await deleteUser(user.id)

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
