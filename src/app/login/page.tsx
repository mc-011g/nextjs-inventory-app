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
                    setError(error.code === "auth/invalid-credential" ? "Invalid email or password." : "Error signing in.");
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
                       setError(error.code === "auth/invalid-credential" ? "Invalid email or password." : "Error signing in.");
                });
        }
    }

    return (
        <div className="w-full h-[100vh] bg-white sm:bg-gray-200 flex flex-col gap-4 justify-center items-center absolute text-gray-950">

            <h1 className="text-5xl text-center font-bold">Login</h1>

            {!showPleaseVerifyEmail ?
                <form className="max-w-[512px] mx-auto bg-white sm:shadow-md rounded p-8 flex flex-col gap-4 w-full justify-center" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>

                    <label>
                        <div>
                            Email
                        </div>
                        <input type="email" maxLength={80} required placeholder="email@email.com" className="bg-gray-200 text-gray-950 p-2 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>

                    <label>
                        <div>
                            Password
                        </div>
                        <input type="password" maxLength={80} required placeholder="password" className="bg-gray-200 text-gray-950 p-2 rounded w-full" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>

                    <button type="submit" className="cursor-pointer w-full sm:w-[256px] mx-auto rounded bg-green-800 text-green-50 p-2 hover:bg-green-700 mt-4 transition">Login</button>

                    {error &&
                        <div className="w-full text-center text-red-600">{error}</div>
                    }

                    <div className="flex flex-col justify-center items-center gap-4 text-gray-600">
                        <div>
                            <span>Don&apos;t have an account?</span>
                            <Link href={'/register'} className="ml-2 font-bold cursor-pointer hover:text-gray-950">Register</Link>
                        </div>

                        Or

                        <SignInWithGoogleButton onClick={handleSignInWithGoogle} text={"Sign in with Google"} />
                    </div>
                </form>
                :
                <PleaseVerifyEmail handleGoToLogin={() => setShowPleaseVerifyEmail(false)} error={error} />
            }
        </div>
    );
}