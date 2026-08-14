"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

function cleanRequired(
  value: FormDataEntryValue | null
): string {
  return String(value ?? "").trim();
}

function parseRequiredDate(
  value: FormDataEntryValue | null,
  label: string
): Date {
  const cleaned = String(value ?? "").trim();

  if (!cleaned) {
    throw new Error(`${label} is required.`);
  }

  const parsed = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${label} is invalid.`);
  }

  return parsed;
}

export async function makeAssignmentPrimary(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const assignmentId = cleanRequired(
    formData.get("assignmentId")
  );

  if (!workerId || !assignmentId) {
    throw new Error(
      "Worker ID and assignment ID are required."
    );
  }

  const assignment =
    await prisma.workerAssignment.findUnique({
      where: {
        id: assignmentId,
      },
      select: {
        id: true,
        workerId: true,
        isActive: true,
      },
    });

  if (
    !assignment ||
    assignment.workerId !== workerId
  ) {
    throw new Error(
      "Assignment could not be found."
    );
  }

  if (!assignment.isActive) {
    throw new Error(
      "Historical assignments cannot be made primary."
    );
  }

  await prisma.$transaction(async (tx) => {
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

    await tx.workerAssignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        isPrimary: true,
      },
    });
  });

  redirect(`/settings/workers/${workerId}`);
}

export async function endAssignment(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const assignmentId = cleanRequired(
    formData.get("assignmentId")
  );

  const endDate = parseRequiredDate(
    formData.get("endDate"),
    "End date"
  );

  if (!workerId || !assignmentId) {
    throw new Error(
      "Worker ID and assignment ID are required."
    );
  }

  const assignment =
    await prisma.workerAssignment.findUnique({
      where: {
        id: assignmentId,
      },
      select: {
        id: true,
        workerId: true,
        startDate: true,
        isActive: true,
      },
    });

  if (
    !assignment ||
    assignment.workerId !== workerId
  ) {
    throw new Error(
      "Assignment could not be found."
    );
  }

  if (!assignment.isActive) {
    throw new Error(
      "This assignment has already ended."
    );
  }

  if (endDate < assignment.startDate) {
    throw new Error(
      "End date cannot be before the assignment start date."
    );
  }

  await prisma.workerAssignment.update({
    where: {
      id: assignmentId,
    },
    data: {
      endDate,
      isActive: false,
      isPrimary: false,
    },
  });

  redirect(`/settings/workers/${workerId}`);
}