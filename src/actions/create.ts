"use server";

import prisma from "@/lib/db";
export async function addVerificationCode(userId: string, code: string) {
	await prisma.verification.upsert({
		where: {
			userId,
		},
		create: {
			userId,
			code,
		},
		update: {
			code,
		},
	});
	return;
}
