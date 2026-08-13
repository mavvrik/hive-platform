import { prisma } from "@/app/lib/prisma";

export async function getCenterExperience(centerNumber: string) {
  const center = await prisma.center.findUnique({
    where: {
      centerNumber,
    },
    include: {
      region: {
        include: {
          organization: true,
        },
      },
      experience: {
        include: {
          branding: true,
          terminology: {
            orderBy: {
              termKey: "asc",
            },
          },
        },
      },
    },
  });

  if (!center) {
    return null;
  }

  return center;
}