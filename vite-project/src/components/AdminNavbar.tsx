import dashboardIcon from "../../public/DashboardIcon.png";
import patientIcon from "../../public/FriendIcon.png";
import appointment from "../../public/Appointment.png";
import doctor from "../../public/DoctorIcon.png";
import messageIcon from "../../public/messageIcon.png";
import logoutIcon from "../../public/logout.png"

import { useState } from 'react';

const AdminNavbar = () => {
    const [activeItem, setActiveItem] = useState('Dashboard');  //State to manage blue transitions in left of List items
    
    const handleItemClick = (item: string) => {     //Function to set blue border transitions on the left of List Items
        setActiveItem(item);
    };

    return (
        <div id="AdminNavbar" className='text-gray-400 w-[100%] h-screen bg-blue-100'>
            <nav className="flex flex-col justify-center gap-4 items-center">
                <h1>Logo Here</h1>
                <ul className="my-5 flex flex-col gap-7 w-[100%] mt-20  ">
                    <li
                        className={`w-[100%] flex  justify-start pl-28 gap-4 items-center py-4 ${activeItem === 'Dashboard' ? 'border-blue-600 border-l-8 text-blue-600 bg-blue-200' : ''} transition-all duration-800`}
                        onClick={() => handleItemClick('Dashboard')}
                    >
                        <img className="h-[35px]" src={dashboardIcon} alt="Dashboard Icon" />
                        <span className="text-xl">Dashboard</span>
                    </li>
                    <li
                        className={`w-[100%] py-4 flex justify-start gap-4 pl-28  items-center ${activeItem === 'Patients' ? 'border-blue-600 border-l-8 text-blue-600  bg-blue-200' : ''} transition-all duration-800`}
                        onClick={() => handleItemClick('Patients')}
                    >
                        <img className="h-[30px]" src={patientIcon} alt="Patient Icon" />
                        <span className="text-xl">Patients</span>
                    </li>
                    <li
                        className={`w-[100%] flex  justify-start pl-28 gap-4 items-center py-4 ${activeItem === 'Appointments' ? 'border-blue-600 border-l-8 text-blue-600  bg-blue-200' : ''} transition-all duration-800`}
                        onClick={() => handleItemClick('Appointments')}
                    >
                        <img className="h-[30px]" src={appointment} alt="Appointments Icon" />
                        <span className="text-xl">Appointments</span>
                    </li>
                    <li
                        className={`w-[100%] flex  justify-start pl-28 gap-4 items-center py-4 ${activeItem === 'Doctors' ? 'border-blue-600 border-l-8 text-blue-600 bg-blue-200' : ''} transition-all duration-800`}
                        onClick={() => handleItemClick('Doctors')}
                    >
                        <img className="h-[30px]" src={doctor} alt="Doctors Icon" />
                        <span className="text-xl">Doctors</span>
                    </li>
                    <li
                        className={`w-[100%] flex  justify-start pl-28 gap-4 items-center py-4 ${activeItem === 'Messages' ? 'border-blue-600 border-l-8 text-blue-600  bg-blue-200' : ''} transition-all duration-800`}
                        onClick={() => handleItemClick('Messages')}
                    >
                        <img className="h-[30px]" src={messageIcon} alt="Messages Icon" />
                        <span className="text-xl">Messages</span>
                    </li>
                    <li
                        className="w-[100%] flex justify-center mt-60 gap-4 items-center py-4 "
                        onClick={() => handleItemClick('Logout')}
                    >
                        <img className="h-[30px]" src={logoutIcon} alt="Logout Icon" />
                        <span className="text-xl">Logout</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminNavbar;
