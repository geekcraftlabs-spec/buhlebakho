import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLOR_NAMES: Record<string, string> = {
  "1B": "Natural Off-Black",
  "4": "Chocolate Brown",
  "27": "Honey Blonde",
  "30": "Auburn",
  "99J": "Burgundy",
  "350": "Copper",
  "613": "Platinum Blonde",
  "4/27": "Highlight",
  "1B/27": "Honey Ombré",
  "pink": "Pastel Pink",
  "Pink": "Pink",
  "PastelPink": "Pastel Pink",
  "ashyblonde": "Ash Blonde",
  "red": "Statement Red",
};

// [hairType, texture, laceType, colorCode, sizeLabel, imageBaseName]
const VARIANTS: [string, string, string, string, string, string][] = [
  // ==== HUMAN BLEND — BONE STRAIGHT (24 files) ====
  ["human-blend", "bone-straight", "13x4", "1B", "10", "bonestraight-10-1B"],
  ["human-blend", "bone-straight", "13x4", "27", "10", "bonestraight-10-27"],
  ["human-blend", "bone-straight", "13x4", "30", "10", "bonestraight-10-30"],
  ["human-blend", "bone-straight", "13x4", "350", "10", "bonestraight-10-350"],
  ["human-blend", "bone-straight", "13x4", "4", "10", "bonestraight-10-4"],
  ["human-blend", "bone-straight", "13x4", "4/27", "10", "bonestraight-10-4-27"],
  ["human-blend", "bone-straight", "13x4", "613", "10", "bonestraight-10-613"],
  ["human-blend", "bone-straight", "13x4", "99J", "10", "bonestraight-10-99J"],
  ["human-blend", "bone-straight", "13x4", "1B", "16", "bonestraight-16-1B"],
  ["human-blend", "bone-straight", "13x4", "27", "16", "bonestraight-16-27"],
  ["human-blend", "bone-straight", "13x4", "30", "16", "bonestraight-16-30"],
  ["human-blend", "bone-straight", "13x4", "350", "16", "bonestraight-16-350"],
  ["human-blend", "bone-straight", "13x4", "4", "16", "bonestraight-16-4"],
  ["human-blend", "bone-straight", "13x4", "4/27", "16", "bonestraight-16-4-27"],
  ["human-blend", "bone-straight", "13x4", "613", "16", "bonestraight-16-613"],
  ["human-blend", "bone-straight", "13x4", "99J", "16", "bonestraight-16-99J"],
  ["human-blend", "bone-straight", "13x4", "1B", "24", "bonestraight-24-1B"],
  ["human-blend", "bone-straight", "13x4", "27", "24", "bonestraight-24-27"],
  ["human-blend", "bone-straight", "13x4", "30", "24", "bonestraight-24-30"],
  ["human-blend", "bone-straight", "13x4", "350", "24", "bonestraight-24-350"],
  ["human-blend", "bone-straight", "13x4", "4", "24", "bonestraight-24-4"],
  ["human-blend", "bone-straight", "13x4", "4/27", "24", "bonestraight-24-4-27"],
  ["human-blend", "bone-straight", "13x4", "613", "24", "bonestraight-24-613"],
  ["human-blend", "bone-straight", "13x4", "99J", "24", "bonestraight-24-99J"],

  // ==== HUMAN BLEND — BODY WAVE (12 files) ====
  ["human-blend", "body-wave", "13x4", "1B", "10", "bodywave-10-1B"],
  ["human-blend", "body-wave", "13x4", "27", "10", "bodywave-10-27"],
  ["human-blend", "body-wave", "13x4", "4", "10", "bodywave-10-4"],
  ["human-blend", "body-wave", "13x4", "613", "10", "bodywave-10-613"],
  ["human-blend", "body-wave", "13x4", "1B", "16", "bodywave-16-1B"],
  ["human-blend", "body-wave", "13x4", "27", "16", "bodywave-16-27"],
  ["human-blend", "body-wave", "13x4", "4", "16", "bodywave-16-4"],
  ["human-blend", "body-wave", "13x4", "613", "16", "bodywave-16-613"],
  ["human-blend", "body-wave", "13x4", "1B", "24", "bodywave-24-1B"],
  ["human-blend", "body-wave", "13x4", "27", "24", "bodywave-24-27"],
  ["human-blend", "body-wave", "13x4", "4", "24", "bodywave-24-4"],
  ["human-blend", "body-wave", "13x4", "613", "24", "bodywave-24-613"],

  // ==== HUMAN BLEND — DEEP WAVE (12 files) ====
  ["human-blend", "deep-wave", "13x4", "1B", "10", "deepwave-10-1B"],
  ["human-blend", "deep-wave", "13x4", "27", "10", "deepwave-10-27"],
  ["human-blend", "deep-wave", "13x4", "4", "10", "deepwave-10-4"],
  ["human-blend", "deep-wave", "13x4", "99J", "10", "deepwave-10-99J"],
  ["human-blend", "deep-wave", "13x4", "1B", "16", "deepwave-16-1B"],
  ["human-blend", "deep-wave", "13x4", "27", "16", "deepwave-16-27"],
  ["human-blend", "deep-wave", "13x4", "4", "16", "deepwave-16-4"],
  ["human-blend", "deep-wave", "13x4", "99J", "16", "deepwave-16-99J"],
  ["human-blend", "deep-wave", "13x4", "1B", "24", "deepwave-24-1B"],
  ["human-blend", "deep-wave", "13x4", "27", "24", "deepwave-24-27"],
  ["human-blend", "deep-wave", "13x4", "4", "24", "deepwave-24-4"],
  ["human-blend", "deep-wave", "13x4", "99J", "24", "deepwave-24-99J"],

  // ==== FUTURA FIBRE — STRAIGHT (20 files) ====
  ["futura-fibre", "bone-straight", "13x4", "1B", "short", "futura-short-1B-straight"],
  ["futura-fibre", "bone-straight", "13x4", "1B", "long",  "futura-long-1B-straight"],
  ["futura-fibre", "bone-straight", "13x4", "4",  "short", "futura-short-4-straight"],
  ["futura-fibre", "bone-straight", "13x4", "4",  "long",  "futura-long-4-straight"],
  ["futura-fibre", "bone-straight", "13x4", "27", "short", "futura-short-27-straight"],
  ["futura-fibre", "bone-straight", "13x4", "27", "long",  "futura-long-27-straight"],
  ["futura-fibre", "bone-straight", "13x4", "30", "short", "futura-short-30-straight"],
  ["futura-fibre", "bone-straight", "13x4", "30", "long",  "futura-long-30-straight"],
  ["futura-fibre", "bone-straight", "13x4", "99J","short", "futura-short-99J-straight"],
  ["futura-fibre", "bone-straight", "13x4", "99J","long",  "futura-long-99J-straight"],
  ["futura-fibre", "bone-straight", "13x4", "613","short", "futura-short-613-straight"],
  ["futura-fibre", "bone-straight", "13x4", "613","long",  "futura-long-613-straight"],
  ["futura-fibre", "bone-straight", "13x4", "1B/27","short","futura-short-1B-27-straight"],
  ["futura-fibre", "bone-straight", "13x4", "1B/27","long","futura-long-1B-27-straight"],
  ["futura-fibre", "bone-straight", "13x4", "ashyblonde","short","futura-short-ashyblonde-straight"],
  ["futura-fibre", "bone-straight", "13x4", "ashyblonde","long","futura-long-ashyblonde-straight"],
  ["futura-fibre", "bone-straight", "13x4", "red","short", "futura-short-red-straight"],
  ["futura-fibre", "bone-straight", "13x4", "red","long",  "futura-long-red-straight"],
  ["futura-fibre", "bone-straight", "13x4", "pink","short","futura-short-pink-straight"],
  ["futura-fibre", "bone-straight", "13x4", "pink","long", "futura-long-pink-straight"],
  ["futura-fibre", "bone-straight", "13x4", "PastelPink","short","futura-short-PastelPink-straight"],
  ["futura-fibre", "bone-straight", "13x4", "PastelPink","long","futura-long-PastelPink-straight"],

  // ==== FUTURA FIBRE — BODY WAVE (19 files) ====
  ["futura-fibre", "body-wave", "13x4", "1B", "short", "futura-short-1B-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "1B", "long",  "futura-long-1B-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "4",  "short", "futura-short-4-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "4",  "long",  "futura-long-4-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "27", "short", "futura-short-27-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "27", "long",  "futura-long-27-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "30", "short", "futura-short-30-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "30", "long",  "futura-long-30-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "99J","short", "futura-short-99J-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "99J","long",  "futura-long-99J-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "613","short", "futura-short-613-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "613","long",  "futura-long-613-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "1B/27","short","futura-short-1B-27-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "1B/27","long","futura-long-1B-27-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "Pink","short", "futura-short-Pink-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "Pink","long",  "futura-long-Pink-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "PastelPink","short","futura-short-PastelPink-bodywave"],
  ["futura-fibre", "body-wave", "13x4", "PastelPink","long","futura-long-PastelPink-bodywave"],

  // ==== CUSTOM RAW HUMAN HAIR ====
  ["custom-human-hair", "bone-straight", "13x4", "1B", "12", "custom-raw-12-1B"],
];

