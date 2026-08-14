import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  toggleRoleStatus,
  updateRole,
} from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRolePage({
  params,
}: PageProps) {
  const { id } = await params;

  const role = await prisma.role.findUnique({
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

  if (!role) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
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
              Edit {role.name}
            </h1>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              role.isActive
                ? "bg-green-950 text-green-300"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {role.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <form
          action={updateRole}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={role.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Role Identity
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Role Name
                </label>

                <input
                  name="name"
                  required
                  defaultValue={role.name}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Role Key
                </label>

                <input
                  name="key"
                  required
                  defaultValue={role.key}
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
                  defaultValue={role.description ?? ""}
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
                {role._count.workers}
              </p>
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
              Save Role
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Role Status
          </h2>

          <p className="mt-2 text-neutral-400">
            Inactive roles remain attached to historical workforce records but
            should not be available for new assignments.
          </p>

          <form
            action={toggleRoleStatus}
            className="mt-6"
          >
            <input
              type="hidden"
              name="id"
              value={role.id}
            />

            <button
              type="submit"
              className={`rounded-xl px-6 py-3 font-semibold ${
                role.isActive
                  ? "bg-red-950 text-red-200"
                  : "bg-green-950 text-green-200"
              }`}
            >
              {role.isActive
                ? "Deactivate Role"
                : "Activate Role"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}