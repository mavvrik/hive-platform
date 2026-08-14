import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import {
  toggleDepartmentStatus,
  updateDepartment,
} from "./actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDepartmentPage({
  params,
}: PageProps) {
  const { id } = await params;

  const [
    department,
    centers,
  ] = await Promise.all([
    prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        center: {
          select: {
            id: true,
            centerNumber: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
    }),

    prisma.center.findMany({
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
    }),
  ]);

  if (!department) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/settings/departments"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              ← Back to Departments
            </Link>

            <p className="mt-8 text-sm uppercase tracking-[0.2em] text-amber-400">
              Workforce Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Edit {department.name}
            </h1>

            <p className="mt-2 text-neutral-400">
              Center {department.center.centerNumber} —{" "}
              {department.center.displayName}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              department.isActive
                ? "bg-green-950 text-green-300"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {department.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <form
          action={updateDepartment}
          className="space-y-8"
        >
          <input
            type="hidden"
            name="id"
            value={department.id}
          />

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Center Assignment
            </h2>

            <div className="mt-6">
              <label
                htmlFor="centerId"
                className="mb-2 block text-sm font-medium"
              >
                Center
              </label>

              <select
                id="centerId"
                name="centerId"
                required
                defaultValue={
                  department.centerId
                }
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
              >
                {centers.map((center) => (
                  <option
                    key={center.id}
                    value={center.id}
                  >
                    {center.centerNumber} —{" "}
                    {center.displayName}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-neutral-500">
                Moving a department changes which center owns it.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">
              Department Identity
            </h2>

            <div className="mt-6 grid gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Department Name
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={
                    department.name
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="key"
                  className="mb-2 block text-sm font-medium"
                >
                  Department Key
                </label>

                <input
                  id="key"
                  name="key"
                  required
                  defaultValue={
                    department.key
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3"
                />

                <p className="mt-2 text-sm text-neutral-500">
                  The key only needs to be unique within the selected center.
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
                  defaultValue={
                    department.description ??
                    ""
                  }
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
                Worker Assignments
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  department._count
                    .activities
                }
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Assignment history linked to this department.
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/settings/departments"
              className="rounded-xl border border-neutral-700 px-6 py-3 text-center font-semibold transition hover:bg-neutral-900"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Save Department
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-semibold">
            Department Status
          </h2>

          <p className="mt-2 max-w-2xl text-neutral-400">
            Inactive departments remain in historical records but should not be
            available for new workforce assignments.
          </p>

          <form
            action={
              toggleDepartmentStatus
            }
            className="mt-6"
          >
            <input
              type="hidden"
              name="id"
              value={department.id}
            />

            <button
              type="submit"
              className={`rounded-xl px-6 py-3 font-semibold transition ${
                department.isActive
                  ? "bg-red-950 text-red-200 hover:bg-red-900"
                  : "bg-green-950 text-green-200 hover:bg-green-900"
              }`}
            >
              {department.isActive
                ? "Deactivate Department"
                : "Activate Department"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}