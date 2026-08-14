import Link from "next/link";

import { prisma } from "@/app/lib/prisma";

export default async function CapabilitiesPage() {
  const capabilities = await prisma.capability.findMany({
    include: {
      _count: {
        select: {
          workers: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
              Workforce Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Capabilities
            </h1>

            <p className="mt-2 max-w-2xl text-neutral-400">
              Define enterprise workforce skills and operational
              qualifications independently from job roles and department
              assignments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/settings/roles"
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold transition hover:bg-neutral-900"
            >
              Roles
            </Link>

            <Link
              href="/settings/workers"
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold transition hover:bg-neutral-900"
            >
              Workers
            </Link>

            <Link
              href="/settings/capabilities/new"
              className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              + New Capability
            </Link>
          </div>
        </div>

        {capabilities.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Capabilities Yet
            </h2>

            <p className="mt-2 text-neutral-400">
              Create the first capability to begin defining workforce
              qualifications.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-900 text-sm text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Capability
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Key
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Workers
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
                  {capabilities.map((capability) => (
                    <tr
                      key={capability.id}
                      className="transition hover:bg-neutral-900/60"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold">
                          {capability.name}
                        </div>

                        {capability.description && (
                          <div className="mt-1 max-w-lg text-sm text-neutral-500">
                            {capability.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <code className="rounded bg-neutral-900 px-2 py-1 text-sm text-neutral-300">
                          {capability.key}
                        </code>
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {capability._count.workers}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            capability.isActive
                              ? "bg-green-950 text-green-300"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {capability.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/settings/capabilities/${capability.id}`}
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