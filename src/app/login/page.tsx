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

import { login } from "./actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export const containerClassName =
	"w-full h-screen flex items-center justify-center px-4";

export default function LoginPage() {
	return (
		<div className={containerClassName}>
			<LoginForm />
		</div>
	);
}

function LoginForm() {
	const [message, action, isPending] = useActionState(login, null);

	return (
		<form action={action}>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Вход</CardTitle>
					<CardDescription>
						Введите ваш Email, зарегистрированный в системе
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="m@example.com"
							required
						/>
						{message && (
							<Label className="text-red-500">{message}</Label>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<SubmitLoginBtn />
				</CardFooter>
			</Card>
		</form>
	);
}

function SubmitLoginBtn() {
	const { pending } = useFormStatus();
	return (
		<Button className="w-full" type="submit" disabled={pending}>
			{pending ? "Проверка почты..." : "Войти"}
		</Button>
	);
}
