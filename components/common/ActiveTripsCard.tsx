import moment from "moment";

interface ActiveTripsCardProps {
    destination: string,
    fromDate: Date,
    toDate: Date,
}

const ActiveTripsCard = (props: ActiveTripsCardProps) => {
    const { destination, fromDate, toDate } = props;

    return (
        <div className='trip-cards-wrapper'>
            <div className='trip-image-wrapper'></div>
            <h1>{destination}</h1>
            <p className='trip-dates'>{moment(fromDate).format('DD MMMM YYYY')} - {moment(toDate).format('DD MMMM YYYY')}</p>
        </div>
    )
}

export default ActiveTripsCard;