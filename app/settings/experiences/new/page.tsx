import { createExperience } from "./actions";

export default function NewExperiencePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
          Center Experience
        </p>

        <h1 className="text-4xl font-bold mt-2">
          Create Experience
        </h1>

        <form action={createExperience} className="mt-8 space-y-6">
          <div>
            <label className="block mb-2">
              Experience Name
            </label>

            <input
              name="name"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
              placeholder="The HIVE"
            />
          </div>

          <div>
            <label className="block mb-2">
              Key
            </label>

            <input
              name="key"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
              placeholder="HIVE"
            />
          </div>

          <div>
            <label className="block mb-2">
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
          >
            Create Experience
          </button>
        </form>
      </div>
    </main>
  );
}