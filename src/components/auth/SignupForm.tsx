"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import {
    Label,
    TextInput,
    Select,
    FileInput,
    Button,
    HelperText,
} from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import useLanguage from "@/src/hooks/useLanguages";
import { useAuth } from "@/src/lib/context/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

// VALIDATION SCHEMA
const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().required("Username is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),

    password: Yup.string()
        .min(8, "Password must be 8 characters or more")
        .required("Password is required"),

    confirm_pass: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Password confirmation is required"),

    primary_lng: Yup.string().required("Preferred language is required"),

    pic: Yup.mixed().nullable(),
});

export default function SignupForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const langs = useLanguage();
    const router = useRouter();
    const { signup } = useAuth();

    const formik = useFormik({
        initialValues: {
            email: "",
            first_name: "",
            last_name: "",
            username: "",
            pic: null as File | null,
            primary_lng: "",
            password: "",
            confirm_pass: "",
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== null) formData.append(key, value as any);
                });

                if (!signup) return toast.error("Authentication error");

                await signup(formData);
                toast.success("Registration successful!");
                router.push("/");
            } catch (err: any) {
                toast.error(err?.message || "Registration failed. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        formik.setFieldValue("pic", file);
    };

    const showError = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field] ? (
            <HelperText color="failure">{formik.errors[field]}</HelperText>
        ) : null;

    return (
        <div className="min-h-dvh bg-linear-to-br to-blue-200 from-purple-100 dark:from-gray-900 dark:to-indigo-950">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
                {/* LEFT SIDE */}
                <div className="flex flex-col justify-center items-center p-8">
                    <div className="w-full max-w-lg">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Create an account
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Connect with your friends today
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* FIRST NAME */}
                                <div>
                                    <Label htmlFor="first_name">First Name</Label>
                                    <TextInput
                                        id="first_name"
                                        name="first_name"
                                        placeholder="Joe"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.first_name}
                                    />
                                    {showError("first_name")}
                                </div>

                                {/* LAST NAME */}
                                <div>
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <TextInput
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Doe"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.last_name}
                                    />
                                    {showError("last_name")}
                                </div>

                                {/* USERNAME */}
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <TextInput
                                        id="username"
                                        name="username"
                                        placeholder="username"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.username}
                                    />
                                    {showError("username")}
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <TextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="example@example.com"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                    />
                                    {showError("email")}
                                </div>

                                {/* PROFILE PICTURE */}
                                <div>
                                    <Label htmlFor="pic">Profile Picture</Label>
                                    <FileInput id="pic" name="pic" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" />
                                    {showError("pic")}
                                </div>

                                {/* LANGUAGE */}
                                <div>
                                    <Label htmlFor="primary_lng">Primary Language</Label>
                                    <Select
                                        id="primary_lng"
                                        name="primary_lng"
                                        value={formik.values.primary_lng}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select Language</option>
                                        {langs?.map((lang, index) => (
                                            <option key={index} value={lang[0]}>
                                                {lang[1]}
                                            </option>
                                        ))}
                                    </Select>
                                    {showError("primary_lng")}
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                    />
                                    {showError("password")}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <Label htmlFor="confirm_pass">Confirm Password</Label>
                                    <TextInput
                                        id="confirm_pass"
                                        name="confirm_pass"
                                        type="password"
                                        placeholder="••••••••"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirm_pass}
                                    />
                                    {showError("confirm_pass")}
                                </div>
                            </div>

                            {/* SUBMIT */}

                            <Button type="submit"
                                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                size="lg"
                                disabled={isSubmitting}>
                                Signup
                            </Button>
                        </form>

                        {/* SIGN IN */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    href="/"
                                    className="font-medium text-cyan-600 hover:text-cyan-500"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE IMAGE */}
                <div className="hidden lg:flex relative bg-linear-to-br from-indigo-600 to-purple-700">
                    <div className="absolute inset-0 bg-black/20" />
                    <Image
                        src="/chat-bg.gif"
                        alt="Chat Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
