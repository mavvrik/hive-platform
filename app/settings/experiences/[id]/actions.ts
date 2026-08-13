"use server";

import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

function cleanValue(
  value: FormDataEntryValue | null
): string | null {
  const cleaned = String(value ?? "").trim();
  return cleaned || null;
}

export async function updateExperience(
  formData: FormData
) {
  const id = String(
    formData.get("id") || ""
  ).trim();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const key = String(
  formData.get("key") || ""
)
  .trim()
  .toLowerCase();

  if (!id || !name || !key) {
    throw new Error(
      "ID, experience name, and key are required."
    );
  }

  const description = cleanValue(
    formData.get("description")
  );

  const greeting = cleanValue(
    formData.get("greeting")
  );

  const primaryColor = cleanValue(
    formData.get("primaryColor")
  );

  const secondaryColor = cleanValue(
    formData.get("secondaryColor")
  );

  const accentColor = cleanValue(
    formData.get("accentColor")
  );

  const logoUrl = cleanValue(
    formData.get("logoUrl")
  );

  const mascotUrl = cleanValue(
    formData.get("mascotUrl")
  );

  const backgroundUrl = cleanValue(
    formData.get("backgroundUrl")
  );

  const terminology = [
    {
      termKey: "dashboard",
      displayValue: cleanValue(
        formData.get("term_dashboard")
      ),
    },
    {
      termKey: "target",
      displayValue: cleanValue(
        formData.get("term_target")
      ),
    },
    {
      termKey: "recognition",
      displayValue: cleanValue(
        formData.get("term_recognition")
      ),
    },
    {
      termKey: "team_member",
      displayValue: cleanValue(
        formData.get("term_team_member")
      ),
    },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.experience.update({
      where: { id },
      data: {
        name,
        key,
        description,
        greeting,
        version: {
          increment: 1,
        },
      },
    });

    await tx.experienceBranding.upsert({
      where: {
        experienceId: id,
      },
      update: {
        primaryColor,
        secondaryColor,
        accentColor,
        logoUrl,
        mascotUrl,
        backgroundUrl,
      },
      create: {
        experienceId: id,
        primaryColor,
        secondaryColor,
        accentColor,
        logoUrl,
        mascotUrl,
        backgroundUrl,
      },
    });

    for (const term of terminology) {
      if (term.displayValue) {
        await tx.experienceTerminology.upsert({
          where: {
            experienceId_termKey: {
              experienceId: id,
              termKey: term.termKey,
            },
          },
          update: {
            displayValue: term.displayValue,
          },
          create: {
            experienceId: id,
            termKey: term.termKey,
            displayValue: term.displayValue,
          },
        });
      } else {
        await tx.experienceTerminology.deleteMany({
          where: {
            experienceId: id,
            termKey: term.termKey,
          },
        });
      }
    }
  });

  redirect("/settings/experiences");
}