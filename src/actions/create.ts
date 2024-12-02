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

export async function createUser(
	name: string,
	surname: string,
	email: string,
	phone: string,
	address: string,
	isCustomer: boolean
) {
	const user = await prisma.user.create({
		data: {
			name,
			surname,
			email,
			phone,
			address,
			isCustomer,
		},
	});
	return user;
}

export async function createOrder(customerId: string, parts: string[]) {
	const order = await prisma.order.create({
		data: {
			customerId,
			date: new Date(),
			status: "ready",
			parts: { connect: parts.map((partId) => ({ id: partId })) },
		},
	});

	return order;
}
