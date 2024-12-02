"use server";

import { createAcceptPart } from "@/actions/create";
import { getAllSuppliers, isSupplier } from "@/actions/read";
import { NextRequest, NextResponse } from "next/server";

type AcceptPartPostDataType = {
	name: string;
	description: string;
	priceForPurchase: number;
	supplierId: string;
};

function isUserPostDataType(data: any): data is AcceptPartPostDataType {
	return (
		typeof data.name === "string" &&
		typeof data.description === "string" &&
		typeof data.priceForPurchase === "number" &&
		typeof data.supplierId === "string"
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

		const { name, description, priceForPurchase, supplierId } = data;

		const allSuppliers = await getAllSuppliers();

		const isSupplierExist = await isSupplier(supplierId);

		if (!isSupplierExist) {
			return NextResponse.json(
				{
					error: `Поставщик с таким идентификатором не найден\n Доступные поставщики: ${JSON.stringify(
						allSuppliers
					)}`,
				},
				{ status: 404 }
			);
		}

		const newUser = await createAcceptPart(
			name,
			description,
			priceForPurchase,
			supplierId
		);

		return NextResponse.json(
			{
				message: "Заказ на приемку успешно добавлен",
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
