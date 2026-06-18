import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export function ok<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function id() {
  return uuid().slice(0, 8);
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
