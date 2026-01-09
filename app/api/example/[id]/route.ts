import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/example/[id] - Get single item
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Replace with your actual implementation
  // const { data, error } = await supabase
  //   .from("items")
  //   .select("*")
  //   .eq("id", id)
  //   .eq("user_id", user.id)
  //   .single();

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 404 });
  // }

  return NextResponse.json({ 
    data: { id },
    message: "Replace this with your actual implementation" 
  });
}

// PATCH /api/example/[id] - Update item
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Replace with your actual implementation
  // const { data, error } = await supabase
  //   .from("items")
  //   .update(body)
  //   .eq("id", id)
  //   .eq("user_id", user.id)
  //   .select()
  //   .single();

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }

  return NextResponse.json({ 
    data: { id, ...body },
    message: "Replace this with your actual implementation" 
  });
}

// DELETE /api/example/[id] - Delete item
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id: _id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Replace with your actual implementation
  // const { error } = await supabase
  //   .from("items")
  //   .delete()
  //   .eq("id", id)
  //   .eq("user_id", user.id);

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }

  return NextResponse.json({ 
    success: true,
    message: "Replace this with your actual implementation" 
  });
}
