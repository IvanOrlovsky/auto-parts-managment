"use server";

import { createOrder } from "@/actions/create";
import {
	areAllPartsAvailableForSale,
	getAllCustomers,
	getAvailableToOrderParts,
	getUserData,
} from "@/actions/read";
import { NextRequest, NextResponse } from "next/server";

type OrderPostDataType = {
	customerId: string;
	parts: string[];
};

function isOrderPostDataType(data: any): data is OrderPostDataType {
	return (
		typeof data.customerId === "string" &&
		Array.isArray(data.parts) &&
		data.parts.every((item: any) => typeof item === "string")
	);
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();

		if (!isOrderPostDataType(data)) {
			return NextResponse.json(
				{ error: "Неверный формат данных" },
				{ status: 400 }
			);
		}

		const { customerId, parts } = data;

		const customers = await getAllCustomers();

		const customer = await getUserData(customerId);
		if (!customer) {
			return NextResponse.json(
				{
					error: `Пользователь с таким ID не найден\nДоступные покупатели: ${JSON.stringify(
						customers
					)}`,
				},
				{ status: 404 }
			);
		}

		if (!customer.isCustomer) {
			return NextResponse.json(
				{ error: "Указанный пользователь не является покупателем!" },
				{ status: 404 }
			);
		}

		const avaliableParts = await getAvailableToOrderParts();

		const arePartsAbleToOrder = await areAllPartsAvailableForSale(parts);

		if (!arePartsAbleToOrder) {
			return NextResponse.json(
				{
					error: `Вы пытаетесь заказать детали, которые либо проданы, либо еще не приняты!\n Доступные для заказа детали: ${JSON.stringify(
						avaliableParts
					)}`,
				},
				{ status: 400 }
			);
		}

		const order = await createOrder(customerId, parts);

		return NextResponse.json(
			{
				message: "Заказ успешно создан",
				data: JSON.stringify(order),
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
