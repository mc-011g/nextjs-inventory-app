'use client'

import { SignInWithGoogleButton } from "@/components/SignInWithGoogleButton";
import Link from "next/link";
import { useContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/FirebaseAuthProvider";
import { createUserUtil } from "@/util/users/createUserUtil";
import { ToastContext } from "../context/ToastContext";
import { FirebaseAuthError } from "firebase-admin/auth";
import { PleaseVerifyEmail } from "@/components/PleaseVerifyEmail";

export default function Register() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const authContext = useContext(AuthContext);
    const auth = authContext?.auth ?? null;
    const toastContext = useContext(ToastContext);

    const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);

    const provider = new GoogleAuthProvider();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (auth) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((result) => {
                    const createUserInDB = async () => {
                        await createUserUtil({ firebaseUID: result.user.uid, email, firstName, lastName });
                    }
                    createUserInDB();

                    setRegistrationComplete(true);
                    handleSendVerifyEmail(result.user);
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    setError(error.code === "auth/email-already-in-use" ? "Failed to register account. An account with this email already exists." : "Error creating account.");
                });
        }
    }

    const handleSendVerifyEmail = (user: FirebaseUser) => {
        const sendVerifyEmailFunction = async () => {
            try {
                await sendEmailVerification(user);
                toastContext?.handleShowToast("info", "Email verification link sent.")
            } catch (error) {
                setError((error as FirebaseAuthError).message ?? "Failed to send verify email. Please try logging in again to re-send it.");
                toastContext?.handleShowToast("error", "Failed to send verify email.");
            }
        }
        sendVerifyEmailFunction();
    }

    const handleSignInWithGoogle = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                const createUser = async () => {
                    await createUserUtil({
                        firebaseUID: user.uid,
                        email: user.email as string,
                        firstName: user.displayName?.split(' ')[0] as string,
                        lastName: user.displayName?.split(' ')[1] as string,
                    });
                }
                createUser();

                router.push('/');

            }).catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                toastContext?.handleShowToast("error", "Failed to sign in.");
            });
    }

    return (
        <div className="w-full h-[100vh] sm:bg-gray-200 bg-white flex flex-col gap-4 justify-center items-center absolute text-gray-950">

            <h1 className="text-5xl text-center font-bold">Account Registration</h1>

            {!registrationComplete ?
                <form className="max-w-[512px] mx-auto bg-white sm:shadow-md rounded p-8 flex flex-col gap-4 w-full justify-center" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>

                    <label>
                        <div>
                            Email
                        </div>
                        <input maxLength={80} required type="email" placeholder="email@email.com" className="bg-gray-200 text-gray-950 p-2 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <div>
                            Password
                        </div>
                        <input maxLength={80} required type="password" placeholder="password" className="bg-gray-200 text-gray-950 rounded p-2 w-full" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <label>
                        <div>
                            First Name
                        </div>
                        <input maxLength={80} required type="text" placeholder="First name" className="bg-gray-200 text-gray-950 rounded p-2 w-full" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </label>
                    <label>
                        <div>
                            Last Name
                        </div>
                        <input maxLength={80} required type="text" placeholder="Last name" className="bg-gray-200 text-gray-950 rounded p-2 w-full" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </label>

                    <button type="submit" className="cursor-pointer w-full sm:w-[256px] mx-auto rounded bg-green-800 text-green-50 p-2 hover:bg-green-700 mt-4 transition">Register</button>

                    {error &&
                        <div className="w-full text-center text-red-600">{error}</div>
                    }

                    <div className="flex flex-col justify-center items-center gap-4 text-gray-600">
                        <div>
                            <span>Already have an account?</span>
                            <Link href={'/login'} className="ml-2 font-bold cursor-pointer hover:text-gray-950">Login</Link>
                        </div>

                        Or

                        <SignInWithGoogleButton onClick={handleSignInWithGoogle} text={"Sign up with Google"} />
                    </div>
                </form>
                :
                <PleaseVerifyEmail handleGoToLogin={() => router.replace('/login')} error={error} />
            }
        </div>
    );
}