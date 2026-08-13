"use server";

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

function cleanRequired(
  value: FormDataEntryValue | null
): string {
  return String(value ?? "").trim();
}

function cleanOptional(
  value: FormDataEntryValue | null
): string | null {
  const cleaned = String(value ?? "").trim();

  return cleaned || null;
}

function createSlug(
  displayName: string,
  centerNumber: string
): string {
  const nameSlug = displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${nameSlug}-${centerNumber}`;
}

export async function createCenter(
  formData: FormData
) {
  const centerNumber = cleanRequired(
    formData.get("centerNumber")
  );

  const name = cleanRequired(
    formData.get("name")
  );

  const displayName = cleanRequired(
    formData.get("displayName")
  );

  const state = cleanOptional(
    formData.get("state")
  );

  const country =
    cleanRequired(
      formData.get("country")
    ) || "US";

  const timezone = cleanRequired(
    formData.get("timezone")
  );

  const regionId = cleanRequired(
    formData.get("regionId")
  );

  const experienceId = cleanRequired(
    formData.get("experienceId")
  );

  if (
    !centerNumber ||
    !name ||
    !displayName ||
    !timezone ||
    !regionId ||
    !experienceId
  ) {
    throw new Error(
      "Center number, name, display name, timezone, region, and experience are required."
    );
  }

  const existingCenter =
    await prisma.center.findUnique({
      where: {
        centerNumber,
      },
      select: {
        id: true,
      },
    });

  if (existingCenter) {
    throw new Error(
      `Center ${centerNumber} already exists.`
    );
  }

  const region =
    await prisma.region.findUnique({
      where: {
        id: regionId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!region || !region.isActive) {
    throw new Error(
      "The selected region is unavailable."
    );
  }

  const experience =
    await prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!experience || !experience.isActive) {
    throw new Error(
      "The selected experience is unavailable."
    );
  }

  const slug = createSlug(
    displayName,
    centerNumber
  );

  const existingSlug =
    await prisma.center.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

  if (existingSlug) {
    throw new Error(
      "A center with this generated URL slug already exists."
    );
  }

  await prisma.center.create({
    data: {
      centerNumber,
      name,
      displayName,
      slug,
      state,
      country,
      timezone,
      isActive: true,
      regionId,
      experienceId,
    },
  });

  redirect("/settings/centers");
}