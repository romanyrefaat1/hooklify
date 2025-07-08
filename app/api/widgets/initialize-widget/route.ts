import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const siteId = searchParams.get("siteId");
  const widgetId = searchParams.get("widgetId");
  const siteApiKey = searchParams.get("siteApiKey");
  const widgetApiKey = searchParams.get("widgetApiKey");
  const currentLocation = searchParams.get("currentLocation");

  if (!widgetId) {
    return NextResponse.json({ error: "Missing widgetId" }, { status: 400 });
  }

  const supabase = await createClient();
  
  // Check if supabase is a Supabase client instance
  if (!supabase || typeof supabase.from !== 'function') {
    console.error("Supabase client not created correctly");
    return NextResponse.json({ error: "Server error: Supabase client not created" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("widgets")
    .select("*")
    .eq("id", widgetId)
    .single();

  if (error) {
    console.error("Error fetching widget:", error);
    return NextResponse.json({ error: "Failed to fetch widget" }, { status: 500 });
  }

  // Optional URL match check
  // if (data.site_url !== currentLocation) {
  //   return NextResponse.json({ error: "URL mismatch" }, { status: 400 });
  // }

  console.log("XLM: Widget data", data);

  return NextResponse.json(data);
}