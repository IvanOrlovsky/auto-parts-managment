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

export async function getAllWareHouses() {
	const warehouses = await prisma.warehouse.findMany({
		include: {
			parts: {
				include: {
					part: true,
				},
			},
		},
	});

	return warehouses;
}

export async function getAllPartsInWareHouse() {
	const parts = await prisma.part.findMany({
		where: {
			warehouse: {
				some: {},
			},
		},
		include: {
			warehouse: {
				include: {
					warehouse: true,
				},
			},
		},
	});

	return parts;
}

export async function getAllPartsOutOfWarehouse() {
	const parts = await prisma.part.findMany({
		where: {
			warehouse: {
				none: {},
			},
			NOT: {
				priceForSale: null,
			},
		},
	});

	return parts.filter((part) => !part.dateOfSelling);
}

export async function getAllOrders() {
	const orders = await prisma.order.findMany({
		include: {
			customer: true,
			parts: true,
		},
		where: {
			status: "ready",
		},
	});

	return orders;
}

export async function getAllGivenOrders() {
	const orders = await prisma.order.findMany({
		include: {
			customer: true,
			parts: true,
		},
		where: {
			status: "done",
		},
	});

	return orders;
}
