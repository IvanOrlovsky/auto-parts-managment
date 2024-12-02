"use server";

import prisma from "@/lib/db";
import {
	Order,
	Part,
	PartsOnWarehouse,
	Supplier,
	User,
	Warehouse,
} from "@prisma/client";

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

export async function getUserData(id: string): Promise<User | null> {
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

export async function getSellingReport(): Promise<
	(Part & {
		order: (Order & { customer: User }) | null;
		supplier: Supplier;
	})[]
> {
	const parts = await prisma.part.findMany({
		where: {
			dateOfSelling: {
				not: null,
			},
		},
		include: {
			order: {
				include: {
					customer: true,
				},
			},
			supplier: true,
		},
	});

	return parts;
}

export async function getPurchaseReport(): Promise<
	(Part & {
		order: (Order & { customer: User }) | null;
		supplier: Supplier;
	})[]
> {
	const parts = await prisma.part.findMany({
		where: {
			priceForSale: {
				not: null,
			},
		},
		include: {
			order: {
				include: {
					customer: true,
				},
			},
			supplier: true,
		},
	});

	return parts;
}

export async function getWarehouseReport(): Promise<
	({
		warehouse: Warehouse;
		part: { supplier: Supplier } & Part;
	} & PartsOnWarehouse)[]
> {
	const report = await prisma.partsOnWarehouse.findMany({
		include: {
			part: {
				include: {
					supplier: true,
				},
			},
			warehouse: true,
		},
	});

	return report;
}

export async function getAvailableToOrderParts() {
	const parts = await prisma.part.findMany({
		where: {
			priceForSale: {
				not: null,
			},
			dateOfSelling: null,
			warehouse: {
				some: {},
			},
		},
	});

	return parts;
}

export async function areAllPartsAvailableForSale(
	partIds: string[]
): Promise<boolean> {
	// Получаем все части, которые находятся на складе и не проданы
	const parts = await prisma.part.findMany({
		where: {
			id: { in: partIds }, // Только те части, которые указаны в partIds
			warehouse: {
				some: {}, // Части должны быть размещены на складе
			},
			dateOfSelling: null, // Части не должны быть проданы
			priceForSale: {
				not: null, // Части должны иметь цену продажи
			},
		},
	});

	return parts.length === partIds.length;
}

export async function getAllCustomers() {
	const customers = await prisma.user.findMany({
		where: {
			isCustomer: true,
		},
	});

	return customers;
}
