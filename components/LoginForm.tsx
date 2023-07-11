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

        if (signInData.user) {
            Router.replace('/home');
        }
        
        if (error) {
            console.log(error.message);
            setLoginError(error.message);
        }
    };

    return (
        <div className="authentication-form">
            <form onSubmit={handleSubmit(formSubmit)}>
                <label htmlFor="email" className='label'>Email address</label>
                <input 
                    className='input'
                    type='email' 
                    placeholder='user@example.com'
                    {...register("email", { required: true })}

                />
                {errors.email && <p className="field-error">Email address is required.</p>}


                <label htmlFor="email" className='label'>Password</label>
                <input 
                    className='input'
                    type='password' 
                    placeholder='********'
                    {...register("password", { required: true })}
                />
                {errors.password && <p className="field-error">Password is required.</p>}

                <span className='login-error'>{loginError}</span>

                <input className="submit-btn" type="submit" value="Log in" />
                <button className='switch-method-btn' onClick={() => setShowLogin(false)}>
                    Don't have an account? Click here to sign up
                </button>
            </form>
        </div>
    )
}

export default LoginForm;