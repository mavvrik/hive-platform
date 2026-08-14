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

function normalizeRoleKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createRole(
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
      "Role name and key are required."
    );
  }

  const key = normalizeRoleKey(rawKey);

  if (!key) {
    throw new Error(
      "Role key must contain at least one letter or number."
    );
  }

  const existingRole =
    await prisma.role.findUnique({
      where: {
        key,
      },
      select: {
        id: true,
      },
    });

  if (existingRole) {
    throw new Error(
      `Role key "${key}" already exists.`
    );
  }

  await prisma.role.create({
    data: {
      name,
      key,
      description,
      isActive: true,
    },
  });

  redirect("/settings/roles");
}