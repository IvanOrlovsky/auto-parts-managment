"use server";

import prisma from "@/lib/db";
import { deletePartInWarhouse } from "./delete";

export async function updatePriceForSale(id: string, priceForSale: number) {
	await prisma.part.update({
		where: { id },
		data: { priceForSale, dateOfPurchase: new Date() },
	});
	return;
}

export async function updatePlaceDate(partId: string) {
	await prisma.part.update({
		where: {
			id: partId,
		},
		data: {
			dateOfPlace: new Date(),
		},
	});
	return;
}

export async function giveOrder(orderId: string) {
	const givenOrder = await prisma.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: "done",
		},
		include: {
			parts: true,
		},
	});

	for (const part of givenOrder.parts) {
		await givePart(part.id);
	}

	return;
}

async function givePart(partId: string) {
	const givenPart = await prisma.part.update({
		where: {
			id: partId,
		},
		data: {
			dateOfSelling: new Date(),
		},
	});

	const givenPartWarehouseId = await prisma.partsOnWarehouse.findFirst({
		where: {
			partId: givenPart.id,
		},
	});

	await deletePartInWarhouse(
		givenPart.id,
		givenPartWarehouseId?.warehouseId as string
	);

	return;
}
