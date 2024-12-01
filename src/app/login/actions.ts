"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { addVerificationCode } from "@/actions/create";

export async function login(
	state: string | null | undefined,
	formData: FormData
) {
	const email = formData.get("email")?.toString();

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (
		Object.keys(user || {}).length === 0 ||
		user === null ||
		email === undefined
	) {
		console.error(`Почта ${email} не зарегистрирована в системе`);
		return "Такая почта не зарегистрирована в системе!";
	}

	if (user.isCustomer) {
		return "Вы клиент, таким нельзя в нашу систему!";
	}

	const cookieStore = await cookies();

	cookieStore.set("userId", user.id);
	cookieStore.set("verification", "true");

	await sendCodeByEmail(user.id, email);

	redirect("/login/verification");
}

function generateCode(): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 7; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters[randomIndex];
	}
	return code;
}

async function sendCodeByEmail(id: string, email: string): Promise<void> {
	const code = generateCode();

	await addVerificationCode(id, code);

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_HOST_ADDRESS,
			pass: process.env.GMAIL_APP_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.GMAIL_HOST_ADDRESS,
		to: email,
		subject: "Ваш код подтверждения",
		text: `Ваш код подтверждения: ${code}`,
		html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Здравствуйте!</h2>
                <p>Спасибо за использование нашего сервиса. Ваш код подтверждения:</p>
                <p style="font-size: 24px; font-weight: bold; color: #0275d8;">${code}</p>
                <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
                <br>
                <p>С уважением,</p>
                <p>Команда поддержки</p>
            </div>
        `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`Письмо на почту ${email} отправлено с кодом: ${code}`);
	} catch (error) {
		console.error("Ошибка при отправке кода на почту:", error);
	}
}
