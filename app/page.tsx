import { getCenterExperience } from "@/app/lib/center-experience";

export default async function Home() {
  const center = await getCenterExperience("115");

  if (!center) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Center Not Found</h1>
          <p className="mt-3 text-neutral-400">
            The requested center could not be resolved.
          </p>
        </div>
      </main>
    );
  }

  const experience = center.experience;

  if (!experience) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
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
        </section>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-neutral-500">
          Runtime Experience Resolution Test
        </div>
      </div>
    </main>
  );
}