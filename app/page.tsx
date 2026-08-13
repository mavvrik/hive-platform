import { setActiveCenter } from "@/app/actions/center-context";
import { getActiveCenter } from "@/app/lib/active-center";
import { prisma } from "@/app/lib/prisma";

export default async function Home() {
  const center = await getActiveCenter();

  const centers = await prisma.center.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      centerNumber: true,
      displayName: true,
    },
    orderBy: {
      centerNumber: "asc",
    },
  });

  if (!center) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-8 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold">
            Center Not Found
          </h1>

          <p className="mt-3 text-neutral-400">
            The active center could not be resolved.
          </p>
        </div>
      </main>
    );
  }

  const experience = center.experience;

  if (!experience) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-8 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold">
            No Experience Assigned
          </h1>

          <p className="mt-3 text-neutral-400">
            Center {center.centerNumber} does not currently have an
            experience assigned.
          </p>
        </div>
      </main>
    );
  }

  const terminology = Object.fromEntries(
    experience.terminology.map((term) => [
      term.termKey,
      term.displayValue,
    ])
  );

  const primaryColor =
    experience.branding?.primaryColor ?? "#F4B400";

  const secondaryColor =
    experience.branding?.secondaryColor ?? "#1F2937";

  const accentColor =
    experience.branding?.accentColor ?? "#F59E0B";

  return (
    <main
      className="min-h-screen p-8 text-white"
      style={{
        backgroundColor: secondaryColor,
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            ACTIVE CENTER SWITCHER
        ================================================== */}

        <section className="mb-10 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Enterprise Context
              </p>

              <p className="mt-1 text-lg font-semibold">
                Active Center
              </p>
            </div>

            <form
              action={setActiveCenter}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <select
                name="centerNumber"
                defaultValue={center.centerNumber}
                className="rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-white"
              >
                {centers.map((availableCenter) => (
                  <option
                    key={availableCenter.id}
                    value={availableCenter.centerNumber}
                  >
                    {availableCenter.centerNumber} —{" "}
                    {availableCenter.displayName}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-xl bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
              >
                Switch Center
              </button>
            </form>
          </div>
        </section>

        {/* ==================================================
            CENTER / EXPERIENCE HEADER
        ================================================== */}

        <div
          className="inline-flex rounded-full px-4 py-2 text-sm font-semibold text-black"
          style={{
            backgroundColor: primaryColor,
          }}
        >
          Center {center.centerNumber}
        </div>

        <div className="mt-12">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{
              color: accentColor,
            }}
          >
            {center.region?.organization.name ?? "Organization"}
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            {terminology.dashboard ?? experience.name}
          </h1>

          <p className="mt-4 text-xl text-neutral-300">
            {experience.greeting ?? "Welcome"}
          </p>
        </div>

        {/* ==================================================
            RUNTIME RESOLUTION DETAILS
        ================================================== */}

        <section className="mt-12 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Center
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {center.displayName}
            </p>

            <p className="mt-1 text-neutral-400">
              Center {center.centerNumber}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Assigned Experience
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {experience.name}
            </p>

            <p className="mt-1 text-neutral-400">
              Version {experience.version}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Target Terminology
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {terminology.target ?? "Target"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Recognition Terminology
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {terminology.recognition ?? "Recognition"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Team Member Terminology
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {terminology.team_member ?? "Team Member"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-neutral-400">
              Experience Key
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {experience.key}
            </p>
          </div>

        </section>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-neutral-500">
          HIVE Platform — Active Center Runtime Resolution
        </div>

      </div>
    </main>
  );
}