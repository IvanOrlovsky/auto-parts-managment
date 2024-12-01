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

export async function addPartToWarehouse(partId: string, warehouseId: string) {
	await prisma.partsOnWarehouse.create({
		data: {
			partId,
			warehouseId,
		},
	});
	return;
}
