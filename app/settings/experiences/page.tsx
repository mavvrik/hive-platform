import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { toggleExperienceStatus } from "./actions";

export default async function ExperiencesPage() {
  const experiences = await prisma.experience.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
              Platform Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Center Experiences
            </h1>

            <p className="mt-2 text-neutral-400">
              Create and manage the interaction experience assigned to each
              center.
            </p>
          </div>

          <Link
            href="/settings/experiences/new"
            className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-300"
          >
            + New Experience
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Center Experiences Yet
            </h2>

            <p className="mt-2 text-neutral-400">
              Create your first Center Experience to begin configuring the
              platform.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {experience.name}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      {experience.key}
                    </p>

                    {experience.description && (
                      <p className="mt-3 text-neutral-300">
                        {experience.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="mr-3 text-right">
                      <div
                        className={`text-sm font-semibold ${
                          experience.isActive
                            ? "text-green-400"
                            : "text-neutral-500"
                        }`}
                      >
                        {experience.isActive ? "Active" : "Inactive"}
                      </div>

                      <div className="mt-1 text-xs text-neutral-500">
                        Version {experience.version}
                      </div>
                    </div>

                    <Link
                      href={`/settings/experiences/${experience.id}`}
                      className="rounded-lg border border-neutral-700 px-4 py-2 text-sm transition hover:bg-neutral-800"
                    >
                      Edit
                    </Link>

                    <form action={toggleExperienceStatus}>
                      <input
                        type="hidden"
                        name="id"
                        value={experience.id}
                      />

                      <button
                        type="submit"
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                          experience.isActive
                            ? "bg-red-900 text-red-200 hover:bg-red-800"
                            : "bg-green-900 text-green-200 hover:bg-green-800"
                        }`}
                      >
                        {experience.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}