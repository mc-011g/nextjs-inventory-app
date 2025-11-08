'use client'

import { SignInWithGoogleButton } from "@/components/SignInWithGoogleButton";
import Link from "next/link";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/FirebaseAuthProvider";
import { createUserUtil } from "@/util/users/createUserUtil";
import { ToastContext } from "../context/ToastContext";
import { User as FirebaseUser } from "firebase/auth";
import { FirebaseAuthError } from "firebase-admin/auth";
import { PleaseVerifyEmail } from "@/components/PleaseVerifyEmail";

export default function Login() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const provider = new GoogleAuthProvider();
    const authContext = useContext(AuthContext);
    const auth = authContext?.auth ?? null;
    const [showPleaseVerifyEmail, setShowPleaseVerifyEmail] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const toastContext = useContext(ToastContext);

    const handleSubmit = () => {
        if (auth) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {     

                    if (!userCredential.user.emailVerified) {
                        handleSendVerifyEmail(userCredential.user);
                    } else {
                        router.push('/');
                    }
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    setError(errorMessage);
                    toastContext?.handleShowToast("error", "Failed to sign in.");
                });
        }
    }

    const handleSendVerifyEmail = (user: FirebaseUser) => {
        const sendVerifyEmailFunction = async () => {
            try {
                await sendEmailVerification(user);
                setShowPleaseVerifyEmail(true);
                toastContext?.handleShowToast("info", "Email verification link sent.")
            } catch (error) {
                setError((error as FirebaseAuthError).message ?? "Failed to send verify email. Please try logging in again to re-send it.");
                toastContext?.handleShowToast("error", "Failed to send verify email.");
            }
        }
        sendVerifyEmailFunction();
    }

    const handleSignInWithGoogle = () => {
        if (auth) {
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
                });
        }
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">

            {!showPleaseVerifyEmail ?
                <form className="bg-gray-50 shadow-md border border-gray-300 rounded p-8 flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>

                    <h1 className="text-3xl text-center">Login</h1>

                    <label>
                        <div>
                            Email
                        </div>
                        <input type="email" maxLength={80} required placeholder="email@email.com" className="bg-gray-200 text-gray-900 p-2 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>

                    <label>
                        <div>
                            Password
                        </div>
                        <input type="password" maxLength={80} required placeholder="password" className="bg-gray-200 text-gray-900 rounded p-2 w-full" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>

                    <button type="submit" className="cursor-pointer rounded bg-blue-600 text-green-50 p-2 hover:bg-blue-500 transition">Login</button>

                    {error &&
                        <div>{error}</div>
                    }

                    <div>
                        <span>Don&apos;t have an account?</span>
                        <Link href={'/register'} className="ml-2 font-bold cursor-pointer">Register</Link>
                    </div>

                    <SignInWithGoogleButton onClick={handleSignInWithGoogle} text={"Sign in with Google"} />
                </form>
                :
                <PleaseVerifyEmail handleGoToLogin={() => setShowPleaseVerifyEmail(false)} error={error} />
            }
        </div>
    );
}
