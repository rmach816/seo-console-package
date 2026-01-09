import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/example - List all items
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Replace 'items' with your actual table name
  // const { data, error } = await supabase
  //   .from("items")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .order("created_at", { ascending: false });

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }

  return NextResponse.json({ 
    data: [],
    message: "Replace this with your actual implementation" 
  });
}

// POST /api/example - Create new item
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate input
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Replace with your actual implementation
  // const { data, error } = await supabase
  //   .from("items")
  //   .insert({ ...body, user_id: user.id })
  //   .select()
  //   .single();

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }

  return NextResponse.json({ 
    data: body,
    message: "Replace this with your actual implementation" 
  });
}
