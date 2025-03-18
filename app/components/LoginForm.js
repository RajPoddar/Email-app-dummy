"use client";


// next/navigations 
import { useRouter } from "next/navigation";
import Link from "next/link";


// React hooks
import { useState, useEffect } from "react";




// Bootstrap
import { Button, Form, Container, Card } from "react-bootstrap";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";

// Components
import Header from "@/app/components/Header";

// Authentication
import { db, doc, setDoc, getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from "../firebaseConfig";

//react-Toast 
import { toast } from "react-toastify";

export default function LoginForm() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [signUp, setSignUp] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showPass, setShowPass] = useState("");

    const auth = getAuth();

    // Check If User is already logged In
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/Pages/dashboard');
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPass(false);
        }, 200); // 2 seconds delay

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    const handleSubmit = async (e) => {
        if (loading) {
            return;
        }
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        setError("");
        const auth = getAuth();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            setLoading(false);
            return;
        }

        if (!signUp) {
            try {

                await signInWithEmailAndPassword(auth, email, password);
                setEmail("");
                setPassword("");
                toast.success("Login successful!");
                setLoading(false);
                router.push("/Pages/dashboard");
            } catch (err) {
                setLoading(false);
                setError("Invalid email or password");
                toast.error("Invalid email or password");
            }
        }
        else {
            try {

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // console.log("Signup successful:", userCredential.user);
                const user = userCredential.user;


                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date()
                }, { merge: true });

                const actionCodeSettings = {
                    url: "http://localhost:3000/Payment", // Redirect URL after verification
                    handleCodeInApp: true, // Ensures Firebase handles the link correctly
                };

                // console.log(user);

                await sendEmailVerification(user, actionCodeSettings);

                toast.success("Verification email sent! Please check your inbox.");
                setLoading(false);

                setEmail("");
                setPassword("");
                // let res = await sendVerificationEmail(user.email);

                // if (res.success) {
                //     toast.success(res.message);
                //     setEmail("");
                //     setPassword("");
                // }
                // else {
                //     toast.error(res.message);
                // }


            }
            catch (error) {
                setLoading(false);
                if (error.code === "auth/email-already-in-use") {
                    toast.error("This email is already registered. Please log in instead.");
                } else {
                    console.error("Error signing up:", error.message);
                    toast.error(error.message);
                }
            }
        }

    };

    // Google Sign-In
    const handleGoogleLogin = async () => {
        setError("");

        if (loading) { return };
        setLoading(true);

        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        if (!signUp) {
            try {


                // provider.setCustomParameters({ prompt: "select_account", login_hint: "user@example.com" });
                await signOut(auth);
                const result = await signInWithPopup(auth, provider);
                // console.log("Google login successful:", result.user);
                toast.success(`Google login successful !`);


                let user = result.user;

                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date()
                }, { merge: true });

                if (!user.emailVerified) {
                    const actionCodeSettings = {
                        url: "http://localhost:3000/Pages/Payment", // Redirect URL after verification
                        handleCodeInApp: true, // Ensures Firebase handles the link correctly
                    };
                    await sendEmailVerification(user, actionCodeSettings);
                    toast.warn("Verification email sent! Please check your inbox.");
                }

                router.push("/Pages/dashboard");

            } catch (error) {
                if (error.message === 'Firebase: Error (auth/popup-closed-by-user).') {
                    setError("Popup closed!");
                    toast.error("Popup closed!");
                }
                setLoading(false);
                // toast.error(error.message);
                console.log(error.message);
            }
        }
        else {
            try {



                const result = await signInWithPopup(auth, provider);
                // console.log("Google login successful:", result.user);
                toast.success(`Google login successful !`);

                let user = result.user;


                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date()
                }, { merge: true });

                const actionCodeSettings = {
                    url: "http://localhost:3000/Pages/Payment", // Redirect URL after verification
                    handleCodeInApp: true, // Ensures Firebase handles the link correctly
                };

                await sendEmailVerification(user, actionCodeSettings);

                setLoading(false);

                toast.success('Verification email sent! Please check your inbox.')
                // let res = await sendVerificationEmail(user.email)

                // if (res.success) {
                //     toast.success(res.message);
                // }
                // else {
                //     toast.error(res.message);
                // }

            } catch (error) {
                if (error.message === 'Firebase: Error (auth/popup-closed-by-user).') {
                    setError("Popup closed!");
                    toast.error("Popup closed!");
                }
                setLoading(false);
                // toast.error(error.message);
                console.log(error.message);
            }
        }

    };



    // const sendVerificationEmail = async (email) => {
    //     try {
    //         const response = await axios.post("/api/send-verification", { email });
    //         return { success: true, message: response.data.message }; // Return success message
    //     } catch (error) {
    //         console.error("Error sending email:", error);
    //         return { success: false, message: error.response?.data?.error || "Failed to send email" }; // Return error message
    //     }
    // };


    return (

        <>
            <Header isTrialPage={signUp} setSignUp={setSignUp} />
            <Container className="d-flex justify-content-center align-items-center login-container">
                <Card className="login-card">
                    {
                        signUp ? <h2 className="text-center mb-4">Create your account now</h2> :
                            <h2 className="text-center mb-4">Login</h2>
                    }
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <div className="password-box">
                                <Form.Control
                                    type={showPass ? "text" : "Password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <Form.Control.Feedback type="invalid">Password must be at least 6 characters.</Form.Control.Feedback>
                                {showPass !== "" ? <FontAwesomeIcon
                                    onClick={() => setShowPass(!showPass)}
                                    cursor={"pointer"}
                                    icon={showPass ? faEye : faEyeSlash}
                                    color="grey"
                                    className="eyes"
                                /> : <></>}
                            </div>
                        </Form.Group>


                        <Button variant="primary" type="submit" className="w-100 login-btn">{!loading & !signUp ? "LOG IN" : !loading & signUp ? "Click Here" : "PLEASE WAIT..."}</Button>



                    </Form>

                    <div className="text-center d-flex justify-content-between align-items-center my-3">
                        <div className="line"></div> <span>or</span>  <div className="line"></div>
                    </div>


                    <Button variant="outline-dark" className="w-100" onClick={() => handleGoogleLogin()}>Login with Google</Button>

                    <div className="text-center mt-3">
                        {
                            !signUp ? <> <Link href={"/Pages/Password-reset"}>Forgot password?</Link>    <br /></> : <></>
                        }
                        <span>
                            {
                                !signUp ? <>Don't have an account? <a href="#" onClick={() => setSignUp(!signUp)} >Create one for free!</a></> : <>Already have an account? <a href="#" onClick={() => setSignUp(!signUp)} >Click here to log in!</a>
                                </>
                            }
                        </span>
                    </div>
                </Card>
            </Container>
        </>



    );
}
