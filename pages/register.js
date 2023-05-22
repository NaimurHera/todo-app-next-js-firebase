import Loader from "@/components/Loader";
import { auth } from "@/firebase/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const RegisterForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const router = useRouter();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const { state } = useAuth();
  const [error, setError] = useState();
  const { isLoading, authUser } = state;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    const email = emailRef?.current.value;
    const password = passwordRef?.current.value;
    const name = nameRef?.current.value;

    try {
      // sign up the user using email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential?.user;
      // Update the user's display name
      await updateProfile(user, {
        displayName: name,
      });
      setIsFormLoading(false);
    } catch (error) {
      var fullErrorMessage = error.message;
      var errorMessage = fullErrorMessage.split(" (auth/")[1].split(").")[0].split("-").join(" ");
      setError(errorMessage);
      setIsFormLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const user = await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (authUser && !isLoading) {
      // if authUser exist then navigate to homepage
      router.push("/");
    }
  });

  return (
    <>
      {!isLoading && !authUser ? (
        // show the page content if authUser dont exist
        <main className="flex lg:h-[100vh]">
          <div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
            <form onSubmit={handleFormSubmit} className="p-8 w-[600px]">
              <h1 className="text-6xl font-semibold">Sign Up</h1>
              <p className="mt-6 ml-1">
                Already have an account ?{" "}
                <Link href="/login" className="underline hover:text-blue-400 cursor-pointer">
                  Login
                </Link>
              </p>

              <div
                onClick={signInWithGoogle}
                className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
              >
                <FcGoogle size={22} />
                <span className="font-medium text-black group-hover:text-white">Login with Google</span>
              </div>

              <div
                onClick={signInWithFacebook}
                className="bg-black/[0.05] text-white w-full py-4 mt-5 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
              >
                <BsFacebook className="text-blue-500" size={22} />
                <span className="font-medium text-black group-hover:text-white">Login with Facebook</span>
              </div>

              <div className="mt-10 pl-1 flex flex-col">
                <label>Name</label>
                <input
                  onChange={() => setError("")}
                  required
                  ref={nameRef}
                  type="text"
                  className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                />
              </div>
              <div className="mt-10 pl-1 flex flex-col">
                <label>Email</label>
                <input
                  onChange={() => setError("")}
                  required
                  ref={emailRef}
                  type="email"
                  className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                />
              </div>
              <div className="mt-10 pl-1 flex flex-col">
                <label>Password</label>
                <input
                  onChange={() => setError("")}
                  required
                  ref={passwordRef}
                  type="password"
                  className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                />
              </div>
              {error && <div className="py-2 mt-2 bg-red-200 px-2 text-center text-red-500 font-medium	">{error}</div>}
              <button
                disabled={isFormLoading}
                type="submit"
                className="disabled:cursor-not-allowed bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
              >
                {isFormLoading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
          <div
            className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
            style={{
              backgroundImage: "url('/login-banner.jpg')",
            }}
          ></div>
        </main>
      ) : (
        // show the loader if Isloading is true
        <Loader />
      )}
    </>
  );
};

export default RegisterForm;
