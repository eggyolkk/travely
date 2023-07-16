import NavBar from "@/components/NavBar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { FieldValues, SubmitHandler, Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import Router from "next/router";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CreateTripPage = () => {
    const supabase = createClientComponentClient();
    
    const {
        control,
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();
    
    const formSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { data: createTripData, error } = await supabase
        .from('trips')
        .insert([
        { 
            user_id: window.sessionStorage.userid,
            destination: data.destination,
            from_date: data.from_date,
            to_date: data.to_date,
        },
        ])
        .select();

        if (createTripData?.length) {
            Router.push('/home');
        }
    };

    return (
        <div className='home-wrapper'>
            <NavBar />
            <motion.div 
                className='main-wrapper-create-trip'
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ ease: "easeOut", duration: 0.5 }}
            >
                <div className='create-trip-wrapper'>
                    <p>Get started by filling in some details.</p>
                    <p>Don’t worry, you can change these anytime.</p>

                    <form onSubmit={handleSubmit(formSubmit)} className='create-trip-form'>
                        <label htmlFor="destination">Where are you going?</label>
                        <input
                            id='destination'
                            type='text'
                            placeholder='e.g. Japan'
                            {...register("destination", { required: true })}
                        />
                        {errors.destination && <p className="error">Destination is required.</p>}

                        <label htmlFor="from_date to_date">When are you going?</label>
                        <Controller
                            control={control}
                            name='from_date'    
                            rules={{
                                required: true,
                              }}
                            render={({ field }) => (
                                <div className='icon-input-wrapper'>
                                    <CalendarMonthIcon />
                                    <DatePicker 
                                        placeholderText='From (dd/mm/yyyy)'
                                        onChange={(date) => field.onChange(date)}
                                        selected={field.value}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                            )}
                        />
                        {errors.from_date && <p className="error">From date is required.</p>}

                        <Controller
                            control={control}
                            name='to_date'    
                            rules={{
                                required: true,
                              }}
                            render={({ field }) => (
                                <div className='icon-input-wrapper'>
                                    <CalendarMonthIcon />
                                    <DatePicker 
                                        placeholderText='To (dd/mm/yyyy)'
                                        onChange={(date) => field.onChange(date)}
                                        selected={field.value}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                            )}
                        />
                        {errors.to_date && <p className="error">To date is required.</p>}

                        <button className='submit-btn'>
                            Create trip
                        </button>
                        <a href='/home' className='cancel-link'>Cancel</a>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default CreateTripPage;