import { auth } from '@/app/auth';
import { acceptTOS } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    acceptTOS(session.user.email)

    return NextResponse.json({ message: 'TOS accepted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating TOS acceptance:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
