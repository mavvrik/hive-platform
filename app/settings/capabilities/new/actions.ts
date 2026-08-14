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

export async function createCapability(
  formData: FormData
) {
  const name = cleanRequired(
    formData.get("name")
  );

  const rawKey = cleanRequired(
    formData.get("key")
  );

  const description = cleanOptional(
    formData.get("description")
  );

  if (!name || !rawKey) {
    throw new Error(
      "Capability name and key are required."
    );
  }

  const key =
    normalizeCapabilityKey(rawKey);

  if (!key) {
    throw new Error(
      "Capability key must contain at least one letter or number."
    );
  }

  const existingCapability =
    await prisma.capability.findUnique({
      where: {
        key,
      },
      select: {
        id: true,
      },
    });

  if (existingCapability) {
    throw new Error(
      `Capability key "${key}" already exists.`
    );
  }

  await prisma.capability.create({
    data: {
      name,
      key,
      description,
      isActive: true,
    },
  });

  redirect("/settings/capabilities");
}