"use server";

import { createUser } from "@/actions/create";
import { NextRequest, NextResponse } from "next/server";

type UserPostDataType = {
	name: string;
	surname: string;
	email: string;
	phone: string;
	address: string;
	isCustomer: boolean;
};

function isUserPostDataType(data: any): data is UserPostDataType {
	return (
		typeof data.name === "string" &&
		typeof data.surname === "string" &&
		typeof data.email === "string" &&
		typeof data.phone === "string" &&
		typeof data.address === "string" &&
		typeof data.isCustomer === "boolean"
	);
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();

		if (!isUserPostDataType(data)) {
			return NextResponse.json(
				{ error: "Неверный формат данных" },
				{ status: 400 }
			);
		}

		const { name, surname, email, phone, address, isCustomer } = data;

		const newUser = await createUser(
			name,
			surname,
			email,
			phone,
			address,
			isCustomer
		);

		return NextResponse.json(
			{
				message: "Пользователь успешно добавлен",
				data: JSON.stringify(newUser),
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Ошибка сервера", details: JSON.stringify(error) },
			{ status: 500 }
		);
	}
}
