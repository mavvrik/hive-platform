import Link from "next/link";

import { createRole } from "./actions";

export default function NewRolePage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/settings/roles"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            ← Back to Roles
          </Link>

          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
            Workforce Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Role
          </h1>

          <p className="mt-2 text-neutral-400">
            Define an enterprise workforce responsibility that can be assigned
            independently of department placement.
          </p>
        </div>

        <form
          action={createRole}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Role Identity
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Role Name
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Center Manager"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="key"
                  className="mb-2 block text-sm font-medium"
                >
                  Role Key
                </label>

                <input
                  id="key"
                  name="key"
                  required
                  placeholder="center-manager"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  Role keys are enterprise-wide and must be globally unique.
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
                  placeholder="Optional description of the role."
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-between gap-3">
            <Link
              href="/settings/roles"
              className="rounded-xl border border-neutral-700 px-6 py-3 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}