import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { createDepartment } from "./actions";

export default async function NewDepartmentPage() {
  const centers = await prisma.center.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      centerNumber: true,
      displayName: true,
      region: {
        select: {
          name: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      centerNumber: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/settings/departments"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Departments
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
            Workforce Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Department
          </h1>

          <p className="mt-2 text-neutral-400">
            Add an operational department to a specific enterprise center.
          </p>
        </div>

        <form
          action={createDepartment}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Center Assignment
            </h2>

            <div className="mt-6">
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
                defaultValue=""
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
              >
                <option
                  value=""
                  disabled
                >
                  Select a center
                </option>

                {centers.map((center) => (
                  <option
                    key={center.id}
                    value={center.id}
                  >
                    {center.centerNumber} — {center.displayName}
                    {center.region
                      ? ` — ${center.region.name}`
                      : ""}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-neutral-500">
                Departments belong to one center and remain isolated from
                other centers.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Department Identity
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Department Name
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Phlebotomy"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="key"
                  className="mb-2 block text-sm font-medium"
                >
                  Department Key
                </label>

                <input
                  id="key"
                  name="key"
                  required
                  placeholder="phlebotomy"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  The key is normalized automatically and only needs to be
                  unique within this center.
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Optional description of this department."
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/settings/departments"
              className="rounded-xl border border-neutral-700 px-6 py-3 text-center font-semibold transition hover:bg-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Create Department
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}