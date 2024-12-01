"use server";

import prisma from "@/lib/db";

export async function updatePriceForSale(id: string, priceForSale: number) {
	await prisma.part.update({
		where: { id },
		data: { priceForSale, dateOfPurchase: new Date() },
	});
	return;
}
