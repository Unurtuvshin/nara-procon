import fs from "fs";
import path from "path";
import db from "@/db/database";

export async function POST(req) {
  try {
    const { posterId } = await req.json();

    // Get poster data from DB
    const poster = db
      .prepare("SELECT image_url FROM posters WHERE id = ?")
      .get(posterId);
    if (!poster) {
      return new Response(JSON.stringify({ error: "Poster not found" }), {
        status: 404,
      });
    }

    const posterPath = path.join(process.cwd(), "public", poster.image_url);
    const outputPath = path.join(
      process.cwd(),
      "public/data/poster-image/output.png"
    );

    // Copy (overwrite) the image file
    fs.copyFileSync(posterPath, outputPath);

    return Response.json({
      success: true,
      output: "/data/poster-image/output.png",
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to overwrite poster" }),
      { status: 500 }
    );
  }
}
