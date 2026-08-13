import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg(
  {
    connectionString,
  },
  {
    schema: "hive_platform_v2",
  }
);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting HIVE Platform enterprise seed...");

  // =====================================================
  // ORGANIZATION
  // =====================================================

  const organization = await prisma.organization.upsert({
    where: {
      key: "csl-plasma",
    },
    update: {
      name: "CSL Plasma",
      description: "CSL Plasma enterprise organization",
      isActive: true,
    },
    create: {
      name: "CSL Plasma",
      key: "csl-plasma",
      description: "CSL Plasma enterprise organization",
      isActive: true,
    },
  });

  console.log("✓ Organization:", organization.name);

  // =====================================================
  // REGION
  // =====================================================

  const region = await prisma.region.upsert({
    where: {
      organizationId_key: {
        organizationId: organization.id,
        key: "southeast",
      },
    },
    update: {
      name: "Southeast",
      description: "CSL Plasma Southeast Region",
      isActive: true,
    },
    create: {
      organizationId: organization.id,
      name: "Southeast",
      key: "southeast",
      description: "CSL Plasma Southeast Region",
      isActive: true,
    },
  });

  console.log("✓ Region:", region.name);

  // =====================================================
  // STANDARD EXPERIENCE
  // =====================================================

  const standardExperience = await prisma.experience.upsert({
    where: {
      key: "standard",
    },
    update: {
      name: "Standard",
      description: "Default HIVE Platform center experience",
      isActive: true,
      isDefault: true,
      greeting: "Welcome",
    },
    create: {
      name: "Standard",
      key: "standard",
      description: "Default HIVE Platform center experience",
      isActive: true,
      isDefault: true,
      greeting: "Welcome",
    },
  });

  console.log("✓ Experience:", standardExperience.name);

  // =====================================================
  // EXECUTIVE HIVE EXPERIENCE
  // =====================================================

  const hiveExperience = await prisma.experience.upsert({
    where: {
      key: "executive-hive",
    },
    update: {
      name: "The Executive HIVE",
      description:
        "Executive HIVE operating experience for participating CSL Plasma centers",
      isActive: true,
      isDefault: false,
      greeting: "Welcome to The HIVE",
    },
    create: {
      name: "The Executive HIVE",
      key: "executive-hive",
      description:
        "Executive HIVE operating experience for participating CSL Plasma centers",
      isActive: true,
      isDefault: false,
      greeting: "Welcome to The HIVE",
    },
  });

  console.log("✓ Experience:", hiveExperience.name);

  // =====================================================
  // HIVE BRANDING
  // =====================================================

  await prisma.experienceBranding.upsert({
    where: {
      experienceId: hiveExperience.id,
    },
    update: {
      primaryColor: "#F4B400",
      secondaryColor: "#1F2937",
      accentColor: "#F59E0B",
    },
    create: {
      experienceId: hiveExperience.id,
      primaryColor: "#F4B400",
      secondaryColor: "#1F2937",
      accentColor: "#F59E0B",
    },
  });

  console.log("✓ Executive HIVE branding");

  // =====================================================
  // HIVE TERMINOLOGY
  // =====================================================

  const terminology = [
  {
    termKey: "dashboard",
    displayValue: "The Executive HIVE",
    description: "Primary dashboard title",
  },
  {
    termKey: "target",
    displayValue: "Honey Goal",
    description: "Experience terminology for performance targets",
  },
  {
    termKey: "recognition",
    displayValue: "HIVE Recognition",
    description: "Experience terminology for employee recognition",
  },
  {
    termKey: "team_member",
    displayValue: "HIVE Member",
    description: "Experience terminology for center team members",
  },
];

await prisma.experienceTerminology.deleteMany({
  where: {
    experienceId: hiveExperience.id,
    termKey: {
      in: ["platformName", "center", "team"],
    },
  },
});

  for (const term of terminology) {
    await prisma.experienceTerminology.upsert({
      where: {
        experienceId_termKey: {
          experienceId: hiveExperience.id,
          termKey: term.termKey,
        },
      },
      update: {
        displayValue: term.displayValue,
        description: term.description,
      },
      create: {
        experienceId: hiveExperience.id,
        termKey: term.termKey,
        displayValue: term.displayValue,
        description: term.description,
      },
    });
  }

  console.log("✓ Executive HIVE terminology");

  // =====================================================
  // RIVIERA BEACH 115
  // =====================================================

  const rivieraBeach = await prisma.center.upsert({
    where: {
      centerNumber: "115",
    },
    update: {
      name: "Riviera Beach",
      displayName: "Riviera Beach",
      slug: "riviera-beach-115",
      state: "FL",
      country: "US",
      timezone: "America/New_York",
      isActive: true,
      regionId: region.id,
      experienceId: hiveExperience.id,
    },
    create: {
      centerNumber: "115",
      name: "Riviera Beach",
      displayName: "Riviera Beach",
      slug: "riviera-beach-115",
      state: "FL",
      country: "US",
      timezone: "America/New_York",
      isActive: true,
      regionId: region.id,
      experienceId: hiveExperience.id,
    },
  });

  console.log(
    `✓ Center ${rivieraBeach.centerNumber}: ${rivieraBeach.displayName}`
  );

  console.log("");
  console.log("🐝 HIVE Platform enterprise seed complete.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });