"use server";

import prisma from "@/lib/db";
export async function addVerificationCode(userId: string, code: string) {
	await prisma.verification.create({
		data: {
			userId,
			code,
		},
	});
	return;
}
