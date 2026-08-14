import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { createWorkerAssignment } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function todayForInput(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewWorkerAssignmentPage({
  params,
}: PageProps) {
  const { id } = await params;

  const [worker, centers] =
    await Promise.all([
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
          departments: {
            where: {
              isActive: true,
            },
            select: {
              id: true,
              name: true,
              key: true,
            },
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          centerNumber: "asc",
        },
      }),
    ]);

  if (!worker) {
    notFound();
  }

  if (!worker.isActive) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/settings/workers/${worker.id}`}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Worker
          </Link>

          <div className="mt-8 rounded-2xl border border-red-900 bg-red-950/30 p-8">
            <h1 className="text-3xl font-bold">
              Worker Is Inactive
            </h1>

            <p className="mt-3 text-neutral-300">
              Reactivate this worker before creating a new assignment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href={`/settings/workers/${worker.id}`}
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Worker
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
            Workforce Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            New Assignment
          </h1>

          <p className="mt-2 text-neutral-400">
            Create a center and department assignment for{" "}
            {worker.displayName}.
          </p>
        </div>

        <form
          action={createWorkerAssignment}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="workerId"
            value={worker.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Worker
            </h2>

            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-lg font-semibold">
                {worker.displayName}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Home Center {worker.homeCenter.centerNumber} —{" "}
                {worker.homeCenter.displayName}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Assignment
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label
                  htmlFor="centerId"
                  className="mb-2 block text-sm font-medium"
                >
                  Center
                </label>

                <select
                  id="centerId"
                  name="centerId"
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
                  A worker can have assignments outside their Home Center
                  without changing their worker identity.
                </p>
              </div>

              <div>
                <label
                  htmlFor="departmentId"
                  className="mb-2 block text-sm font-medium"
                >
                  Department
                </label>

                <select
                  id="departmentId"
                  name="departmentId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select a department
                  </option>

                  {centers.flatMap((center) =>
                    center.departments.map((department) => (
                      <option
                        key={department.id}
                        value={department.id}
                      >
                        {center.centerNumber} — {department.name}
                      </option>
                    ))
                  )}
                </select>

                <p className="mt-2 text-sm text-neutral-500">
                  The server verifies that the selected department belongs to
                  the selected center.
                </p>
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  defaultValue={todayForInput()}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                <input
                  type="checkbox"
                  name="isPrimary"
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block font-semibold">
                    Primary Assignment
                  </span>

                  <span className="mt-1 block text-sm text-neutral-500">
                    Marking this assignment as primary will remove primary
                    status from any other active assignment for this worker.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href={`/settings/workers/${worker.id}`}
              className="rounded-xl border border-neutral-700 px-6 py-3 text-center font-semibold transition hover:bg-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}