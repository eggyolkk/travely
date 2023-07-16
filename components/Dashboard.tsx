import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Router from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ActiveTripsCard from "./common/ActiveTripsCard";
import moment from "moment";

interface DashboardProps {
    user: {name: string | undefined, email: string | undefined, trips: []}
}

const Dashboard = (props: DashboardProps) => {
    const { user } = props;

    const [showTrips, setShowTrips] = useState(true);
    const [userTrips, setUserTrips] = useState<{ active?: any[]; upcoming?: any[]; past?: any[] | undefined; }>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClientComponentClient();

        const getTrips = async() => {
            let { data: trips, error } = await supabase
            .from('trips')
            .select('*')
            .eq('user_id', window.sessionStorage.userid);

            // If user doesn't have any trips added, show placeholder text
            // Else show trips
            if (!trips || !trips.length) {
                setShowTrips(false);
            }
            else {
                const getDates = (from: string, to: string) => {
                    const today = new Date();
                    const fromDate = new Date(moment(from).format());
                    const toDate = new Date(moment(to).format());

                    return {today, fromDate, toDate};
                }

                // Set active trips
                const activeTrips = trips.filter((trip) => {
                    const {today, fromDate, toDate} = getDates(trip.from_date, trip.to_date);

                    if (fromDate <= today && toDate >= today) {
                        return trip;
                    }
                })

                // Set upcoming trips
                const upcomingTrips = trips.filter((trip) => {
                    const {today, fromDate, toDate} = getDates(trip.from_date, trip.to_date);

                    if (fromDate > today && toDate > today) {
                        return trip;
                    }
                })

                // Set past trips
                const pastTrips = trips.filter((trip) => {
                    const {today, fromDate, toDate} = getDates(trip.from_date, trip.to_date);

                    if (fromDate < today && toDate < today) {
                        return trip;
                    }
                })

                setUserTrips({active: activeTrips, upcoming: upcomingTrips, past: pastTrips});
                setShowTrips(true);
            }
        }

        getTrips();
    }, [user])

    return (
        <motion.div 
            className='main-content-wrapper'
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ ease: "easeOut", duration: 0.5 }}
        >
            <div className='dashboard-wrapper'>
                <div className='title-container'>
                    <h1>My trips</h1>
                    <button title="Add trip" onClick={() => Router.push('/home/create')}>
                        <AddIcon />
                    </button>
                </div>

                {showTrips ? 
                    <>
                        <p className='welcome-text'>Welcome back, {user.name} </p>
                        <h2 className='active'>Active trips</h2>
                        
                        {userTrips?.active ? 
                            userTrips.active.map((trip, i) => {
                                return (
                                    <ActiveTripsCard destination={trip.destination} fromDate={trip.from_date} toDate={trip.to_date} key={i} />
                                )
                            }) : null
                        }

                        <h2 className='active'>Upcoming trips</h2>
                        {userTrips?.upcoming ? 
                            userTrips.upcoming.map((trip, i) => {
                                return (
                                    <ActiveTripsCard destination={trip.destination} fromDate={trip.from_date} toDate={trip.to_date} key={i} />
                                )
                            }) : null
                        }

                        <h2 className='active'>Past trips</h2>
                        {userTrips?.past ? 
                            userTrips.past.map((trip, i) => {
                                return (
                                    <ActiveTripsCard destination={trip.destination} fromDate={trip.from_date} toDate={trip.to_date} key={i} />
                                )
                            }) : null
                        }
                    </>
                :
                    <>
                        <p className='welcome-text'>Welcome, {user.name} </p>
                        <p className='no-trips-message'>You don't have any trips.</p>
                    </>
                }
            </div>
        </motion.div>
    )
}

export default Dashboard;