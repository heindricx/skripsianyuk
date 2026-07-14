const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching theses with "=" in title...');
  const theses = await prisma.thesis.findMany({
    where: {
      title: {
        contains: '='
      }
    }
  });

  console.log(`Found ${theses.length} theses to clean.`);

  let count = 0;
  for (const thesis of theses) {
    const cleanTitle = thesis.title.split('=')[0].trim();
    await prisma.thesis.update({
      where: { id: thesis.id },
      data: { title: cleanTitle }
    });
    count++;
  }

  console.log(`Successfully cleaned ${count} titles.`);
}

main()
  .catch(e => {
    console.error('Error during data cleaning:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
