import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { createWorker } from "./actions";

export default async function NewWorkerPage() {
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
            href="/settings/workers"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Workers
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
            Workforce Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Worker
          </h1>

          <p className="mt-2 text-neutral-400">
            Create the worker identity and establish their home center.
            Operational department assignments will be managed separately.
          </p>
        </div>

        <form
          action={createWorker}
          className="space-y-8"
        >
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
                  placeholder="Optional"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  Employee IDs must be unique when provided.
                </p>
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
                defaultValue=""
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
              >
                <option
                  value=""
                  disabled
                >
                  Select a home center
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

              <p className="mt-2 text-sm text-neutral-500">
                Home Center identifies the worker&apos;s primary enterprise
                home. Department assignments and assignment history are managed
                separately.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-6">
            <h2 className="text-lg font-semibold text-amber-300">
              Assignment Model
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Creating a worker does not automatically place them into
              Phlebotomy, Reception, Processing, Management, or any other
              department. That relationship will be created through workforce
              assignments so transfers and cross-training can be tracked
              historically.
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
              Create Worker
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}