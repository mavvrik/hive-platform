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

export async function updateRole(
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
      "Role ID, name, and key are required."
    );
  }

  const key = normalizeRoleKey(rawKey);

  if (!key) {
    throw new Error(
      "Role key must contain at least one letter or number."
    );
  }

  const role =
    await prisma.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!role) {
    throw new Error(
      "Role could not be found."
    );
  }

  const duplicate =
    await prisma.role.findFirst({
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
      `Role key "${key}" already exists.`
    );
  }

  await prisma.role.update({
    where: {
      id,
    },
    data: {
      name,
      key,
      description,
    },
  });

  redirect("/settings/roles");
}

export async function toggleRoleStatus(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  if (!id) {
    throw new Error(
      "Role ID is required."
    );
  }

  const role =
    await prisma.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!role) {
    throw new Error(
      "Role could not be found."
    );
  }

  await prisma.role.update({
    where: {
      id,
    },
    data: {
      isActive: !role.isActive,
    },
  });

  redirect(`/settings/roles/${id}`);
}