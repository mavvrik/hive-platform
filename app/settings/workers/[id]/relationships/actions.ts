"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

function cleanRequired(
  value: FormDataEntryValue | null
): string {
  return String(value ?? "").trim();
}

export async function assignWorkerRole(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const roleId = cleanRequired(
    formData.get("roleId")
  );

  if (!workerId || !roleId) {
    throw new Error(
      "Worker ID and role are required."
    );
  }

  const [worker, role] =
    await Promise.all([
      prisma.worker.findUnique({
        where: {
          id: workerId,
        },
        select: {
          id: true,
          isActive: true,
        },
      }),

      prisma.role.findUnique({
        where: {
          id: roleId,
        },
        select: {
          id: true,
          isActive: true,
        },
      }),
    ]);

  if (!worker || !worker.isActive) {
    throw new Error(
      "The worker is unavailable."
    );
  }

  if (!role || !role.isActive) {
    throw new Error(
      "The selected role is unavailable."
    );
  }

  await prisma.workerRole.upsert({
    where: {
      workerId_roleId: {
        workerId,
        roleId,
      },
    },
    update: {},
    create: {
      workerId,
      roleId,
    },
  });

  redirect(`/settings/workers/${workerId}`);
}

export async function removeWorkerRole(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const roleId = cleanRequired(
    formData.get("roleId")
  );

  if (!workerId || !roleId) {
    throw new Error(
      "Worker ID and role ID are required."
    );
  }

  await prisma.workerRole.deleteMany({
    where: {
      workerId,
      roleId,
    },
  });

  redirect(`/settings/workers/${workerId}`);
}

export async function assignWorkerCapability(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const capabilityId = cleanRequired(
    formData.get("capabilityId")
  );

  if (!workerId || !capabilityId) {
    throw new Error(
      "Worker ID and capability are required."
    );
  }

  const [worker, capability] =
    await Promise.all([
      prisma.worker.findUnique({
        where: {
          id: workerId,
        },
        select: {
          id: true,
          isActive: true,
        },
      }),

      prisma.capability.findUnique({
        where: {
          id: capabilityId,
        },
        select: {
          id: true,
          isActive: true,
        },
      }),
    ]);

  if (!worker || !worker.isActive) {
    throw new Error(
      "The worker is unavailable."
    );
  }

  if (
    !capability ||
    !capability.isActive
  ) {
    throw new Error(
      "The selected capability is unavailable."
    );
  }

  await prisma.workerCapability.upsert({
    where: {
      workerId_capabilityId: {
        workerId,
        capabilityId,
      },
    },
    update: {},
    create: {
      workerId,
      capabilityId,
    },
  });

  redirect(`/settings/workers/${workerId}`);
}

export async function removeWorkerCapability(
  formData: FormData
) {
  const workerId = cleanRequired(
    formData.get("workerId")
  );

  const capabilityId = cleanRequired(
    formData.get("capabilityId")
  );

  if (!workerId || !capabilityId) {
    throw new Error(
      "Worker ID and capability ID are required."
    );
  }

  await prisma.workerCapability.deleteMany({
    where: {
      workerId,
      capabilityId,
    },
  });

  redirect(`/settings/workers/${workerId}`);
}