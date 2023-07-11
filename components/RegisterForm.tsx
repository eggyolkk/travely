import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Router from 'next/router';
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface LoginFormProps {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const RegisterForm = (props: LoginFormProps) => {
    const { setShowLogin } = props;

    const supabase = createClientComponentClient();
    const [signUpError, setSignUpError] = useState('');

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const formData = watch();
    
    const formSubmit: SubmitHandler<FieldValues> = async (data) => {
        const supbase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    
        const {data: signUpData, error} = await supbase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${location.origin}/home`,
            },
        });
    
        if (signUpData.user) {
            const { data: signInData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })
    
            if (signInData.user) {
                Router.replace('/home');
            }
        }

        if (error) {
            setSignUpError(error.message);
        }
    };

    return (
        <div className="authentication-form">
            <h2 className='form-title'>Register</h2>
            <form onSubmit={handleSubmit(formSubmit)}>
                <span className='error'>{signUpError ? `Error: ${signUpError}` : ''}</span>

                <label htmlFor="email" className='label'>Email address</label>
                <input 
                    className='input'
                    type='email' 
                    placeholder='user@example.com'
                    {...register("email", { required: true })}

                />
                {errors.email && <p className="error">Email address is required.</p>}


                <label htmlFor="email" className='label'>Password</label>
                <span className='helper-text'>Must be at least 6 characters long</span>
                <input 
                    className='input'
                    type='password' 
                    placeholder='********'
                    {...register("password", { required: true })}
                />
                {errors.password && <p className="error">Password is required.</p>}

                <input className="submit-btn" type="submit" value="Create account" />
                <button className='switch-method-btn' onClick={() => setShowLogin(true)}>
                    Already have an account? <span>Click here to log in</span>
                </button>
            </form>
        </div>
    )
}

export default RegisterForm;