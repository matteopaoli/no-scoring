import { redirect } from "next/navigation";
import MultiStepForm from "./MultiStepForm/MultiStepForm";
import getUserFromAuth from "@/app/utils/getUserFromAuth";

export default async function setupPage() {
    const user = await getUserFromAuth();

    if (user.onboardingCompleted) {
        redirect('/app')
    }

    return (
        <MultiStepForm />
    )
}