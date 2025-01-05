import React, { useContext, useEffect, useState } from 'react';
import { slotbookingService } from '../../lib/api/slotbooking';
import moment from 'moment';


interface Slot {
  datetime: Date;
  time: string;
}

const Appointments = (props: any) => {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC" ];
  // State types

  const [docSlots, setDocSlots] = useState<Slot[][]>([]);
  const [slotIndex, setSlotIndex] = useState<number>(0);
  const [slotTime, setSlotTime] = useState<string>('');
  const [isLoader, setIsLoader] = useState(true);

  // Function to get available time slots for the doctor
  const getAvailableSlots = async () => {
    setDocSlots([]);
    try {
      const { data } = await slotbookingService.getSlotsByDate();
      if (data != undefined) {
        setIsLoader(false);
        // Accessing specific date data, for example "2024-12-31"
        for (const slotdate in data) {
          let timeSlots: Slot[] = [];
          if (data.hasOwnProperty(slotdate)) {
  //          console.log(`Date: ${slotdate}`);
            const dbtimeSlots = data[slotdate];

            let s_time="";
            let s_cnt=0;
            // Looping through the time slots for each date
            for (const slot in dbtimeSlots) {
              
              if (dbtimeSlots.hasOwnProperty(slot)) {
//                console.log(`Slot ${slot}: ${dbtimeSlots[slot]}`);
                s_cnt=dbtimeSlots[slot];
                s_time=slot;
              }
              if(s_cnt>0)
                timeSlots.push({
                  datetime: new Date(slotdate),
                  time: s_time,

                });
            }
            setDocSlots((prev) => [...prev, timeSlots]);  
          }
        }
      } else {
        for (let i = 0; i < 10; i++) {
          let today = new Date();
          today.setDate(today.getDate() + 3);
          let fromDate = new Date();
          fromDate.setDate(fromDate.getDate() + 3);
          let toDate = new Date();
          toDate.setDate(toDate.getDate() + 13);
          let currentDate = new Date(today);
          currentDate.setDate(today.getDate() + i);

          let endTime = new Date();
          endTime.setDate(today.getDate() + i);
          endTime.setHours(21, 0, 0, 0);

          if (today.getDate() === currentDate.getDate()) {
            currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
            currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
          } else {
            currentDate.setHours(10);
            currentDate.setMinutes(0);
          }

          let timeSlots: Slot[] = [];

          //while (currentDate < endTime) {
          let formattedTime1 = "11:00";
          let formattedTime2 = "12:30";
          let formattedTime3 = "2:30";

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime1,
          });

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime2,
          });
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime3,
          });

          currentDate.setMinutes(currentDate.getMinutes() + 90);
          //}

          setDocSlots((prev) => [...prev, timeSlots]);
        }
      }

    } catch (err) {
      console.log('error getAvailableSlots', err);
      setIsLoader(false);
    }finally{
      setIsLoader(false);
    }



  };

  // Function to handle booking the appointment
  const bookAppointment = async () => {
    const date = docSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = `${day}_${month}_${year}`;
    console.log(slotDate, slotTime);
  };
  const options = {  month: 'long' };
  useEffect(() => {
    getAvailableSlots();
  }, []);

  return (
    <>
       {isLoader ? (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-success mt-5" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div className='text-danger fs-11'>
                                please do not press back button or refresh
                                </div>
                               
                            </div>
                        ) :
      <div>
        {/* Date Selector */}
        <div className="mx-auto text-center border border-dark rounded-5" style={{ width: "900px", fontWeight: "600" }}>
          <span className="text-primary">Select a Slot for Verification of documents</span>
          <div className="d-flex gap-2   overflow-auto  p-4" style={{ marginLeft: "50px" }}>
            {docSlots.length>0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`pl-3  text-center py-3 px-3 rounded-5 border border-primary cursor-pointer ${slotIndex === index ? 'bg-slot text-white ' : 'border  text-dark border-dark'}`}
                >
                  <p>{item[0] && monthNames[item[0].datetime.getMonth()]}</p>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          {/* Time Slot Selector */}

          <div className="d-flex gap-2 align-items-center w-200 p-2" style={{ marginLeft: "100px" }}>
            {docSlots.length>0 &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => {
                    props.method(docSlots[slotIndex][index].datetime, item.time);
                    setSlotTime(item.time);
                  }}
                  key={index}

                  className={`text-sm  px-4 py-2 rounded-4 border border-primary cursor-pointer ${item.time === slotTime ? 'bg-slot  text-dark' : 'text-dark border border-dark'}`}
                >
                  {item.time}hrs
                </p>
              ))}
          </div>
        </div>

        {/* Booking Button 
        <button onClick={bookAppointment} className="btn btn-primary  rounded-fully font-weight-light px-5 py-2  mt-4">
          Book an Appointment
        </button>*/}
      </div>}
    </>
  );
};

export default Appointments;
