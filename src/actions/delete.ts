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
