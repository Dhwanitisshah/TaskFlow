import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage, logApiError } from "@/lib/api-error";
import { attachAuthCookie, signAuthToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";
import { formatZodError, loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await findUserByEmail(email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email
    });

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

    return attachAuthCookie(response, token);
  } catch (error) {
    logApiError("auth/login", error);
    return NextResponse.json({ error: getApiErrorMessage(error, "Unable to log in right now.") }, { status: 500 });
  }
}
