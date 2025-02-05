import LogoutButton from "@/app/dashboard/LogoutButton";
import { validateRequest } from "@/lib/auth";
import React from "react";

export default async function Header() {
  const { user } = await validateRequest();
  return (
    <div className="flex justify-between p-2 border-b items-center">
      <p className="font-semibold">Hi,{user?.name}</p>
      <LogoutButton />
    </div>
  );
}
