import Link from "next/link";

import { createCapability } from "./actions";

export default function NewCapabilityPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/settings/capabilities"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Capabilities
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
            Workforce Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Capability
          </h1>

          <p className="mt-2 text-neutral-400">
            Define a skill or qualification that can be assigned to workers
            independently from their role.
          </p>
        </div>

        <form
          action={createCapability}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Capability Identity
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Capability Name
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
                  Capability Key
                </label>

                <input
                  id="key"
                  name="key"
                  required
                  placeholder="phlebotomy"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  Capability keys are enterprise-wide and must be globally
                  unique.
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
                  placeholder="Optional description of the skill or qualification."
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-6">
            <h2 className="text-lg font-semibold text-amber-300">
              Capability Model
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              A capability describes what a worker is trained or qualified to
              perform. It does not automatically define their job title,
              department, or current assignment.
            </p>
          </section>

          <div className="flex justify-between gap-3">
            <Link
              href="/settings/capabilities"
              className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
            >
              Create Capability
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}