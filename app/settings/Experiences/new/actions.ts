"use server";

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export async function createExperience(
  formData: FormData
) {
  const name = String(formData.get("name") || "").trim();
  const key = String(formData.get("key") || "")
    .trim()
    .toUpperCase();

  const description =
    String(formData.get("description") || "").trim() ||
    null;

  if (!name || !key) {
    throw new Error(
      "Experience name and key are required."
    );
  }

  await prisma.platformIdentity.create({
    data: {
      name,
      key,
      description,
    },
  });

  redirect("/settings/experiences");
}