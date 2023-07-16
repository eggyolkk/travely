import { motion } from "framer-motion"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface InitialiseUserProps {
    user: {name: string | undefined, email: string | undefined, trips: []},
    setUser: React.Dispatch<React.SetStateAction<{name: string | undefined, email: string | undefined, trips: []}>>,
    setShowInitialiseUser: React.Dispatch<React.SetStateAction<boolean>>
}

const InitialiseUser = (props: InitialiseUserProps) => {
    const { user, setUser, setShowInitialiseUser } = props;

    const supabase = createClientComponentClient();
    
    const [error, setError] = useState('');

    const handleConfirmName = async() => {
        if (user.name?.length) {
            const { data, error } = await supabase
                .from('users')
                .insert([
                { email: user.email, name: user.name },
                ])
                .select();
            
            setShowInitialiseUser(false);
        } 
        else {
            setError('Please enter a name');
        }
    }

    return (
        <motion.div 
            className='initialise-user-wrapper'
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ ease: "easeOut", duration: 1 }}
        >
            <h1>Hello, what is your name?</h1>
            
            <form onSubmit={handleConfirmName}>
                <input className='name-input' value={user.name} onChange={({ target }) => setUser({ ...user, name: target.value })}/>
                <span className='error'>{error}</span>

                <button className='finish-initialise-btn' type='submit'>
                    <ArrowForwardIcon />
                </button>
            </form>
        </motion.div>
    )
}

export default InitialiseUser;