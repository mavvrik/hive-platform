import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import { transferWorker } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function todayForInput(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function TransferWorkerPage({
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
              centerNumber: true,
              displayName: true,
            },
          },
          assignments: {
            where: {
              isActive: true,
              isPrimary: true,
            },
            include: {
              center: true,
              department: true,
            },
            orderBy: {
              startDate: "desc",
            },
            take: 1,
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

  const currentPrimary =
    worker.assignments[0];

  if (!worker.isActive) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/settings/workers/${worker.id}`}
            className="text-amber-400"
          >
            ← Back to Worker
          </Link>

          <h1 className="mt-8 text-3xl font-bold">
            Worker Is Inactive
          </h1>
        </div>
      </main>
    );
  }

  if (!currentPrimary) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/settings/workers/${worker.id}`}
            className="text-amber-400"
          >
            ← Back to Worker
          </Link>

          <div className="mt-8 rounded-2xl border border-amber-900 bg-amber-950/20 p-8">
            <h1 className="text-3xl font-bold">
              No Primary Assignment
            </h1>

            <p className="mt-3 text-neutral-300">
              Create or designate a primary assignment before using the
              transfer workflow.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
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
          Transfer {worker.displayName}
        </h1>

        <section className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-sm text-neutral-500">
            Current Primary Assignment
          </p>

          <p className="mt-2 text-xl font-semibold">
            {currentPrimary.center.centerNumber} —{" "}
            {currentPrimary.center.displayName}
          </p>

          <p className="mt-1 text-neutral-400">
            {currentPrimary.department?.name ?? "No Department"}
          </p>
        </section>

        <form
          action={transferWorker}
          className="mt-8 space-y-8"
        >
          <input
            type="hidden"
            name="workerId"
            value={worker.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Destination
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Center
                </label>

                <select
                  name="centerId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                >
                  <option value="" disabled>
                    Select destination center
                  </option>

                  {centers.map((center) => (
                    <option
                      key={center.id}
                      value={center.id}
                    >
                      {center.centerNumber} — {center.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Department
                </label>

                <select
                  name="departmentId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                >
                  <option value="" disabled>
                    Select destination department
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Transfer Date
                </label>

                <input
                  name="transferDate"
                  type="date"
                  required
                  defaultValue={todayForInput()}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <label className="flex gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                <input
                  type="checkbox"
                  name="updateHomeCenter"
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block font-semibold">
                    Update Home Center
                  </span>

                  <span className="mt-1 block text-sm text-neutral-500">
                    Use this when the transfer represents a permanent move to
                    another center. Leave it unchecked for department-only or
                    temporary operational transfers.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <div className="flex justify-between gap-3">
            <Link
              href={`/settings/workers/${worker.id}`}
              className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
            >
              Complete Transfer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}