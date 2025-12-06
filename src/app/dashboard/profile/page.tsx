"use client";
import useLanguage from "@/src/hooks/useLanguages";
import { changePassword, changeUserPivacy, fetchUserProfile, UpdateUserProfile } from "@/src/lib/apis";
import { useAuth } from "@/src/lib/context/auth";
import { Avatar, Button, Card, FloatingLabel, HelperText, Label, Select, Spinner, ToggleSwitch } from "flowbite-react";
import { Formik, Form, ErrorMessage } from "formik";
import { CameraIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

// Define the full structure of the fetched user data
interface UserProfile {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    primary_lng: string;
    pic: string;
    is_searchable: boolean; 
}

interface ProfilePageProps {
    initialProfileData: UserProfile;
    setProfileData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}


function ProfilePage({ initialProfileData, setProfileData }: ProfilePageProps) {
    const { user } = useAuth();
    const langs = useLanguage();
    
    // Initialize state directly from props
    const [profileData, localSetProfileData] = useState(initialProfileData); 
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        first_name: Yup.string().required("First name is required"),
        last_name: Yup.string().required("Last name is required"),
        primary_lng: Yup.string().required("Select a language"),
    });

    const handleSuccess = (data: UserProfile) => {
        localSetProfileData(data); 
        setProfileData(data); 
        toast.success("Profile updated successfully");
    };

    const handleSubmit = (values: typeof profileData) => {
        if (!user?.uid) {
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                return;
            }

            if (key === 'pic') {
                if (typeof value === 'object' && value instanceof File) {
                    formData.append(key, value);
                    return;
                }
                return;
            }

            formData.append(key, String(value));
        });


        UpdateUserProfile(user.uid, formData)
            .then((data) => {
                handleSuccess(data as UserProfile);
            })
            .catch((err) => {
                toast.error(err?.message ?? "Error while updating the profile");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setPreviewUrl(imgUrl);

            localSetProfileData((prevData: any) => ({
                ...prevData,
                pic: file, 
            }));
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    return (
        <Card className="shadow-none">
            <Formik
                initialValues={profileData}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, handleChange, handleBlur }) => (
                    <Form className="">
                        <h2 className="text-lg font-semibold mb-4">Main Information</h2>
                        <div className="grid grid-col-1 md:grid-cols-4 gap-4">
                            <div className="col-span-1 flex flex-col gap-4">
                                <Label>Profile Pic</Label>
                                <div id="picUpload" className="flex flex-col items-center">

                                    <div className="relative w-fit">
                                        <Avatar
                                            size="xl"
                                            img={previewUrl || values.pic}
                                            rounded
                                            bordered
                                        />

                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("picInput")?.click()}
                                            className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow hover:scale-105 transition"
                                        >
                                            <CameraIcon className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <input
                                        type="file"
                                        id="picInput"
                                        name="pic"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        onChange={handleProfileImageChange}
                                    />
                                </div>
                            </div>


                            <div className="flex flex-col gap-6 col-span-3">
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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

                                <div>
                                    <Label htmlFor="primary_lng">Primary Language</Label>
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
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </Card>
    );
}


function ChangePasswordComponent() {
    const { user } = useAuth();
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
        if (!user?.uid) {
            return
        }
        if (values['newPassword'] !== values['confirmPassword']) {
            toast.error("Password confirmation failed")
        } else {
            setIsSubmit(true)
            changePassword(user?.uid, values['oldPassword'], values['newPassword'])
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
        <Card className="shadow-none">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange, handleBlur }) => (
                    <Form className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </Card>
    );
}

interface ProfileSecurityProps {
    initialIsSearchable: boolean | undefined;
}

function ProfileSecurity({ initialIsSearchable }: ProfileSecurityProps) {
    const handleSubmit = async (values: { is_searchable: boolean; }) => {
        changeUserPivacy({ is_searchable: values.is_searchable }).then(()=>{
            toast.success("Privacy settings updated")
        }).catch((err)=>{
            toast.error("Privacy settings failed to update")
        })
    };

    const initialValues = {
        is_searchable: initialIsSearchable ?? true,
    };

    return (
        <Card className="shadow-none">
            <h2 className="text-lg font-semibold mb-4">Security & Privacy</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue, submitForm }) => (
                    <Form>
                        <ToggleSwitch
                            checked={values.is_searchable}
                            label="Public User"

                            onChange={async (newValue) => {
                                await setFieldValue('is_searchable', newValue);
                                submitForm();
                            }}
                        />

                        <HelperText>
                            {values.is_searchable
                                ? "Other users can search for you using your username or email."
                                : "Other users cannot search for you. You are private."
                            }
                        </HelperText>
                    </Form>
                )}
            </Formik>
        </Card>
    );
}


export default function AccountSettings() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        if (!user?.uid) {
            setIsLoading(false);
            return;
        }
        fetchUserProfile(user?.uid)
            .then((data) => {
                setProfileData(data as UserProfile); 
            })
            .catch((err) => toast.error(err?.message ?? "Failed to fetch profile"))
            .finally(() => setIsLoading(false));
    }, [user?.uid]);
    
    if (isLoading) {
        return (
            <div className="p-12 flex justify-center items-center">
                <Spinner size="xl" />
            </div>
        );
    }
    
    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-xl font-bold mb-4">My Profile</h1>
            {profileData && <ProfilePage initialProfileData={profileData} setProfileData={setProfileData} />}
            
            {profileData && <ProfileSecurity initialIsSearchable={profileData.is_searchable} />}
            <ChangePasswordComponent />
        </div>
    );
}