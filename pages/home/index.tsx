import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import Router from 'next/router';
import NavBar from "@/components/NavBar";
import InitialiseUser from "@/components/InitialiseUser";
import Dashboard from "@/components/Dashboard";

const Home = () => {
    const supabase = createClientComponentClient();
    const effectRan = useRef(false);

    const [user, setUser] = useState<{name: string | undefined, email: string | undefined, trips: [] }>({
        name: '',
        email: '',
        trips: []
    })
    const [loading, setLoading] = useState(true);
    const [showInitialiseUser, setShowInitialiseUser] = useState(false);

    // Check if user has been initialised before (i.e. set a name)
    // If so, load dashboard. Otherwise, allow user to set name
    const checkUserInitialised = async (data: User) => {
        let { data: initialisedUsers, error } = await supabase
        .from('users')
        .select('email, name, trips')
        .eq('email', data.email);

        setUser({ ...user, email: data.email })
        setLoading(false);

        if (!initialisedUsers?.length) {
            setShowInitialiseUser(true);
        }
        else {
            setUser({ ...user, name: initialisedUsers[0].name, trips: initialisedUsers[0].trips })
        }
    }

    useEffect(() => {
        const getSession = async() => {
            const { data, error } = await supabase.auth.getSession();

            if (data.session) {
                checkUserInitialised(data.session.user);
                window.sessionStorage.setItem("userid", data.session.user.id);
            }
            else {
                // If unauthenticated, redirect back to login screen
                Router.replace('/');
                window.sessionStorage.removeItem("userid");
            }
        }

        // React strict mode causes useEffect to rerender twice on dev so run only on first render
        if (!effectRan.current) {
            getSession();
        }

        effectRan.current = true; 
    }, [])

    return (
        <div className='home-wrapper'>
            <NavBar />
            {loading ? 
                <h1>Loading</h1>
            :
            showInitialiseUser ? 
                <InitialiseUser user={user} setUser={setUser} setShowInitialiseUser={setShowInitialiseUser} />
            :
                <Dashboard user={user} />
            }
        </div>
    )
}

export default Home;