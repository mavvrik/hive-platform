import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

import {
  toggleWorkerStatus,
  updateWorker,
} from "./actions";

import {
  endAssignment,
  makeAssignmentPrimary,
} from "./assignments/actions";

import {
  assignWorkerCapability,
  assignWorkerRole,
  removeWorkerCapability,
  removeWorkerRole,
} from "./relationships/actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateForInput(
  value: Date | null
): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function formatDisplayDate(
  value: Date | null
): string {
  if (!value) {
    return "Current";
  }

  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function todayForInput(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function EditWorkerPage({
  params,
}: PageProps) {
  const { id } = await params;

  const [
    worker,
    centers,
    activeRoles,
    activeCapabilities,
  ] = await Promise.all([
    prisma.worker.findUnique({
      where: {
        id,
      },

      include: {
        homeCenter: true,

        assignments: {
          include: {
            center: true,
            department: true,
          },

          orderBy: [
            {
              isActive: "desc",
            },
            {
              isPrimary: "desc",
            },
            {
              startDate: "desc",
            },
          ],
        },

        roles: {
          include: {
            role: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },

        capabilities: {
          include: {
            capability: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },

        _count: {
          select: {
            assignments: true,
            roles: true,
            capabilities: true,
          },
        },
      },
    }),

    prisma.center.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        centerNumber: true,
        displayName: true,
      },

      orderBy: {
        centerNumber: "asc",
      },
    }),

    prisma.role.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    prisma.capability.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!worker) {
    notFound();
  }

  const activePrimary =
    worker.assignments.find(
      (assignment) =>
        assignment.isActive &&
        assignment.isPrimary
    );

  const assignedRoleIds = new Set(
    worker.roles.map(
      (workerRole) =>
        workerRole.roleId
    )
  );

  const assignedCapabilityIds =
    new Set(
      worker.capabilities.map(
        (workerCapability) =>
          workerCapability.capabilityId
      )
    );

  const availableRoles =
    activeRoles.filter(
      (role) =>
        !assignedRoleIds.has(role.id)
    );

  const availableCapabilities =
    activeCapabilities.filter(
      (capability) =>
        !assignedCapabilityIds.has(
          capability.id
        )
    );

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/settings/workers"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              ← Back to Workers
            </Link>

            <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
              Workforce Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Edit {worker.displayName}
            </h1>

            <p className="mt-2 text-neutral-400">
              Home Center{" "}
              {worker.homeCenter.centerNumber} —{" "}
              {worker.homeCenter.displayName}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              worker.isActive
                ? "bg-green-950 text-green-300"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {worker.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        {/* ==============================================
            WORKER IDENTITY
        ============================================== */}

        <form
          action={updateWorker}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={worker.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Worker Identity
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  name="firstName"
                  required
                  defaultValue={
                    worker.firstName
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  name="lastName"
                  required
                  defaultValue={
                    worker.lastName
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Employee ID
                </label>

                <input
                  name="employeeId"
                  defaultValue={
                    worker.employeeId ?? ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  defaultValue={
                    worker.email ?? ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hire Date
                </label>

                <input
                  name="hireDate"
                  type="date"
                  defaultValue={formatDateForInput(
                    worker.hireDate
                  )}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Photo URL
                </label>

                <input
                  name="photoUrl"
                  type="url"
                  defaultValue={
                    worker.photoUrl ?? ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          {/* ==============================================
              HOME CENTER
          ============================================== */}

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Home Center
            </h2>

            <select
              name="homeCenterId"
              required
              defaultValue={
                worker.homeCenterId
              }
              className="mt-6 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
            >
              {centers.map((center) => (
                <option
                  key={center.id}
                  value={center.id}
                >
                  {center.centerNumber} —{" "}
                  {center.displayName}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm text-neutral-500">
              Home Center remains separate
              from operational assignment
              history.
            </p>
          </section>

          <div className="flex justify-between gap-3">
            <Link
              href="/settings/workers"
              className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black"
            >
              Save Worker
            </button>
          </div>
        </form>

        {/* ==============================================
            ROLES
        ============================================== */}

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-amber-400">
              Responsibility
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Roles
            </h2>

            <p className="mt-2 text-neutral-400">
              Roles describe the worker&apos;s
              responsibility or authority.
              They do not automatically imply
              operational capability.
            </p>
          </div>

          {worker.roles.length === 0 ? (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
              <p className="text-neutral-400">
                No roles assigned.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {worker.roles.map(
                (workerRole) => (
                  <div
                    key={workerRole.id}
                    className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {
                            workerRole
                              .role.name
                          }
                        </p>

                        {!workerRole.role
                          .isActive && (
                          <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
                            Inactive Role
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-neutral-500">
                        {
                          workerRole
                            .role.key
                        }
                      </p>

                      {workerRole.role
                        .description && (
                        <p className="mt-2 text-sm text-neutral-400">
                          {
                            workerRole
                              .role
                              .description
                          }
                        </p>
                      )}
                    </div>

                    <form
                      action={
                        removeWorkerRole
                      }
                    >
                      <input
                        type="hidden"
                        name="workerId"
                        value={worker.id}
                      />

                      <input
                        type="hidden"
                        name="roleId"
                        value={
                          workerRole.roleId
                        }
                      />

                      <button
                        type="submit"
                        className="rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-900"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                )
              )}
            </div>
          )}

          {worker.isActive && (
            <div className="mt-6 border-t border-neutral-800 pt-6">
              <h3 className="font-semibold">
                Assign Role
              </h3>

              {availableRoles.length ===
              0 ? (
                <p className="mt-3 text-sm text-neutral-500">
                  All active roles are
                  already assigned to this
                  worker.
                </p>
              ) : (
                <form
                  action={
                    assignWorkerRole
                  }
                  className="mt-4 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="hidden"
                    name="workerId"
                    value={worker.id}
                  />

                  <select
                    name="roleId"
                    required
                    defaultValue=""
                    className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select a role
                    </option>

                    {availableRoles.map(
                      (role) => (
                        <option
                          key={role.id}
                          value={role.id}
                        >
                          {role.name}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="submit"
                    className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black hover:bg-amber-300"
                  >
                    Assign Role
                  </button>
                </form>
              )}
            </div>
          )}
        </section>

        {/* ==============================================
            CAPABILITIES
        ============================================== */}

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-amber-400">
              Qualification
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Capabilities
            </h2>

            <p className="mt-2 text-neutral-400">
              Capabilities describe the
              operational functions this
              worker is trained or qualified
              to perform.
            </p>
          </div>

          {worker.capabilities.length ===
          0 ? (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
              <p className="text-neutral-400">
                No capabilities assigned.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {worker.capabilities.map(
                (workerCapability) => (
                  <div
                    key={
                      workerCapability.id
                    }
                    className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-5"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {
                            workerCapability
                              .capability
                              .name
                          }
                        </p>

                        {!workerCapability
                          .capability
                          .isActive && (
                          <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-neutral-500">
                        {
                          workerCapability
                            .capability.key
                        }
                      </p>

                      {workerCapability
                        .capability
                        .description && (
                        <p className="mt-2 text-sm text-neutral-400">
                          {
                            workerCapability
                              .capability
                              .description
                          }
                        </p>
                      )}
                    </div>

                    <form
                      action={
                        removeWorkerCapability
                      }
                    >
                      <input
                        type="hidden"
                        name="workerId"
                        value={worker.id}
                      />

                      <input
                        type="hidden"
                        name="capabilityId"
                        value={
                          workerCapability
                            .capabilityId
                        }
                      />

                      <button
                        type="submit"
                        className="rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-900"
                      >
                        Remove Capability
                      </button>
                    </form>
                  </div>
                )
              )}
            </div>
          )}

          {worker.isActive && (
            <div className="mt-6 border-t border-neutral-800 pt-6">
              <h3 className="font-semibold">
                Assign Capability
              </h3>

              {availableCapabilities.length ===
              0 ? (
                <p className="mt-3 text-sm text-neutral-500">
                  All active capabilities are
                  already assigned to this
                  worker.
                </p>
              ) : (
                <form
                  action={
                    assignWorkerCapability
                  }
                  className="mt-4 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="hidden"
                    name="workerId"
                    value={worker.id}
                  />

                  <select
                    name="capabilityId"
                    required
                    defaultValue=""
                    className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select a capability
                    </option>

                    {availableCapabilities.map(
                      (capability) => (
                        <option
                          key={
                            capability.id
                          }
                          value={
                            capability.id
                          }
                        >
                          {
                            capability.name
                          }
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="submit"
                    className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black hover:bg-amber-300"
                  >
                    Assign Capability
                  </button>
                </form>
              )}
            </div>
          )}
        </section>

        {/* ==============================================
            ASSIGNMENT HISTORY
        ============================================== */}

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Assignment History
              </h2>

              <p className="mt-2 text-neutral-400">
                Active assignments and
                preserved historical records.
              </p>
            </div>

            {worker.isActive && (
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/settings/workers/${worker.id}/assignments/new`}
                  className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold hover:bg-neutral-800"
                >
                  + New Assignment
                </Link>

                {activePrimary && (
                  <Link
                    href={`/settings/workers/${worker.id}/assignments/transfer`}
                    className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black hover:bg-amber-300"
                  >
                    Transfer
                  </Link>
                )}
              </div>
            )}
          </div>

          {worker.assignments.length ===
          0 ? (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-8 text-center">
              No assignment history.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {worker.assignments.map(
                (assignment) => (
                  <div
                    key={assignment.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold">
                            {
                              assignment
                                .center
                                .centerNumber
                            }{" "}
                            —{" "}
                            {
                              assignment
                                .center
                                .displayName
                            }
                          </p>

                          {assignment.isPrimary && (
                            <span className="rounded-full bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-300">
                              Primary
                            </span>
                          )}

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              assignment.isActive
                                ? "bg-green-950 text-green-300"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {assignment.isActive
                              ? "Active"
                              : "Historical"}
                          </span>
                        </div>

                        <p className="mt-2 text-neutral-300">
                          {assignment
                            .department
                            ?.name ??
                            "No Department"}
                        </p>

                        <p className="mt-2 text-sm text-neutral-500">
                          {formatDisplayDate(
                            assignment.startDate
                          )}{" "}
                          →{" "}
                          {formatDisplayDate(
                            assignment.endDate
                          )}
                        </p>
                      </div>

                      {assignment.isActive && (
                        <div className="flex flex-col gap-3 sm:flex-row">
                          {!assignment.isPrimary && (
                            <form
                              action={
                                makeAssignmentPrimary
                              }
                            >
                              <input
                                type="hidden"
                                name="workerId"
                                value={
                                  worker.id
                                }
                              />

                              <input
                                type="hidden"
                                name="assignmentId"
                                value={
                                  assignment.id
                                }
                              />

                              <button
                                type="submit"
                                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold hover:bg-neutral-800"
                              >
                                Make Primary
                              </button>
                            </form>
                          )}

                          <form
                            action={
                              endAssignment
                            }
                            className="flex gap-2"
                          >
                            <input
                              type="hidden"
                              name="workerId"
                              value={
                                worker.id
                              }
                            />

                            <input
                              type="hidden"
                              name="assignmentId"
                              value={
                                assignment.id
                              }
                            />

                            <input
                              name="endDate"
                              type="date"
                              required
                              defaultValue={todayForInput()}
                              className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
                            />

                            <button
                              type="submit"
                              className="rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-900"
                            >
                              End Assignment
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==============================================
            WORKFORCE SUMMARY
        ============================================== */}

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Workforce Relationships
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Assignments
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  worker._count
                    .assignments
                }
              </p>
            </div>

            <div className="rounded-xl bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Roles
              </p>

              <p className="mt-2 text-3xl font-bold">
                {worker._count.roles}
              </p>
            </div>

            <div className="rounded-xl bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Capabilities
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  worker._count
                    .capabilities
                }
              </p>
            </div>
          </div>
        </section>

        {/* ==============================================
            WORKER STATUS
        ============================================== */}

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Worker Status
          </h2>

          <p className="mt-2 text-neutral-400">
            Inactive workers retain their
            historical workforce records but
            cannot receive new roles,
            capabilities, or assignments.
          </p>

          <form
            action={toggleWorkerStatus}
            className="mt-6"
          >
            <input
              type="hidden"
              name="id"
              value={worker.id}
            />

            <button
              type="submit"
              className={`rounded-xl px-6 py-3 font-semibold ${
                worker.isActive
                  ? "bg-red-950 text-red-200"
                  : "bg-green-950 text-green-200"
              }`}
            >
              {worker.isActive
                ? "Deactivate Worker"
                : "Activate Worker"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}