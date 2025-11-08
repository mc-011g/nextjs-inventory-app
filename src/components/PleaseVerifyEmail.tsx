export const PleaseVerifyEmail = ({ error, handleGoToLogin }: { error: string | null, handleGoToLogin: () => void }) => {

    return (
        <div className="bg-gray-50 shadow-md border border-gray-300 rounded p-8 flex flex-col gap-4">

            <h1 className="text-2xl font-bold text-center mb-4">Please Verify Your Email</h1>

            {error ?
                <p className="text-red-800">{error}</p>
                :
                <p className="text-gray-800">Check your inbox for a link to verify your email.</p>
            }

            <button onClick={() => handleGoToLogin()} type="button" className="w-fit self-center cursor-pointer bg-blue-600 text-blue-50 p-2 transition hover:bg-blue-500 rounded">Go to Login</button>
        </div>
    );
}