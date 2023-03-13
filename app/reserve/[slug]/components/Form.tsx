"use client";
import useReservation from "@/hooks/useReservation";
import React, { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

const defaultFormFields = {
  bookerFirstName: "",
  bookerLastName: "",
  bookerPhone: "",
  bookerEmail: "",
  bookerOccasion: "",
  bookerRequest: "",
};

const Form = () => {
  const [input, setInput] = useState(defaultFormFields);
  const [isDisabled, setIsDisabled] = useState(true);
  const { loading, error, createReservation } = useReservation();

  useEffect(() => {
    if (input.bookerFirstName && input.bookerLastName && input.bookerPhone && input.bookerEmail) {
      setIsDisabled(false);
      return;
    }
    setIsDisabled(true);
  }, [input]);

  const resetFormFields = () => {
    setInput(defaultFormFields);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createReservation(input)
    resetFormFields();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-wrap justify-between w-[660px]">
      <input
        onChange={handleChange}
        name="bookerFirstName"
        value={input.bookerFirstName}
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="First name"
      />
      <input
        onChange={handleChange}
        name="bookerLastName"
        value={input.bookerLastName}
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Last name"
      />
      <input
        onChange={handleChange}
        name="bookerPhone"
        value={input.bookerPhone}
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Phone number"
      />
      <input
        onChange={handleChange}
        name="bookerEmail"
        value={input.bookerEmail}
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Email"
      />
      <input
        onChange={handleChange}
        name="bookerOccasion"
        value={input.bookerOccasion}
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Occasion (optional)"
      />
      <input
        onChange={handleChange}
        name="bookerRequest"
        value={input.bookerRequest}
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Requests (optional)"
      />
      <button disabled={isDisabled} className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300">
        Complete reservation
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of Use and Privacy Policy. Standard text
        message rates may apply. You may opt out of receiving text messages at any time.
      </p>
    </form>
  );
};

export default Form;
