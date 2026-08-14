import Link from "next/link";

import { prisma } from "@/app/lib/prisma";

export default async function WorkersPage() {
  const workers = await prisma.worker.findMany({
    include: {
      homeCenter: {
        select: {
          id: true,
          centerNumber: true,
          displayName: true,
          isActive: true,
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
    orderBy: [
      {
        lastName: "asc",
      },
      {
        firstName: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
              Workforce Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Workers
            </h1>

            <p className="mt-2 max-w-2xl text-neutral-400">
              Manage workforce identities and home-center relationships across
              the enterprise.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/settings/departments"
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold transition hover:bg-neutral-900"
            >
              Departments
            </Link>

            <Link
              href="/settings/workers/new"
              className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              + New Worker
            </Link>
          </div>
        </div>

        {workers.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Workers Yet
            </h2>

            <p className="mt-2 text-neutral-400">
              Add the first worker to begin building the enterprise workforce.
            </p>

            <Link
              href="/settings/workers/new"
              className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Create Worker
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-900 text-sm text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Worker
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Employee ID
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Home Center
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Assignments
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Roles
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Capabilities
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800 bg-neutral-950">
                  {workers.map((worker) => (
                    <tr
                      key={worker.id}
                      className="transition hover:bg-neutral-900/60"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold">
                          {worker.displayName}
                        </div>

                        <div className="mt-1 text-sm text-neutral-500">
                          {worker.email ?? "No email"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {worker.employeeId ?? "—"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-medium">
                          {worker.homeCenter.displayName}
                        </div>

                        <div className="mt-1 text-sm text-neutral-500">
                          Center {worker.homeCenter.centerNumber}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {worker._count.assignments}
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {worker._count.roles}
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {worker._count.capabilities}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            worker.isActive
                              ? "bg-green-950 text-green-300"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {worker.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/settings/workers/${worker.id}`}
                          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold transition hover:bg-neutral-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}