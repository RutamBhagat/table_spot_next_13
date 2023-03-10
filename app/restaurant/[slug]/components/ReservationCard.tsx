"use client";
import React, { useState } from "react";
import { partySize, times } from "@/data";
import shortid from "shortid";
import DatePicker from "react-datepicker";

const ReservationCard = ({ open_time, close_time }: { open_time: string; close_time: string }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  let isWithinTimeWindow = false;
  const timesInWindow = times.filter((time) => {
    if (time.time === open_time) {
      isWithinTimeWindow = true;
    } else if (time.time === close_time) {
      isWithinTimeWindow = false;
    }
    return isWithinTimeWindow;
  });

  const dateChangeHandler = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      return;
    }
    setSelectedDate(null);
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light" id="">
          {partySize.map((size) => (
            <option key={shortid.generate()} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={dateChangeHandler}
            dateFormat="MMMM d"
            className="py-3 border-b font-light text-reg w-full"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select name="" id="" className="py-3 border-b font-light">
            {timesInWindow.map((time) => (
              <option key={shortid.generate()} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button className="bg-red-600 rounded w-full px-4 text-white font-bold h-16">Find a Time</button>
      </div>
    </div>
  );
};

export default ReservationCard;
