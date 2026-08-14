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
    throw new Error(
      "Transfer date is required."
    );
  }

  const parsed = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(
      "Transfer date is invalid."
    );
  }

  return parsed;
}

export async function transferWorker(
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

  const transferDate = parseRequiredDate(
    formData.get("transferDate")
  );

  const updateHomeCenter =
    formData.get("updateHomeCenter") === "on";

  if (
    !workerId ||
    !centerId ||
    !departmentId
  ) {
    throw new Error(
      "Worker, destination center, and destination department are required."
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
      "The worker is unavailable."
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
      "The destination center is unavailable."
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
      "The destination department is unavailable."
    );
  }

  if (department.centerId !== centerId) {
    throw new Error(
      "The destination department does not belong to the selected center."
    );
  }

  await prisma.$transaction(async (tx) => {
    const currentPrimary =
      await tx.workerAssignment.findFirst({
        where: {
          workerId,
          isActive: true,
          isPrimary: true,
        },
        orderBy: {
          startDate: "desc",
        },
      });

    if (!currentPrimary) {
      throw new Error(
        "This worker does not have an active primary assignment to transfer."
      );
    }

    if (
      transferDate < currentPrimary.startDate
    ) {
      throw new Error(
        "Transfer date cannot be before the current primary assignment start date."
      );
    }

    const existingDestination =
      await tx.workerAssignment.findFirst({
        where: {
          workerId,
          centerId,
          departmentId,
          isActive: true,
        },
      });

    if (
      existingDestination?.id ===
      currentPrimary.id
    ) {
      throw new Error(
        "The worker is already primarily assigned to this destination."
      );
    }

    // Close every currently active primary assignment.
    await tx.workerAssignment.updateMany({
      where: {
        workerId,
        isActive: true,
        isPrimary: true,
      },
      data: {
        endDate: transferDate,
        isActive: false,
        isPrimary: false,
      },
    });

    /*
      If the destination already exists as an active
      secondary assignment, promote it instead of
      manufacturing a duplicate record.
    */
    if (existingDestination) {
      await tx.workerAssignment.update({
        where: {
          id: existingDestination.id,
        },
        data: {
          isPrimary: true,
        },
      });
    } else {
      await tx.workerAssignment.create({
        data: {
          workerId,
          centerId,
          departmentId,
          startDate: transferDate,
          endDate: null,
          isPrimary: true,
          isActive: true,
        },
      });
    }

    if (updateHomeCenter) {
      await tx.worker.update({
        where: {
          id: workerId,
        },
        data: {
          homeCenterId: centerId,
        },
      });
    }
  });

  redirect(`/settings/workers/${workerId}`);
}