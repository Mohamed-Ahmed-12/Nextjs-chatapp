"use client"
import { useAuth } from "@/src/lib/context/auth";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function Login() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },

        onSubmit: values => {
            console.log(values)
            const { username, password } = values;
            if (login) {
                login(username, password)
                    .then(() => {
                        router.push('/dashboard')
                        toast.success("Welcome back")
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.detail)
                    })
            } else {
                console.error('Login function is not available');
                // You can show an error message to the user here
            }

        },
    });
    useEffect(() => {
        if (isAuthenticated)
            router.push('/dashboard')
    }, [isAuthenticated])


    return (
        <div className="min-h-dvh bg-linear-to-br from-blue-50 to-indigo-300 dark:from-gray-900 dark:to-indigo-950">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
                {/* Left Side - Login Form */}
                <div className="flex flex-col justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={formik.handleSubmit}>
                            <div>
                                <Label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Username
                                </Label>
                                <div className="relative">
                                    <TextInput
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        required
                                        className=" w-full"
                                        name="username"
                                        onChange={formik.handleChange}
                                        value={formik.values.username}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Password
                                    </Label>
                                    <Link
                                        href="#"
                                        className="text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full"
                                        name="password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox id="remember" />
                                    <Label
                                        htmlFor="remember"
                                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                size="lg"
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{" "}
                                <Link
                                    href="#"
                                    className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image/Graphics */}
                <div className="hidden lg:flex relative bg-linear-to-br from-indigo-600 to-purple-700">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <Image
                        src={'/chat-bg.gif'}
                        alt="Chat App Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}