function priceFor(hairType: string, sizeLabel: string): number {
  if (hairType === "custom-human-hair") return 3500;
  if (hairType === "human-blend") {
    if (sizeLabel === "10") return 750;
    if (sizeLabel === "16") return 900;
    if (sizeLabel === "24") return 1050;
  }
  if (hairType === "futura-fibre") {
    if (sizeLabel === "short") return 550;
    return 900;
  }
  return 900;
}

async function main() {
  // Wipe everything first — guarantees no strays
  console.log("Wiping all variants...");
  const before = await prisma.productVariant.count();
  const deleted = await prisma.productVariant.deleteMany({});
  console.log(`  Deleted: ${deleted.count} (was ${before})`);

  console.log("Seeding fresh...");
  let created = 0;

  for (const [hairType, texture, laceType, colorCode, sizeLabel, image] of VARIANTS) {
    const price = priceFor(hairType, sizeLabel);
    const colorName = COLOR_NAMES[colorCode] ?? colorCode;

    try {
      await prisma.productVariant.create({
        data: {
          hairType,
          laceType,
          texture,
          colorCode,
          colorName,
          sizeLabel,
          price,
          stockCount: 25,
          image: `/images/wigs/${image}.png`,
          isFeatured: false,
        },
      });
      created++;
    } catch (err) {
      console.error(`Failed to seed ${image}:`, err);
    }
  }

  console.log(`✓ Created ${created} variants`);

  const total = await prisma.productVariant.count();
  console.log(`✓ Total in DB: ${total}`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());