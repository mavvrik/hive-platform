import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { createCenter } from "./actions";

export default async function NewCenterPage() {
  const [regions, experiences] =
    await Promise.all([
      prisma.region.findMany({
        where: {
          isActive: true,
        },
        include: {
          organization: true,
        },
        orderBy: [
          {
            organization: {
              name: "asc",
            },
          },
          {
            name: "asc",
          },
        ],
      }),

      prisma.experience.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/settings/centers"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Centers
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
            Platform Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Center
          </h1>

          <p className="mt-2 text-neutral-400">
            Add a center and assign its enterprise region and operating
            experience.
          </p>
        </div>

        <form
          action={createCenter}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Center Identity
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="centerNumber"
                  className="mb-2 block text-sm font-medium"
                >
                  Center Number
                </label>

                <input
                  id="centerNumber"
                  name="centerNumber"
                  required
                  placeholder="115"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Center Name
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Riviera Beach"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-medium"
                >
                  Display Name
                </label>

                <input
                  id="displayName"
                  name="displayName"
                  required
                  placeholder="Riviera Beach"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  This is the name displayed throughout the platform.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Location
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-medium"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  placeholder="FL"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-sm font-medium"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  required
                  defaultValue="US"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="timezone"
                  className="mb-2 block text-sm font-medium"
                >
                  Time Zone
                </label>

                <input
                  id="timezone"
                  name="timezone"
                  required
                  defaultValue="America/New_York"
                  placeholder="America/New_York"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  Use an IANA time zone such as America/New_York.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Enterprise Assignment
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label
                  htmlFor="regionId"
                  className="mb-2 block text-sm font-medium"
                >
                  Region
                </label>

                <select
                  id="regionId"
                  name="regionId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select a region
                  </option>

                  {regions.map((region) => (
                    <option
                      key={region.id}
                      value={region.id}
                    >
                      {region.organization.name} — {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="experienceId"
                  className="mb-2 block text-sm font-medium"
                >
                  Center Experience
                </label>

                <select
                  id="experienceId"
                  name="experienceId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select an experience
                  </option>

                  {experiences.map((experience) => (
                    <option
                      key={experience.id}
                      value={experience.id}
                    >
                      {experience.name}
                      {experience.isDefault
                        ? " — Default"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between">
            <Link
              href="/settings/centers"
              className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold transition hover:bg-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Create Center
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}