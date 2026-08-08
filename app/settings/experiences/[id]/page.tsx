import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { updateExperience } from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExperiencePage({
  params,
}: PageProps) {
  const { id } = await params;

  const experience =
    await prisma.experience.findUnique({
      where: { id },
      include: {
        branding: true,
        terminology: {
          orderBy: {
            termKey: "asc",
          },
        },
      },
    });

  if (!experience) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
          Center Experience
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Edit {experience.name}
        </h1>

        <form
          action={updateExperience}
          className="mt-8 space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={experience.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              General
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block">
                  Experience Name
                </label>

                <input
                  name="name"
                  required
                  defaultValue={experience.name}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Key
                </label>

                <input
                  name="key"
                  required
                  defaultValue={experience.key}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  defaultValue={
                    experience.description ?? ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Greeting
                </label>

                <input
                  name="greeting"
                  defaultValue={
                    experience.greeting ?? ""
                  }
                  placeholder="Welcome to The HIVE"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Branding
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block">
                  Primary Color
                </label>

                <input
                  name="primaryColor"
                  type="color"
                  defaultValue={
                    experience.branding
                      ?.primaryColor ??
                    "#D4A017"
                  }
                  className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-950"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Secondary Color
                </label>

                <input
                  name="secondaryColor"
                  type="color"
                  defaultValue={
                    experience.branding
                      ?.secondaryColor ??
                    "#111111"
                  }
                  className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-950"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Accent Color
                </label>

                <input
                  name="accentColor"
                  type="color"
                  defaultValue={
                    experience.branding
                      ?.accentColor ??
                    "#FFFFFF"
                  }
                  className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-950"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block">
                  Logo URL
                </label>

                <input
                  name="logoUrl"
                  defaultValue={
                    experience.branding?.logoUrl ??
                    ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Mascot URL
                </label>

                <input
                  name="mascotUrl"
                  defaultValue={
                    experience.branding
                      ?.mascotUrl ?? ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Background URL
                </label>

                <input
                  name="backgroundUrl"
                  defaultValue={
                    experience.branding
                      ?.backgroundUrl ?? ""
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Terminology
            </h2>

            <p className="mt-2 text-neutral-400">
              These labels let each Center Experience
              speak in its own language.
            </p>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block">
                  Dashboard Label
                </label>

                <input
                  name="term_dashboard"
                  defaultValue={
                    experience.terminology.find(
                      (term) =>
                        term.termKey ===
                        "dashboard"
                    )?.displayValue ?? ""
                  }
                  placeholder="The HIVE"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Target Label
                </label>

                <input
                  name="term_target"
                  defaultValue={
                    experience.terminology.find(
                      (term) =>
                        term.termKey === "target"
                    )?.displayValue ?? ""
                  }
                  placeholder="Honey Goal"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Recognition Label
                </label>

                <input
                  name="term_recognition"
                  defaultValue={
                    experience.terminology.find(
                      (term) =>
                        term.termKey ===
                        "recognition"
                    )?.displayValue ?? ""
                  }
                  placeholder="Hive Recognition"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  Team Member Label
                </label>

                <input
                  name="term_team_member"
                  defaultValue={
                    experience.terminology.find(
                      (term) =>
                        term.termKey ===
                        "team_member"
                    )?.displayValue ?? ""
                  }
                  placeholder="Hive Member"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
          >
            Save Center Experience
          </button>
        </form>
      </div>
    </main>
  );
}