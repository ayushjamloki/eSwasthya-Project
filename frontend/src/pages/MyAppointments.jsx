import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ChatBox from '../components/ChatBox'; // Adjust the path if needed





const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [activeChat, setActiveChat] = useState(null);

    const [reviewData, setReviewData] = useState({});


    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    const handleReviewChange = (id, field, value) => {
    setReviewData(prev => ({
        ...prev,
        [id]: {
            ...prev[id],
            [field]: value
        }
    }));
};

const submitReview = async (appointmentId, doctorId) => {
    const review = reviewData[appointmentId];
    if (!review || !review.rating || !review.comment) {
        toast.error("Please fill out both fields");
        return;
    }

    try {
        const res = await axios.post(backendUrl + '/api/reviews', {
            doctorId,
            rating: review.rating,
            comment: review.comment
        }, { headers: { token } });

        // if (res.data.success) {
        //     toast.success("Review submitted!");
        //     setReviewData(prev => ({
        //         ...prev,
        //         [appointmentId]: { ...prev[appointmentId], submitted: true }
        //     }));
        // } else {
        //     toast.error("Failed to submit review");
        // }
        if (res.status === 200 || res.status === 201) {
    toast.success("Review submitted!");
    setReviewData(prev => ({
        ...prev,
        [appointmentId]: { ...prev[appointmentId], submitted: true }
    }));
} else {
    toast.error("Failed to submit review");
}

    } catch (err) {
        console.error(err);
        toast.error("Error submitting review");
    }
};




    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p className=''>{item.docData.address.line1}</p>
                            <p className=''>{item.docData.address.line2}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
                            {/* {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>} */}
                            {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>Paid</button>}

                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}


                            {item.isCompleted && (
    <div className="mt-4">
        <h4 className="text-sm font-semibold">Leave a Review:</h4>
        {reviewData[item._id]?.submitted ? (
            <p className="text-green-600 text-sm">✅ Review submitted</p>
        ) : (
            <div className="flex flex-col gap-2 mt-2">
                <select
                    value={reviewData[item._id]?.rating || ''}
                    onChange={(e) => handleReviewChange(item._id, 'rating', e.target.value)}
                    className="border p-1 rounded"
                >
                    <option value="">Select Rating</option>
                    {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Write your comment..."
                    value={reviewData[item._id]?.comment || ''}
                    onChange={(e) => handleReviewChange(item._id, 'comment', e.target.value)}
                    className="border p-2 rounded"
                    rows={3}
                />
                <button
                    onClick={() => submitReview(item._id, item.docData._id)}
                    className="self-start px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all text-sm"
                >
                    Submit Review
                </button>
            </div>
        )}
    </div>
)}




                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}

                            
                            {/* Add Start Chat Button */}
                            {item.payment && !item.cancelled && !item.isCompleted && (
                                <button
                                    onClick={() => setActiveChat(activeChat === item._id ? null : item._id)}  // Toggle the chat window
                                    className="sm:min-w-48 py-2 border rounded text-blue-600 hover:bg-blue-100 transition-all duration-300"
                                >
                                    {activeChat === item._id ? 'Close Chat' : 'Start Chat'}
                                </button>
                            )}
                            {/* Display the ChatBox */}
                            {activeChat === item._id && (
                                <div className="col-span-2 sm:col-span-full mt-4">
                                    <ChatBox appointmentId={item._id} sender="Patient" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments