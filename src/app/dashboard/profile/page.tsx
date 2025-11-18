"use client";
import { useUserData } from "@/src/hooks/useUser";
import { changePassword, fetchLanguages, fetchUserProfile, UpdateUserProfile } from "@/src/lib/apis";
import { Button, FloatingLabel, Label, Select, Spinner } from "flowbite-react";
import { Formik, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

function ProfilePage() {
    const { uid } = useUserData();
    const [langs, setLangs] = useState([]);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        primary_lng: "",
    });
    const [loading, setIsLoading] = useState(false)

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        first_name: Yup.string().required("First name is required"),
        last_name: Yup.string().required("Last name is required"),
        primary_lng: Yup.string().required("Select a language"),
    });

    const handleSubmit = (values: typeof profileData) => {
        setIsLoading(true)
        UpdateUserProfile(uid, values)
            .then((data) => {
                setProfileData(data)
            })
            .catch((err) => {
                toast.error(err?.message ?? "Error while updating the profile")
            })
            .finally(() => {
                toast.success("Profile updated successfully")
                setIsLoading(false)
            })
    };

    useEffect(() => {
        fetchLanguages()
            .then((data) => {
                setLangs(data)
            })
            .catch((err) => {
                toast.error(err?.message ?? "Error while fetching languages")
            })
    }, [])

    useEffect(() => {
        if (!uid) return;
        fetchUserProfile(uid)
            .then((data) => {
                setProfileData({
                    username: data.username || "",
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    primary_lng: data.primary_lng || "",
                });
            })
            .catch((err) => toast.error(err?.message ?? "Failed to fetch profile"));
    }, [uid]);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">My Profile</h1>
            <Formik
                initialValues={profileData}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, handleChange, handleBlur }) => (
                    <Form className="flex flex-col gap-6">
                        {/* Main Information */}
                        <div>
                            <Label>Main Information</Label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <FloatingLabel
                                        variant="outlined"
                                        label="Username"
                                        name="username"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <FloatingLabel
                                        variant="outlined"
                                        label="Email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <FloatingLabel
                                        variant="outlined"
                                        label="First Name"
                                        name="first_name"
                                        value={values.first_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <FloatingLabel
                                        variant="outlined"
                                        label="Last Name"
                                        name="last_name"
                                        value={values.last_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Primary Language */}
                        <div>
                            <Label htmlFor="primary_lng">Select Primary Language</Label>
                            <Select
                                id="primary_lng"
                                name="primary_lng"
                                value={values.primary_lng}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-2"
                                required
                            >
                                <option value="">Select Language</option>
                                {langs.length > 0 && (
                                    langs.map((lang, index) => (
                                        <option key={index} value={lang[0]}>{lang[1]}</option>
                                    ))
                                )}
                            </Select>
                            <ErrorMessage name="primary_lng" component="div" className="text-red-500 text-sm" />
                        </div>


                        <Button color="purple" type="submit">
                            {loading && <Spinner size="sm" aria-label="Info spinner example" className="me-3" light />} Save Changes
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}



function ChangePassword() {
    const { uid } = useUserData();
    const [isSubmit, setIsSubmit] = useState(false);
    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Old password is required"),
        newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Confirm your new password"),
    });


    const handleSubmit = (values: typeof initialValues, { resetForm }: any) => {
        // TODO: Send password change request to API
        if (values['newPassword'] !== values['confirmPassword']) {
            toast.error("Password confirmation failed")
        } else {
            setIsSubmit(true)
            changePassword(uid, values['oldPassword'], values['newPassword'])
                .then(() => {
                    toast.success("Password changed successfully")
                    resetForm();
                })
                .catch((err) => {
                    toast.error("Error occurred in changing password")

                })
                .finally(() => {
                    setIsSubmit(false)
                })

        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange, handleBlur }) => (
                    <Form className="flex flex-col gap-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    label="Old Password"
                                    name="oldPassword"
                                    type="password"
                                    value={values.oldPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <FloatingLabel
                                    variant="outlined"
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                            </div>
                        </div>

                        <Button type="submit" color={'alternative'} disabled={isSubmit}>
                            Update Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}


export default function AccountSettings() {
    return (
        <div className="p-6">
            <ProfilePage />
            <ChangePassword />
        </div>
    );
}