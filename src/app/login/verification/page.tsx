"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { verify } from "./actions";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { getCookie } from "cookies-next";
import { getUserData } from "@/actions/read";
import Link from "next/link";
import { deleteCode } from "@/actions/delete";

export const containerClassName =
	"w-full h-screen flex items-center justify-center px-4";

export default function LoginPage() {
	return (
		<div className={containerClassName}>
			<CodeForm />
		</div>
	);
}

function CodeForm() {
	const [message, action, isPending] = useActionState(verify, null);
	const [user, setUser] = useState<{ id: string; email: string }>({
		id: "",
		email: "",
	});

	useEffect(() => {
		async function getEmail() {
			const userId = getCookie("userId");

			const user = await getUserData(userId?.toString() as string);

			if (user) {
				setUser({ id: user.id, email: user.email });
			}
		}

		getEmail();
	}, []);

	return (
		<form action={action}>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Вход</CardTitle>
					<CardDescription>
						Введите код, отправленный на почту{" "}
						<span className="font-bold">{user.email}</span>
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="code">Код из письма</Label>
						<Input
							id="code"
							name="code"
							type="text"
							maxLength={7}
							required
						/>
						<Input
							id="userId"
							name="userId"
							type="hidden"
							value={user.id}
							required
						/>
						{message && (
							<Label className="text-red-500">{message}</Label>
						)}
						<Link
							href={"/login"}
							onClick={() => {
								async function removeCode() {
									await deleteCode(user.id);
								}

								removeCode();
							}}
						>
							<Label className="hover:underline text-blue-400 hover:text-blue-600">
								Вернуться обратно ко входу
							</Label>
						</Link>
					</div>
				</CardContent>
				<CardFooter>
					<SubmitVerifyBtn />
				</CardFooter>
			</Card>
		</form>
	);
}

function SubmitVerifyBtn() {
	const { pending } = useFormStatus();
	return (
		<Button className="w-full" type="submit" disabled={pending}>
			{pending ? "Проверка кода..." : "Войти"}
		</Button>
	);
}
