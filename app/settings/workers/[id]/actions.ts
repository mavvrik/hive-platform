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

function parseOptionalDate(
  value: FormDataEntryValue | null
): Date | null {
  const cleaned = String(value ?? "").trim();

  if (!cleaned) {
    return null;
  }

  const parsed = new Date(`${cleaned}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Hire date is invalid.");
  }

  return parsed;
}

export async function updateWorker(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  const firstName = cleanRequired(
    formData.get("firstName")
  );

  const lastName = cleanRequired(
    formData.get("lastName")
  );

  const employeeId = cleanOptional(
    formData.get("employeeId")
  );

  const email = cleanOptional(
    formData.get("email")
  );

  const photoUrl = cleanOptional(
    formData.get("photoUrl")
  );

  const homeCenterId = cleanRequired(
    formData.get("homeCenterId")
  );

  const hireDate = parseOptionalDate(
    formData.get("hireDate")
  );

  if (
    !id ||
    !firstName ||
    !lastName ||
    !homeCenterId
  ) {
    throw new Error(
      "Worker ID, first name, last name, and home center are required."
    );
  }

  const worker =
    await prisma.worker.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!worker) {
    throw new Error(
      "Worker could not be found."
    );
  }

  const homeCenter =
    await prisma.center.findUnique({
      where: {
        id: homeCenterId,
      },
      select: {
        id: true,
        centerNumber: true,
        isActive: true,
      },
    });

  if (!homeCenter || !homeCenter.isActive) {
    throw new Error(
      "The selected home center is unavailable."
    );
  }

  if (employeeId) {
    const duplicateEmployeeId =
      await prisma.worker.findFirst({
        where: {
          employeeId,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

    if (duplicateEmployeeId) {
      throw new Error(
        `Employee ID ${employeeId} is already assigned to another worker.`
      );
    }
  }

  const displayName =
    `${firstName} ${lastName}`.trim();

  await prisma.worker.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      displayName,
      employeeId,
      email,
      photoUrl,
      hireDate,
      homeCenterId,
    },
  });

  redirect("/settings/workers");
}

export async function toggleWorkerStatus(
  formData: FormData
) {
  const id = cleanRequired(
    formData.get("id")
  );

  if (!id) {
    throw new Error(
      "Worker ID is required."
    );
  }

  const worker =
    await prisma.worker.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

  if (!worker) {
    throw new Error(
      "Worker could not be found."
    );
  }

  await prisma.worker.update({
    where: {
      id,
    },
    data: {
      isActive: !worker.isActive,
    },
  });

  redirect(
    `/settings/workers/${id}`
  );
}