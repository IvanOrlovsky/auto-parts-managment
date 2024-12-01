"use server";

import prisma from "@/lib/db";

export async function deleteCode(userId: string) {
	try {
		await prisma.verification.delete({
			where: {
				userId,
			},
		});
	} catch (error) {
		console.error(
			`Не удалось удалить код, связанный с пользователем ${userId}`,
			error
		);
	}
	return;
}

export async function deletePartInWarhouse(
	partId: string,
	warehouseId: string
) {
	await prisma.partsOnWarehouse.delete({
		where: {
			partId_warehouseId: {
				partId,
				warehouseId,
			},
		},
	});

	return;
}

export async function deleteOrder(orderId: string) {
	await prisma.order.delete({
		where: {
			id: orderId,
		},
	});

	return;
}
