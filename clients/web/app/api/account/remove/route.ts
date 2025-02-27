import { NextResponse } from "next/server";
import { deleteUser } from "@/app/db";
import { auth } from "@/app/auth";
import { UserService } from "@/app/services/userService";

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
    const user = await UserService.getUserByEmail(session.user.email)

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
