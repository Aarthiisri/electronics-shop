import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function Login() {
  const { isSignedIn } = useAuth();

  // Already logged in — home page போ
  if (isSignedIn) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 py-8">

      {/* Logo */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg">
          ⚡
        </div>
        <h1 className="text-2xl font-bold text-white">
          Electro<span className="text-orange-400">Shop</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Best Electronics at Best Prices</p>
      </div>

      {/* Clerk SignIn Component — Google login automatic! */}
      <SignIn
        routing="hash"
        afterSignInUrl="/"
        afterSignUpUrl="/"
        appearance={{
          elements: {
            rootBox: "w-full max-w-sm",
            card: "rounded-2xl shadow-2xl border-0",
            headerTitle: "text-gray-900 font-bold",
            socialButtonsBlockButton: "border border-gray-200 hover:bg-gray-50 transition rounded-xl",
            formButtonPrimary: "bg-orange-500 hover:bg-orange-600 transition rounded-xl",
            footerActionLink: "text-orange-500 hover:text-orange-600",
            formFieldInput: "rounded-xl border-gray-200 focus:border-orange-400",
          }
        }}
      />

    </div>
  );
}

export default Login;