import Link from "next/link";

import { prisma } from "@/app/lib/prisma";

export default async function CentersPage() {
  const centers = await prisma.center.findMany({
    include: {
      region: {
        include: {
          organization: true,
        },
      },
      experience: true,
    },
    orderBy: {
      centerNumber: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
              Platform Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Centers
            </h1>

            <p className="mt-2 max-w-2xl text-neutral-400">
              Manage enterprise centers and the experiences assigned to them.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/settings/experiences"
              className="rounded-xl border border-neutral-700 px-5 py-3 font-semibold transition hover:bg-neutral-900"
            >
              Experiences
            </Link>

            <Link
              href="/settings/centers/new"
              className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              + New Center
            </Link>
          </div>
        </div>

        {centers.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Centers Yet
            </h2>

            <p className="mt-2 text-neutral-400">
              Create the first center to begin configuring the enterprise.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-900 text-sm text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Center
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Region
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Experience
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Time Zone
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
                  {centers.map((center) => (
                    <tr
                      key={center.id}
                      className="transition hover:bg-neutral-900/60"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold">
                          {center.displayName}
                        </div>

                        <div className="mt-1 text-sm text-neutral-500">
                          Center {center.centerNumber}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {center.region ? (
                          <>
                            <div>
                              {center.region.name}
                            </div>

                            <div className="mt-1 text-sm text-neutral-500">
                              {center.region.organization.name}
                            </div>
                          </>
                        ) : (
                          <span className="text-neutral-500">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {center.experience ? (
                          <>
                            <div className="font-medium">
                              {center.experience.name}
                            </div>

                            <div className="mt-1 text-sm text-neutral-500">
                              {center.experience.key}
                            </div>
                          </>
                        ) : (
                          <span className="text-neutral-500">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-neutral-300">
                        {center.timezone}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            center.isActive
                              ? "bg-green-950 text-green-300"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {center.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/settings/centers/${center.id}`}
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