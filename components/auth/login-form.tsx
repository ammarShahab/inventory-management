"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "@/app/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";

const DEMO_CREDENTIALS = {
  email: "demo@inventory.com",
  password: "Demo1234",
};

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = form.formState;
  const isLoading = isSubmitting || isDemoLoading;

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/dashboard");
  }

  // ✅ One-click demo login — no form submission needed
  async function handleDemoLogin() {
    setServerError(null);
    setIsDemoLoading(true);

    form.setValue("email", DEMO_CREDENTIALS.email);
    form.setValue("password", DEMO_CREDENTIALS.password);

    // Try sign in first
    let result = await authClient.signIn.email({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    });

    // If it failed, create the account then sign in again
    if (result.error) {
      const signup = await authClient.signUp.email({
        name: "Demo User",
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
      });

      if (signup.error) {
        setServerError("Demo login failed. Please try again.");
        setIsDemoLoading(false);
        return;
      }

      result = await authClient.signIn.email({
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
      });
    }

    if (result.error) {
      setServerError("Demo login failed. Please try again.");
      setIsDemoLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="john@example.com"
                {...form.register("email")}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="pr-10" // Space for the eye icon
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  //   disabled={!form.watch("password")} // Optional: disable if empty
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>
          </FieldGroup>

          {serverError && (
            <p className="text-sm font-medium text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* ✅ Instant demo login button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDemoLogin}
          type="button"
          disabled={isLoading}
        >
          {isDemoLoading ? "Logging in as Demo..." : "🚀 Demo Login"}
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
          >
            Go to Home
          </Button>
        </Link>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
