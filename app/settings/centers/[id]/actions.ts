"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

const ACTIVE_CENTER_COOKIE = "hive_active_center";

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

export async function updateCenter(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

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
    !id ||
    !centerNumber ||
    !name ||
    !displayName ||
    !timezone ||
    !regionId ||
    !experienceId
  ) {
    throw new Error(
      "Center ID, center number, name, display name, timezone, region, and experience are required."
    );
  }

  const currentCenter =
    await prisma.center.findUnique({
      where: {
        id,
      },
    });

  if (!currentCenter) {
    throw new Error(
      "Center could not be found."
    );
  }

  const duplicateCenter =
    await prisma.center.findFirst({
      where: {
        centerNumber,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicateCenter) {
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

  const duplicateSlug =
    await prisma.center.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicateSlug) {
    throw new Error(
      "Another center already uses this generated URL slug."
    );
  }

  await prisma.center.update({
    where: {
      id,
    },
    data: {
      centerNumber,
      name,
      displayName,
      slug,
      state,
      country,
      timezone,
      regionId,
      experienceId,
    },
  });

  const cookieStore = await cookies();

  const activeCenterNumber =
    cookieStore.get(
      ACTIVE_CENTER_COOKIE
    )?.value;

  if (
    activeCenterNumber ===
    currentCenter.centerNumber
  ) {
    cookieStore.set(
      ACTIVE_CENTER_COOKIE,
      centerNumber,
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      }
    );
  }

  redirect("/settings/centers");
}

export async function toggleCenterStatus(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  if (!id) {
    throw new Error(
      "Center ID is required."
    );
  }

  const center =
    await prisma.center.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        centerNumber: true,
        isActive: true,
      },
    });

  if (!center) {
    throw new Error(
      "Center could not be found."
    );
  }

  const nextActiveState =
    !center.isActive;

  await prisma.center.update({
    where: {
      id,
    },
    data: {
      isActive: nextActiveState,
    },
  });

  if (!nextActiveState) {
    const cookieStore =
      await cookies();

    const activeCenterNumber =
      cookieStore.get(
        ACTIVE_CENTER_COOKIE
      )?.value;

    if (
      activeCenterNumber ===
      center.centerNumber
    ) {
      cookieStore.delete(
        ACTIVE_CENTER_COOKIE
      );
    }
  }

  redirect(
    `/settings/centers/${id}`
  );
}