"use client"

// Next Router
import { useRouter } from "next/navigation";

// react state
import { useState } from "react";

// header Component
import Header from "@/app/components/Header";

// Firebase config
import { db, doc, app, getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "@/app/firebaseConfig";

// Firebase Store
import { collection, query, where, getDocs } from "firebase/firestore";

// Bootstrap
import { Button, Form, Container, Card } from "react-bootstrap";

//react-Toast 
import { toast } from "react-toastify";

export default function PasswordReset() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        if (loading) {
            return;
        }
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        setError("");
        const auth = getAuth(app);

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            setLoading(false);
            return;
        }



        try {

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setLoading(false);
                toast.warn("Email does not exist!");
                return;
            }


            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset link sent! Check your email.");
            setEmail("");
            setLoading(false);
            router.push("/");
            // setTimeout(() => router.push("/"), 3000); // Redirect after 3 seconds
        } catch (error) {
            console.error("Error sending reset email:", error.message);
            toast.error("Failed to send reset email.");
            setLoading(false);
        }


    };

    return (
        <>
            <Header isTrialPage={true} />
            <Container className="d-flex justify-content-center align-items-center login-container">
                <Card className="login-card">
                    {
                        <h2 className="text-center mb-4">Forgot Password ?</h2>

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




                        <Button variant="primary" type="submit" className="w-100 login-btn">{!loading ? "RESET NOW" : "PLEASE WAIT..."}</Button>
                    </Form>

                </Card>
            </Container>
        </>
    )
}