import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  toggleCenterStatus,
  updateCenter,
} from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCenterPage({
  params,
}: PageProps) {
  const { id } = await params;

  const [
    center,
    regions,
    experiences,
  ] = await Promise.all([
    prisma.center.findUnique({
      where: {
        id,
      },
      include: {
        region: {
          include: {
            organization: true,
          },
        },
        experience: true,
      },
    }),

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

  if (!center) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
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
              Edit {center.displayName}
            </h1>

            <p className="mt-2 text-neutral-400">
              Center {center.centerNumber}
            </p>
          </div>

          <div
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              center.isActive
                ? "bg-green-950 text-green-300"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {center.isActive
              ? "Active"
              : "Inactive"}
          </div>
        </div>

        <form
          action={updateCenter}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={center.id}
          />

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
                  defaultValue={
                    center.centerNumber
                  }
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
                  defaultValue={
                    center.name
                  }
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
                  defaultValue={
                    center.displayName
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
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
                  defaultValue={
                    center.state ?? ""
                  }
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
                  defaultValue={
                    center.country
                  }
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
                  defaultValue={
                    center.timezone
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
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
                  defaultValue={
                    center.regionId ?? ""
                  }
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
                      {
                        region
                          .organization
                          .name
                      }{" "}
                      — {region.name}
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
                  defaultValue={
                    center.experienceId ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select an experience
                  </option>

                  {experiences.map(
                    (experience) => (
                      <option
                        key={
                          experience.id
                        }
                        value={
                          experience.id
                        }
                      >
                        {
                          experience.name
                        }
                        {experience.isDefault
                          ? " — Default"
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-500">
                Current Experience
              </p>

              <p className="mt-1 font-semibold">
                {center.experience
                  ?.name ??
                  "Unassigned"}
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/settings/centers"
              className="rounded-xl border border-neutral-700 px-6 py-3 text-center font-semibold transition hover:bg-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Save Center
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Center Status
          </h2>

          <p className="mt-2 text-neutral-400">
            Inactive centers are excluded from
            the active-center selector.
          </p>

          <form
            action={toggleCenterStatus}
            className="mt-6"
          >
            <input
              type="hidden"
              name="id"
              value={center.id}
            />

            <button
              type="submit"
              className={`rounded-xl px-6 py-3 font-semibold transition ${
                center.isActive
                  ? "bg-red-950 text-red-200 hover:bg-red-900"
                  : "bg-green-950 text-green-200 hover:bg-green-900"
              }`}
            >
              {center.isActive
                ? "Deactivate Center"
                : "Activate Center"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}