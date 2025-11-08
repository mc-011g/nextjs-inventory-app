import { useContext, useState } from "react";
import { Modal } from "./Modal"
import { ToastContext } from "@/app/context/ToastContext";
import { AuthContext } from "../FirebaseAuthProvider";
import { GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, verifyBeforeUpdateEmail } from "firebase/auth";
import { FirebaseAuthError } from "firebase-admin/auth";
import { EmailAuthProvider } from "firebase/auth/web-extension";

export const ChangeEmailModal = ({ closeModal }: { closeModal: () => void }) => {

    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const toastContext = useContext(ToastContext);

    const handleUpdateEmail = async () => {
        if (!user) {
            toastContext?.handleShowToast("error", "Failed to update email.");
            return;
        }

        try {
            setIsLoading(true);
            await verifyBeforeUpdateEmail(user, email);
            toastContext?.handleShowToast("info", "Verification email sent to new email address.");
            closeModal();
        } catch (error) {
            const firebaseError = error as FirebaseAuthError;
            if (firebaseError.code === "auth/requires-recent-login") {

                const usesGoogleAuth = user.providerData.some(info => info.providerId === "google.com");

                if (usesGoogleAuth) {
                    try {
                        const provider = new GoogleAuthProvider();

                        await reauthenticateWithPopup(user, provider);
                        await verifyBeforeUpdateEmail(user, email);
                        toastContext?.handleShowToast("info", "Verification email sent to new email address.");
                        closeModal();
                    } catch (error) {
                        setError((error as FirebaseAuthError).message ?? "Failed to update email.")
                    }
                } else {
                    const password = prompt("Please re-enter your password to update your email.");

                    if (!password || !user) {
                        setError(firebaseError.message);
                        return;
                    }

                    const credential = EmailAuthProvider.credential(user.email as string, password);

                    if (credential) {
                        try {
                            await reauthenticateWithCredential(user, credential);
                            await verifyBeforeUpdateEmail(user, email);
                            toastContext?.handleShowToast("info", "Verification email sent to new email address.");
                            closeModal();
                        } catch (error) {
                            setError((error as FirebaseAuthError).message ?? "Failed to update email.");
                        }
                    }
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Update Email" closeModal={closeModal}>
            <form className="flex flex-col gap-4 text-gray-600 justify-between h-full" onSubmit={e => { e.preventDefault(); handleUpdateEmail() }}>

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Enter New Email
                        <input required maxLength={80} type="email" placeholder="email@email.com" className="rounded bg-gray-200 py-2 px-4" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                </div>

                {error &&
                    <div className="text-red-600">{error}</div>
                }

                <div className="flex justify-end gap-4">
                    <button type="button" className="bg-gray-300 p-2 rounded hover:bg-gray-400 hover:text-gray-700 cursor-pointer" onClick={closeModal}>
                        Cancel
                    </button>

                    <button type="submit" className="bg-green-300 p-2 rounded hover:bg-green-400 hover:text-gray-700 cursor-pointer inline-flex gap-2 items-center">
                        {isLoading &&
                            <div className=" size-5 animate-spin
                         border-l-2 border-b-2 border-r-2 border-r-green-50 border-t-green-50 border-t-2
                          rounded-full border-l-green-300 border-t-green-50 border-b-green-300/50"></div>
                        }
                        Submit
                    </button>
                </div>
            </form>
        </Modal>
    )
}