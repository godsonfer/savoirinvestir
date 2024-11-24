import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
const muxtClient = new Mux({
  tokenId: process.env["MUX_TOKEN_ID"], // This is the default and can be omitted
  tokenSecret: process.env["MUX_TOKEN_SECRET"], // This is the default and can be omitted
});
export async function POST(req: Request) {
  const body = await req.json();
  const videoUrl = body.videoUrl;

  const asset = await muxtClient.video.assets.create({
    input: videoUrl,
    playback_policy: ["public"],
    test: false,
  });
  return NextResponse.json({ asset });
}
