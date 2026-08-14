"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

function cleanRequired(
  value: FormDataEntryValue | null
): string {
  return String(value ?? "").trim();
}

function parseRequiredDate(
  value: FormDataEntryValue | null
): Date {
  const cleaned = String(value ?? "").trim();

  if (!cleaned) {
    throw new Error("Start date is required.");
  }

  const parsed = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Start date is invalid.");
  }

  return parsed;
}

export async function createWorkerAssignment(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const centerId = cleanRequired(
    formData.get("centerId")
  );

  const departmentId = cleanRequired(
    formData.get("departmentId")
  );

  const startDate = parseRequiredDate(
    formData.get("startDate")
  );

  const isPrimary =
    formData.get("isPrimary") === "on";

  if (
    !workerId ||
    !centerId ||
    !departmentId
  ) {
    throw new Error(
      "Worker, center, and department are required."
    );
  }

  const worker =
    await prisma.worker.findUnique({
      where: {
        id: workerId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!worker || !worker.isActive) {
    throw new Error(
      "The selected worker is unavailable."
    );
  }

  const center =
    await prisma.center.findUnique({
      where: {
        id: centerId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!center || !center.isActive) {
    throw new Error(
      "The selected center is unavailable."
    );
  }

  const department =
    await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
      select: {
        id: true,
        centerId: true,
        isActive: true,
      },
    });

  if (!department || !department.isActive) {
    throw new Error(
      "The selected department is unavailable."
    );
  }

  if (department.centerId !== centerId) {
    throw new Error(
      "The selected department does not belong to the selected center."
    );
  }

  const existingActiveAssignment =
    await prisma.workerAssignment.findFirst({
      where: {
        workerId,
        centerId,
        departmentId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

  if (existingActiveAssignment) {
    throw new Error(
      "This worker already has an active assignment in this department."
    );
  }

  await prisma.$transaction(async (tx) => {
    if (isPrimary) {
      await tx.workerAssignment.updateMany({
        where: {
          workerId,
          isActive: true,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    await tx.workerAssignment.create({
      data: {
        workerId,
        centerId,
        departmentId,
        startDate,
        endDate: null,
        isPrimary,
        isActive: true,
      },
    });
  });

  redirect(`/settings/workers/${workerId}`);
}