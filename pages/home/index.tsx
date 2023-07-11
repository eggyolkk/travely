import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import Router from 'next/router';

const Home = () => {
    const supabase = createClientComponentClient();

    const handleSignOut = async() => {
        const { error } = await supabase.auth.signOut();
        console.log("err", error);
        if (!error) {
            Router.replace('/');
        }
      }
    
    useEffect(() => {
        const getSession = async() => {
            const { data, error } = await supabase.auth.getSession();
            console.log(data)
            // Unauthenticated
            if (!data.session) {
                Router.replace('/');
            }
        }

        getSession();
    }, [])

    return (
        <>
            <h1>Authenticated</h1>
            <button onClick={handleSignOut}>Sign out</button>
        </>
    )
}

export default Home;