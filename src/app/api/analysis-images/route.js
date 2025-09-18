import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "public/analysis"); // folder containing images
    const files = fs.readdirSync(dirPath);

    // Filter only image files
    const images = files.filter((f) =>
      [".png", ".jpg", ".jpeg", ".gif"].includes(path.extname(f).toLowerCase())
    );

    return Response.json({ images });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ images: [] }), { status: 500 });
  }
}
