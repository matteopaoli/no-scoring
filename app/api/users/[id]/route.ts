import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteUser, getUser } from "@/app/db";
import { auth } from "@/app/auth";

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Forbidden: Only admins can delete users" },
        { status: 403 }
      );
    }
    const user = await getUser(session.user.email)

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Only admins can delete users" },
        { status: 403 }
      );
    }

    await deleteUser(params.id)

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
