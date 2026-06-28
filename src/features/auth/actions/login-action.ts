"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginAction(prevState: { error: string } | null, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Login action error:", error);
    return { error: "Invalid credentials" };
  }

  redirect("/dashboard");
}