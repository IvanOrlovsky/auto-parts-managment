import { updatePriceForSale } from "@/actions/update";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { id, priceForSale } = await request.json();
		await updatePriceForSale(id, priceForSale);
		return NextResponse.json("Запчасть успешно принята на баланс!");
	} catch (error) {
		return NextResponse.error();
	}
}
