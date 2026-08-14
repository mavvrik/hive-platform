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
      <div className="mx-auto max-w-5xl">
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
                  defaultValue={
                    worker.firstName
                  }
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
                  defaultValue={
                    worker.lastName
                  }
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
                  defaultValue={
                    worker.employeeId ?? ""
                  }
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
                  defaultValue={
                    worker.email ?? ""
                  }
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
                  defaultValue={
                    worker.photoUrl ?? ""
                  }
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
                defaultValue={
                  worker.homeCenterId
                }
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
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
                Changing Home Center updates the worker&apos;s primary
                enterprise home. Assignment history is managed separately.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
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

            <p className="mt-5 text-sm text-neutral-500">
              These relationships are managed independently so worker identity
              remains separate from operational assignments and access.
            </p>
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