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

export async function createWorker(
  formData: FormData
) {
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
    !firstName ||
    !lastName ||
    !homeCenterId
  ) {
    throw new Error(
      "First name, last name, and home center are required."
    );
  }

  const homeCenter =
    await prisma.center.findUnique({
      where: {
        id: homeCenterId,
      },
      select: {
        id: true,
        isActive: true,
        centerNumber: true,
      },
    });

  if (!homeCenter || !homeCenter.isActive) {
    throw new Error(
      "The selected home center is unavailable."
    );
  }

  if (employeeId) {
    const existingEmployeeId =
      await prisma.worker.findUnique({
        where: {
          employeeId,
        },
        select: {
          id: true,
        },
      });

    if (existingEmployeeId) {
      throw new Error(
        `Employee ID ${employeeId} is already assigned to another worker.`
      );
    }
  }

  const displayName =
    `${firstName} ${lastName}`.trim();

  await prisma.worker.create({
    data: {
      employeeId,
      firstName,
      lastName,
      displayName,
      email,
      photoUrl,
      hireDate,
      isActive: true,
      homeCenterId,
    },
  });

  redirect("/settings/workers");
}