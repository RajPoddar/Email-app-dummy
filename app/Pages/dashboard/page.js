"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect, } from 'react';

import { getAuth, onAuthStateChanged } from '@/app/firebaseConfig';

// AuthProvider
import {AuthProvider, useAuth } from '@/app/context/AuthContext';




export default function Dashboard() {

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/');
                setLoading(false);
            }
            else {
                setLoading(false);
            }
        });
        return () => unsubscribe();

    }, [router]);
    
    


    return (


        <>

            {loading ? <p>Loading...</p> : <><h4>Dashboard Page</h4></>}
        </>

    );
}
