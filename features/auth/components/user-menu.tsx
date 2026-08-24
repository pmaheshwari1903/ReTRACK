"use client";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { CaretCircleUpIcon, SignOutIcon } from "@phosphor-icons/react";

import { SIGN_IN_PATH } from "../utils";

const DEFAULT_PLAN = "Free";

export type UserMenuProps = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

export type UserMenuTriggerVariant = "compact" | "profile";

type UserMenuTriggerProps = {
	user: UserMenuProps;
	variant?: UserMenuTriggerVariant;
	plan?: string | null;
	className?: string;
};

export function getDisplayName(user: UserMenuProps) {
	return user.name?.trim() || user.email?.split("@")[0] || "User";
}

export function getInitials(user: UserMenuProps) {
	const source = user.name?.trim() || user.email || "U";
	const parts = source.split(/\s+/).filter(Boolean);

	if (parts.length > 1) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return source.slice(0, 2).toUpperCase();
}

function UserAvatar({
	user,
	size = "default",
}: {
	user: UserMenuProps;
	size?: "default" | "sm" | "lg";
}) {
	return (
		<Avatar size={size}>
			{user.image ? (
				<AvatarImage src={user.image} alt={getDisplayName(user)} />
			) : null}
			<AvatarFallback>{getInitials(user)}</AvatarFallback>
		</Avatar>
	);
}

export function UserMenu({
	user,
	variant = "profile",
	plan = DEFAULT_PLAN,
	className,
}: UserMenuTriggerProps) {
	const router = useRouter();
	const displayName = getDisplayName(user);

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push(SIGN_IN_PATH);
					router.refresh();
				},
			},
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size={variant === "compact" ? "icon" : undefined}
					className={cn(
						variant === "compact" ? "rounded-full" : "h-9 gap-2 px-2",
						className,
					)}
					aria-label="Open account menu"
				>
					<UserAvatar
						user={user}
						size={variant === "compact" ? "default" : "sm"}
					/>
					{variant === "profile" ? (
						<>
							<span className="max-w-32 truncate text-left text-xs font-medium">
								{displayName}
							</span>
							<CaretCircleUpIcon className="size-4 text-muted-foreground" />
						</>
					) : null}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-start gap-2 px-2 py-2">
							<UserAvatar user={user} />
							<div className="flex min-w-0 flex-1 flex-col gap-1">
								<p className="truncate text-xs font-medium">{displayName}</p>
								{user.email ? (
									<p className="truncate text-xs text-muted-foreground">
										{user.email}
									</p>
								) : null}
								<Badge variant="secondary" className="w-fit">
									{plan} plan
								</Badge>
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive" onClick={handleSignOut}>
						<SignOutIcon />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type UserMenuWithSessionProps = Omit<UserMenuTriggerProps, "user">;

export function UserMenuWithSession(props: UserMenuWithSessionProps) {
	const { data: session, isPending } = authClient.useSession();

	if (isPending || !session?.user) {
		return null;
	}

	return <UserMenu user={session.user} {...props} />;
}