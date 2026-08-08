"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleExperienceStatus(
  formData: FormData
) {
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Experience ID is required.");
  }

  const experience =
    await prisma.platformIdentity.findUnique({
      where: { id },
    });

  if (!experience) {
    throw new Error("Experience not found.");
  }

  await prisma.platformIdentity.update({
    where: { id },
    data: {
      isActive: !experience.isActive,
    },
  });

  revalidatePath("/settings/experiences");
}