"use server";

import { getUserData } from "@/actions/read";
import { cookies } from "next/headers";
import Link from "next/link";

import {
	Inbox,
	ClipboardList,
	ClipboardCheck,
	BarChart,
	CircleUserRound,
	LogOut,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function SideBar() {
	return (
		<aside
			className="fixed top-0 left-0 z-40 w-64 h-screen"
			aria-label="Sidebar"
		>
			<div className="h-full px-3 py-4 relative bg-gray-50 ">
				<div className="py-4 font-bold text-xl text-center bg-slate-400 rounded-xl mb-4">
					Система учета автозапчастей{" "}
				</div>
				<ul className="space-y-2 font-medium">
					<li>
						<Link
							href="/acceptance"
							className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
						>
							<Inbox />
							<span className="flex-1 ms-3 whitespace-nowrap">
								Приемка
							</span>
						</Link>
					</li>
					<li>
						<Link
							href="/orders"
							className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
						>
							<ClipboardList />
							<span className="flex-1 ms-3 whitespace-nowrap">
								Заказы
							</span>
						</Link>
					</li>
					<li>
						<Link
							href="/inventory"
							className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
						>
							<ClipboardCheck />
							<span className="flex-1 ms-3 whitespace-nowrap">
								Инвентаризация
							</span>
						</Link>
					</li>
					<li>
						<Link
							href="#"
							className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
						>
							<BarChart />
							<span className="flex-1 ms-3 whitespace-nowrap">
								Отчеты
							</span>
						</Link>
					</li>
				</ul>
				<SideBar.User />
			</div>
		</aside>
	);
}

SideBar.User = async () => {
	const cookieStore = await cookies();

	const userId = cookieStore.get("userId")?.value;

	const user = await getUserData(userId as string);

	async function handleLogOut() {
		"use server";
		const cookieStore = await cookies();
		cookieStore.delete("userId");
		redirect("/login");
	}

	return (
		<div className="w-full absolute bottom-1 flex flex-row justify-between items-center p-2">
			<div className="flex flex-row items-center gap-2">
				<CircleUserRound />
				<div className="flex flex-col">
					<h2 className="text-base">
						{user?.name} {user?.surname}
					</h2>
					<span className="text-xs">{user?.email}</span>
				</div>
			</div>
			<button
				className="mr-3 p-1 hover:bg-slate-300 rounded-xl"
				onClick={handleLogOut}
			>
				<LogOut />
			</button>
		</div>
	);
};
