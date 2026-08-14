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

function normalizeDepartmentKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createDepartment(
  formData: FormData
) {
  const centerId = cleanRequired(
    formData.get("centerId")
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

  if (!centerId || !name || !rawKey) {
    throw new Error(
      "Center, department name, and key are required."
    );
  }

  const key = normalizeDepartmentKey(
    rawKey
  );

  if (!key) {
    throw new Error(
      "Department key must contain at least one letter or number."
    );
  }

  const center =
    await prisma.center.findUnique({
      where: {
        id: centerId,
      },
      select: {
        id: true,
        centerNumber: true,
        isActive: true,
      },
    });

  if (!center || !center.isActive) {
    throw new Error(
      "The selected center is unavailable."
    );
  }

  const existingDepartment =
    await prisma.department.findUnique({
      where: {
        centerId_key: {
          centerId,
          key,
        },
      },
      select: {
        id: true,
      },
    });

  if (existingDepartment) {
    throw new Error(
      `Department key "${key}" already exists for Center ${center.centerNumber}.`
    );
  }

  await prisma.department.create({
    data: {
      centerId,
      name,
      key,
      description,
      isActive: true,
    },
  });

  redirect("/settings/departments");
}