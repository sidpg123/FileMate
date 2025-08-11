"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
// import { get } from "http";
import { getPlanName } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

type amount = {
    value: number;
    duration: string;
};

// type buttonStyle = "default" | "outline" | "ghost" | "link" | "destructive";

type SubscriptionProps = {
    logo: string;
    title: string;
    description: string;
    amount: amount;
    buttonText: string;
    checkoutHandler: (amount: number, userId: string, plan: string, accessToken: string, role: string) => void;
    buttonStyle?: string;
    featureList: string[];
};

export default function Subscription({
    logo,
    title,
    description,
    amount,
    buttonText,
    checkoutHandler,
    featureList,
    buttonStyle
}: SubscriptionProps) {
    const { data: session } = useSession();
    const userId = session?.user?.id
    const accessToken = session?.accessToken;
    const router = useRouter();

    const plan = getPlanName(amount.value);
    const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(amount.value);

    return (
        <Card className="w-full max-w-xs rounded-2xl shadow-md hover:shadow-lg transition">
            <CardHeader>
                <div className="flex justify-start mb-2">
                    <Image src={logo} alt="Plan logo" width={50} height={50} className=" h-12  object-contain" />
                </div>
                <CardTitle className="text-xl mt-2 ">{title}</CardTitle>
                <CardDescription className="mb-3">{description}</CardDescription>
                <div className="mt-6 text-2xl font-bold ">
                    {formattedAmount} <span className="text-sm font-medium text-muted-foreground">/ {amount.duration}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button
                    variant={"outline"}
                    onClick={() => {
                        if(amount.value === 0) {
                            // If the amount is 0, redirect to signup
                            router.push("/signup");
                            return;
                        }
                        if (!userId || !accessToken) {
                            toast.warning("Please log in to purchase a plan.");
                            router.push("/signin"); // or "/auth/login" based on your route
                            return;
                        }

                        checkoutHandler(amount.value, userId, plan, accessToken, session.user.role!);
                    }}
                    className={buttonStyle ? buttonStyle : "w-full"}
                >
                    {buttonText}
                </Button>
                <Separator />
                <ul className="space-y-1">
                    {featureList.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card >
    );
}
