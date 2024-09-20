import { auth } from "@/app/auth";
import { getUser } from "@/app/db";
import { redirect } from "next/navigation";
import MultiStepForm from "./MultiStepForm/MultiStepForm";

export default async function setupPage() {
    const session = await auth()
    if (!session?.user) {
        redirect('/login')
    }

    const user = await getUser(session.user.email!)

    if (user.onboardingCompleted) {
        redirect('/app')
    }

    return (
        <MultiStepForm />
    )
}