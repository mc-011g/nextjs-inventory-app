'use client'

import { AuthContext } from "@/components/FirebaseAuthProvider";
import PageContainer from "@/components/PageContainer";
import { getProfileDataUtil } from "@/util/profile/getProfileDataUtil";
import { updateProfileNamesUtil } from "@/util/profile/updateProfileNamesUtil";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContext } from "../context/ToastContext";
import { ChangeEmailModal } from "@/components/modals/ChangeEmailModal";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseAuthError } from "firebase-admin/auth";

export default function Profile() {

    interface Profile {
        email: string,
        firstName: string,
        lastName: string,
        imageLink: string,
    }

    const authContext = useContext(AuthContext);
    const auth = authContext?.auth;
    const user = authContext?.user;
    const authIsLoading = authContext?.isLoading;
    const toastContext = useContext(ToastContext);

    const initialUserDataRef = useRef<Profile | null>(null);

    const [modal, setModal] = useState<{ type: number } | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [sendPasswordResetEmailLoading, setSendPasswordResetEmailLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user && !authIsLoading) {
            try {
                const getInitialProfileData = async () => {
                    const userIdToken = await user.getIdToken();
                    const profileData: Profile = await getProfileDataUtil(userIdToken);

                    setFirstName(profileData.firstName);
                    setLastName(profileData.lastName);

                    initialUserDataRef.current = profileData;
                }
                getInitialProfileData();

            } catch (error) {
                setError((error as Error).message ?? "Failed to get profile data.");
                toastContext?.handleShowToast("error", "Failed to get profile data.")
            } finally {
                setLoading(false);
            }
        }
    }, [authIsLoading, toastContext, user]);


    const handleSaveChanges = () => {
        if (user && !authIsLoading) {
            const updateProfile = async () => {

                try {
                    const userIdToken = await user.getIdToken();
                    const updatedProfileNames: Profile = await updateProfileNamesUtil(firstName, lastName, userIdToken);
                    setFirstName(updatedProfileNames.firstName);
                    setLastName(updatedProfileNames.lastName);
                } catch (error) {
                    setError((error as Error).message ?? "Failed to save profile changes.");
                    toastContext?.handleShowToast("error", "Failed to show profile changes");
                }
            }
            updateProfile();
            setShowButtons(false);
            toastContext?.handleShowToast("success", "Saved profile.");
        }
    }

    const usingGoogleAuthProvider = () => {
        if (user && !authIsLoading) {
            const userProviderData = user.providerData;
            return userProviderData?.some(data => data.providerId === "google.com");
        }
    }

    const handleSendPasswordResetEmail = () => {
        if (usingGoogleAuthProvider() === true) {
            return;
        }

        if (!auth || !user || !user.email) {
            return;
        }

        setSendPasswordResetEmailLoading(true);

        try {
            const sendPasswordResetEmailFunction = async () => {
                await sendPasswordResetEmail(auth, user.email as string);
                toastContext?.handleShowToast("info", "Sent password reset email. Check your inbox.");
            }
            sendPasswordResetEmailFunction();

        } catch (error) {
            setError((error as FirebaseAuthError).message ?? "Failed to send password reset email. Please try again.");
            toastContext?.handleShowToast("error", "Failed to send password reset email.");
        } finally {
            setSendPasswordResetEmailLoading(false);
        }
    }

    const handleResetChanges = () => {
        if (initialUserDataRef.current) {
            setFirstName(initialUserDataRef.current.firstName);
            setLastName(initialUserDataRef.current.lastName);
        }
    }

    useEffect(() => {
        if (!loading && initialUserDataRef.current) {
            if (firstName !== initialUserDataRef.current?.firstName ||
                lastName !== initialUserDataRef.current.lastName) {  
                setShowButtons(true);
            } else {
                setShowButtons(false);
            }
        }
    }, [firstName, lastName, loading])

    return (
        <>
            {!loading &&
                <PageContainer title="Profile">
                    <div className="bg-gray-100 rounded w-full p-8  h-full flex flex-col justify-center items-center text-gray-900">

                        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleSaveChanges(); }}>

                            <div className="flex flex-row gap-4 items-center justify-center flex-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24 text-gray-600 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label>
                                    Email
                                    <div className="p-2">{user?.email}</div>
                                </label>

                                <div className="flex flex-row flex-wrap gap-2">
                                    <button type="button" className="w-fit cursor-pointer rounded border border-gray-600 text-gray-600 p-2 hover:bg-gray-500 hover:text-gray-50 transition" onClick={() => setModal({ type: 2 })}>Change Email</button>

                                    {!usingGoogleAuthProvider() &&
                                        <div className="flex flex-col gap-2">
                                            <button type="button" disabled={sendPasswordResetEmailLoading}
                                                className={`${sendPasswordResetEmailLoading ? 'border-gray-400 text-gray-400 inline-flex gap-2 items-center' : 'hover:bg-gray-500 hover:text-gray-50 transition cursor-pointer border-gray-600 text-gray-600'} w-fit rounded border p-2 `}
                                                onClick={() => handleSendPasswordResetEmail()}>
                                                {sendPasswordResetEmailLoading &&
                                                    <div className="rounded-full border border-2 border-gray-600 border-l-gray-300 size-4 animate-spin"></div>
                                                }
                                                Reset Password
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>

                            <label>
                                First Name
                                <input required maxLength={80} type="text" placeholder="First Name" className="bg-gray-200 text-gray-900 p-2 rounded w-full" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </label>

                            <label>
                                Last Name
                                <input required maxLength={80} type="text" placeholder="Last Name" className="bg-gray-200 text-gray-900 p-2 rounded w-full" value={lastName} onChange={e => setLastName(e.target.value)} />
                            </label>

                            {error &&
                                <p className="text-red-800">{error}</p>
                            }

                            {showButtons ?
                                <div className="flex flex-wrap gap-2 justify-between">
                                    <button type="button" className="flex-1 cursor-pointer rounded border border-gray-500 text-gray-600 p-2 hover:bg-gray-500 hover:text-gray-50 transition" onClick={() => handleResetChanges()}>Reset Changes</button>
                                    <button type="submit" className="flex-1 cursor-pointer rounded bg-blue-600 text-green-50 p-2 hover:bg-blue-500 transition">Save</button>
                                </div>
                                :
                                <div className="py-[21px]"></div>
                            }
                        </form>

                    </div>

                    {modal?.type === 2 &&
                        <ChangeEmailModal closeModal={() => setModal(null)} />
                    }

                </PageContainer>
            }
        </>
    )
}