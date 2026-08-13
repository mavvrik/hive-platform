"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

const ACTIVE_CENTER_COOKIE = "hive_active_center";

export async function setActiveCenter(formData: FormData) {
  const centerNumber = String(
    formData.get("centerNumber") ?? ""
  ).trim();

  if (!centerNumber) {
    throw new Error("Center number is required.");
  }

  const center = await prisma.center.findUnique({
    where: {
      centerNumber,
    },
    select: {
      centerNumber: true,
      isActive: true,
    },
  });

  if (!center || !center.isActive) {
    throw new Error("The selected center is unavailable.");
  }

  const cookieStore = await cookies();

  cookieStore.set(ACTIVE_CENTER_COOKIE, center.centerNumber, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}