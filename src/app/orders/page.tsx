"use client";

import { deleteOrder } from "@/actions/delete";
import { getAllOrders } from "@/actions/read";
import { giveOrder } from "@/actions/update";
import { Order, User, Part } from "@prisma/client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const successMessage = (message: string) => toast.success(message);
const errorMessage = (message: string) => toast.error(message);

type OrderType = {
	customer: User;
	parts: Part[];
} & Order;

export default function OrdersPage() {
	const [orders, setOrders] = useState<OrderType[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const orders = await getAllOrders();
			setOrders(orders);
		};
		fetchOrders();
	}, []);

	const handleGiveOrder = async (orderId: string) => {
		await giveOrder(orderId);
		successMessage("Заказ успешно выдан");

		const orders = await getAllOrders();
		setOrders(orders);
	};

	const rejectOrder = async (orderId: string) => {
		await deleteOrder(orderId);
		successMessage("Заказ успешно отменен");

		const orders = await getAllOrders();
		setOrders(orders);
	};

	return (
		<>
			<Toaster />
			<div className="container mx-auto p-6">
				<h1 className="text-4xl font-bold mb-6">Заказы</h1>
				<table className="min-w-full border border-gray-300">
					<thead className="bg-gray-100">
						<tr>
							<th className="border px-4 py-2 text-left">
								Номер заказа
							</th>
							<th className="border px-4 py-2 text-left">
								Клиент
							</th>
							<th className="border px-4 py-2 text-left">
								Содержимое заказа
							</th>
							<th className="border px-4 py-2 text-left">
								Сумма заказа
							</th>
							<th className="border px-4 py-2 text-center">
								Действие
							</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order: OrderType) => (
							<tr key={order.id} className="hover:bg-gray-50">
								<td className="border px-4 py-2">{order.id}</td>
								<td className="border px-4 py-2">
									{order.customer.name}{" "}
									{order.customer.surname}
								</td>
								<td className="border px-4 py-2">
									<ul>
										{order.parts.map((part) => (
											<li key={part.id}>{part.name}</li>
										))}
									</ul>
								</td>
								<td className="border px-4 py-2">
									{order.parts
										.reduce((total, part) => {
											const priceForSale =
												part.priceForSale || 0;
											return total + priceForSale;
										}, 0)
										.toFixed(2)}
								</td>
								<td className="border px-4 py-2 flex flex-row gap-2">
									<button
										className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
										onClick={() => {
											handleGiveOrder(order.id);
										}}
									>
										Выдать заказ
									</button>
									<button
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
										onClick={() => {
											rejectOrder(order.id);
										}}
									>
										Отменить заказ
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
