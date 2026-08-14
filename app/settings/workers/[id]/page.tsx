import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  toggleWorkerStatus,
  updateWorker,
} from "./actions";

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

export default async function EditWorkerPage({
  params,
}: PageProps) {
  const { id } = await params;

  const [
    worker,
    centers,
  ] = await Promise.all([
    prisma.worker.findUnique({
      where: {
        id,
      },
      include: {
        homeCenter: {
          select: {
            id: true,
            centerNumber: true,
            displayName: true,
          },
        },
        assignments: {
          include: {
            center: {
              select: {
                id: true,
                centerNumber: true,
                displayName: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
                key: true,
              },
            },
          },
          orderBy: [
            {
              isActive: "desc",
            },
            {
              startDate: "desc",
            },
          ],
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
  ]);

  if (!worker) {
    notFound();
  }

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
              Home Center {worker.homeCenter.centerNumber} —{" "}
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
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  required
                  defaultValue={worker.firstName}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  required
                  defaultValue={worker.lastName}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="employeeId"
                  className="mb-2 block text-sm font-medium"
                >
                  Employee ID
                </label>

                <input
                  id="employeeId"
                  name="employeeId"
                  defaultValue={worker.employeeId ?? ""}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={worker.email ?? ""}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="hireDate"
                  className="mb-2 block text-sm font-medium"
                >
                  Hire Date
                </label>

                <input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  defaultValue={formatDateForInput(
                    worker.hireDate
                  )}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="photoUrl"
                  className="mb-2 block text-sm font-medium"
                >
                  Photo URL
                </label>

                <input
                  id="photoUrl"
                  name="photoUrl"
                  type="url"
                  defaultValue={worker.photoUrl ?? ""}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Home Center
            </h2>

            <div className="mt-6">
              <label
                htmlFor="homeCenterId"
                className="mb-2 block text-sm font-medium"
              >
                Home Center
              </label>

              <select
                id="homeCenterId"
                name="homeCenterId"
                required
                defaultValue={worker.homeCenterId}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
              >
                {centers.map((center) => (
                  <option
                    key={center.id}
                    value={center.id}
                  >
                    {center.centerNumber} — {center.displayName}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-neutral-500">
                Home Center remains separate from operational assignment
                history.
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/settings/workers"
              className="rounded-xl border border-neutral-700 px-6 py-3 text-center font-semibold transition hover:bg-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Save Worker
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Assignment History
              </h2>

              <p className="mt-2 text-neutral-400">
                Track center and department relationships over time.
              </p>
            </div>

            {worker.isActive && (
              <Link
                href={`/settings/workers/${worker.id}/assignments/new`}
                className="rounded-xl bg-amber-400 px-5 py-3 text-center font-semibold text-black transition hover:bg-amber-300"
              >
                + New Assignment
              </Link>
            )}
          </div>

          {worker.assignments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-8 text-center">
              <p className="font-semibold">
                No Assignment History
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                This worker has not yet been assigned to an operational
                department.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-neutral-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-950 text-sm text-neutral-400">
                    <tr>
                      <th className="px-5 py-4 font-medium">
                        Center
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Department
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Start
                      </th>

                      <th className="px-5 py-4 font-medium">
                        End
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Primary
                      </th>

                      <th className="px-5 py-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-800">
                    {worker.assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td className="px-5 py-4">
                          <div className="font-medium">
                            {assignment.center.displayName}
                          </div>

                          <div className="mt-1 text-sm text-neutral-500">
                            Center {assignment.center.centerNumber}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {assignment.department?.name ?? "Unassigned"}
                        </td>

                        <td className="px-5 py-4 text-neutral-300">
                          {formatDisplayDate(
                            assignment.startDate
                          )}
                        </td>

                        <td className="px-5 py-4 text-neutral-300">
                          {formatDisplayDate(
                            assignment.endDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {assignment.isPrimary
                            ? "Yes"
                            : "No"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              assignment.isActive
                                ? "bg-green-950 text-green-300"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {assignment.isActive
                              ? "Active"
                              : "Historical"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Workforce Relationships
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Assignments
              </p>

              <p className="mt-2 text-3xl font-bold">
                {worker._count.assignments}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Roles
              </p>

              <p className="mt-2 text-3xl font-bold">
                {worker._count.roles}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Capabilities
              </p>

              <p className="mt-2 text-3xl font-bold">
                {worker._count.capabilities}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Worker Status
          </h2>

          <p className="mt-2 max-w-2xl text-neutral-400">
            Inactive workers remain in workforce history but should not receive
            new operational assignments.
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
              className={`rounded-xl px-6 py-3 font-semibold transition ${
                worker.isActive
                  ? "bg-red-950 text-red-200 hover:bg-red-900"
                  : "bg-green-950 text-green-200 hover:bg-green-900"
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