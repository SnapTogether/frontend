import { readFile } from "node:fs/promises";
import { join } from "node:path";

const agendaPdfPath = join(
  process.cwd(),
  "public",
  "agenda-pdf",
  "Agenda-MBT_2026 (1).pdf",
);

export async function GET() {
  const file = await readFile(agendaPdfPath);

  return new Response(file, {
    headers: {
      "Content-Disposition": 'inline; filename="Agenda-MBT_2026.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}

export async function HEAD() {
  return new Response(null, {
    headers: {
      "Content-Disposition": 'inline; filename="Agenda-MBT_2026.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
