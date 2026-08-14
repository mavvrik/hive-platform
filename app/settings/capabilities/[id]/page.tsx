import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  toggleCapabilityStatus,
  updateCapability,
} from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCapabilityPage({
  params,
}: PageProps) {
  const { id } = await params;

  const capability =
    await prisma.capability.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            workers: true,
          },
        },
      },
    });

  if (!capability) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
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
              Edit {capability.name}
            </h1>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              capability.isActive
                ? "bg-green-950 text-green-300"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {capability.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <form
          action={updateCapability}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={capability.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Capability Identity
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Capability Name
                </label>

                <input
                  name="name"
                  required
                  defaultValue={capability.name}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Capability Key
                </label>

                <input
                  name="key"
                  required
                  defaultValue={capability.key}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  defaultValue={capability.description ?? ""}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Workforce Usage
            </h2>

            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
              <p className="text-sm text-neutral-500">
                Workers Assigned
              </p>

              <p className="mt-2 text-3xl font-bold">
                {capability._count.workers}
              </p>
            </div>
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
              Save Capability
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Capability Status
          </h2>

          <p className="mt-2 text-neutral-400">
            Inactive capabilities remain attached to existing workforce
            records but should not be available for new assignments.
          </p>

          <form
            action={toggleCapabilityStatus}
            className="mt-6"
          >
            <input
              type="hidden"
              name="id"
              value={capability.id}
            />

            <button
              type="submit"
              className={`rounded-xl px-6 py-3 font-semibold ${
                capability.isActive
                  ? "bg-red-950 text-red-200"
                  : "bg-green-950 text-green-200"
              }`}
            >
              {capability.isActive
                ? "Deactivate Capability"
                : "Activate Capability"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}