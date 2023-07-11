import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Router from "next/router";
import { useEffect, useState } from "react";

export const LandingPage = () => {
    const supabase = createClientComponentClient();
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        // If user is authenticated, redirect to homepage
        const getSession = async() => {
            const { data, error } = await supabase.auth.getSession();

            if (data.session) {
                Router.replace('/home');
            }
        }

        getSession();
    }, []);

    return (
        <div className="landing-page-wrapper">
            <div className="authentication-wrapper">
                <h1 className='logo'>travely</h1>
                <span>Organise your trip in one app</span>

                {showLogin ?
                    <LoginForm setShowLogin={setShowLogin} />
                :
                    <RegisterForm />
                }
            </div>
        </div>
    )
}

export default LandingPage;