"use client";

import { getAuth, onAuthStateChanged } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user || !user.emailVerified) {
                router.push("/"); // Redirects to login if not verified
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>💳 Payment Page</h1>
            <p>Only verified users can access this page.</p>
            <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
                Proceed to Payment
            </button>
        </div>
    );
}
