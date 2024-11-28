"use server";

import prisma from "@/lib/db";

export async function login(state: string | null, formData: FormData) {
	const email = formData.get("email")?.toString();

	const checkEmail = await prisma.user.findUnique({
		where: { email: email },
	});
	if (Object.keys(checkEmail || {}).length === 0) {
		console.error(`Почта ${email} не зарегистрирована в системе`);
		return "Такая почта не зарегистрирована в системе!";
	}

	return null;
}
