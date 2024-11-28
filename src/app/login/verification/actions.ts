"use server";

import { deleteCode } from "@/actions/delete";
import { checkCode } from "@/actions/read";
import { redirect } from "next/navigation";

export async function verify(
	state: string | null | undefined,
	formData: FormData
) {
	const code = formData.get("code")?.toString();
	const userId = formData.get("userId")?.toString();

	const isCorrect = await checkCode(userId as string, code as string);

	if (!isCorrect) {
		console.error(`Код не подтвержден`);
		return "Неправильно введен код!";
	}

	await deleteCode(userId as string);

	redirect("/");
}
