"use server";

import prisma from "@/lib/db";

export async function checkCode(userId: string, code: string) {
	const user = await prisma.verification.findFirst({
		where: {
			userId,
			code,
		},
	});

	const isCorrect =
		JSON.stringify(user) !== "{}" && JSON.stringify(user) !== "null";

	return isCorrect;
}

export async function getUserData(id: string) {
	const user = await prisma.user.findFirst({
		where: {
			id,
		},
	});

	return user;
}

export async function getAcceptanceParts() {
	const parts = await prisma.part.findMany({
		where: {
			priceForSale: null,
		},
		include: {
			supplier: true,
		},
	});

	return parts || [];
}
