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

function normalizeDepartmentKey(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function updateDepartment(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

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

  if (
    !id ||
    !centerId ||
    !name ||
    !rawKey
  ) {
    throw new Error(
      "Department ID, center, name, and key are required."
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

  const department =
    await prisma.department.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!department) {
    throw new Error(
      "Department could not be found."
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

  const duplicate =
    await prisma.department.findFirst({
      where: {
        centerId,
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
      `Department key "${key}" already exists for Center ${center.centerNumber}.`
    );
  }

  await prisma.department.update({
    where: {
      id,
    },
    data: {
      centerId,
      name,
      key,
      description,
    },
  });

  redirect("/settings/departments");
}

export async function toggleDepartmentStatus(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  if (!id) {
    throw new Error(
      "Department ID is required."
    );
  }

  const department =
    await prisma.department.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });

  if (!department) {
    throw new Error(
      "Department could not be found."
    );
  }

  await prisma.department.update({
    where: {
      id,
    },
    data: {
      isActive:
        !department.isActive,
    },
  });

  redirect(
    `/settings/departments/${id}`
  );
}