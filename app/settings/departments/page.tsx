import Link from "next/link";

import { prisma } from "@/app/lib/prisma";

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: {
      center: {
        select: {
          id: true,
          centerNumber: true,
          displayName: true,
          isActive: true,
        },
      },
      _count: {
        select: {
          activities: true,
        },
      },
    },
    orderBy: [
      {
        name: "asc",
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
              Departments
            </h1>

            <p className="mt-2 max-w-2xl text-neutral-400">
              Configure the operational departments available within each
              center.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/settings/centers"
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold transition hover:bg-neutral-900"
            >
              Centers
            </Link>

            <Link
              href="/settings/departments/new"
              className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              + New Department
            </Link>
          </div>
        </div>

        {departments.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Departments Yet
            </h2>

            <p className="mt-2 text-neutral-400">
              Create the first department to begin configuring the workforce
              structure.
            </p>

            <Link
              href="/settings/departments/new"
              className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Create Department
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-900 text-sm text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Department
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Center
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Key
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Assignments
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
                  {departments.map((department) => (
                    <tr
                      key={department.id}
                      className="transition hover:bg-neutral-900/60"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold">
                          {department.name}
                        </div>

                        {department.description && (
                          <div className="mt-1 max-w-md text-sm text-neutral-500">
                            {department.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-medium">
                          {department.center.displayName}
                        </div>

                        <div className="mt-1 text-sm text-neutral-500">
                          Center {department.center.centerNumber}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <code className="rounded bg-neutral-900 px-2 py-1 text-sm text-neutral-300">
                          {department.key}
                        </code>
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {department._count.activities}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            department.isActive
                              ? "bg-green-950 text-green-300"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {department.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/settings/departments/${department.id}`}
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