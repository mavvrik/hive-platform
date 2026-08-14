"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

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

function normalizeCapabilityKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function updateCapability(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  const name = cleanRequired(
    formData.get("name")
  );

  const rawKey = cleanRequired(
    formData.get("key")
  );

  const description = cleanOptional(
    formData.get("description")
  );

  if (!id || !name || !rawKey) {
    throw new Error(
      "Capability ID, name, and key are required."
    );
  }

  const key =
    normalizeCapabilityKey(rawKey);

  if (!key) {
    throw new Error(
      "Capability key must contain at least one letter or number."
    );
  }

  const capability =
    await prisma.capability.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!capability) {
    throw new Error(
      "Capability could not be found."
    );
  }

  const duplicate =
    await prisma.capability.findFirst({
      where: {
        key,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicate) {
    throw new Error(
      `Capability key "${key}" already exists.`
    );
  }

  await prisma.capability.update({
    where: {
      id,
    },
    data: {
      name,
      key,
      description,
    },
  });

  redirect("/settings/capabilities");
}

export async function toggleCapabilityStatus(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  if (!id) {
    throw new Error(
      "Capability ID is required."
    );
  }

  const capability =
    await prisma.capability.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!capability) {
    throw new Error(
      "Capability could not be found."
    );
  }

  await prisma.capability.update({
    where: {
      id,
    },
    data: {
      isActive: !capability.isActive,
    },
  });

  redirect(
    `/settings/capabilities/${id}`
  );
}