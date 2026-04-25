import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage, logApiError } from "@/lib/api-error";
import { attachAuthCookie, signAuthToken } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/store";
import { formatZodError, signupSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    if (!user) {
      throw new Error("Unable to create user record.");
    }

    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email
    });

    const response = NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );

    return attachAuthCookie(response, token);
  } catch (error) {
    logApiError("auth/signup", error);
    return NextResponse.json(
      { error: getApiErrorMessage(error, "Unable to create account right now.") },
      { status: 500 }
    );
  }
}
