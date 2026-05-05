"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validation";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    try {
      await registerUser(data.name, data.email, data.password, data.rePassword, data.phone);
      router.push("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        {/* Server error */}
        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Full name */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 transition ${
                errors.name
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-gray-400"
              }`}
              placeholder="Ahmed Elmessery"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 transition ${
                errors.email
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-gray-400"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-600 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register("phone")}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 transition ${
                errors.phone
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-gray-400"
              }`}
              placeholder="01010700701"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
                className={`w-full px-3 py-2 pr-9 rounded-lg border text-sm focus:outline-none focus:ring-1 transition ${
                  errors.password
                    ? "border-red-300 focus:ring-red-300"
                    : "border-gray-200 focus:ring-gray-400"
                }`}
                placeholder="e.g. Ahmed@123"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="rePassword" className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              id="rePassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("rePassword")}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 transition ${
                errors.rePassword
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-gray-400"
              }`}
              placeholder="Repeat password"
            />
            {errors.rePassword && (
              <p className="mt-1 text-xs text-red-500">{errors.rePassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
