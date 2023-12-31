import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Router from 'next/router';
import { useState } from "react";

interface LoginFormProps {
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm = (props: LoginFormProps) => {
    const { setShowLogin } = props;

    const supabase = createClientComponentClient();
    const [loginError, setLoginError] = useState('');

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const formData = watch();
    
    const formSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        // If user successfully signs in, redirect to homepage
        if (signInData.user) {
            Router.replace('/home');
        }
        
        if (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div className="authentication-form">
            <h2 className='form-title'>Login</h2>
            <form onSubmit={handleSubmit(formSubmit)}>
            <span className='error'>{loginError ? `Error: ${loginError}` : ''}</span>

                <label htmlFor="email" className='label'>Email address</label>
                <input 
                    className='input'
                    type='email' 
                    placeholder='user@example.com'
                    {...register("email", { required: true })}

                />
                {errors.email && <p className="error">Email address is required.</p>}


                <label htmlFor="email" className='label'>Password</label>
                <input 
                    className='input'
                    type='password' 
                    placeholder='********'
                    {...register("password", { required: true })}
                />
                {errors.password && <p className="error">Password is required.</p>}

                <input className="submit-btn" type="submit" value="Log in" />
                <button className='switch-method-btn' onClick={() => setShowLogin(false)}>
                    Don't have an account? <span>Click here to sign up</span>
                </button>
            </form>
        </div>
    )
}

export default LoginForm;