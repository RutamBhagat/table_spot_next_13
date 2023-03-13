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

const Form = ({ slug, date, partySize }: { slug: string; date: string; partySize: string }) => {
  const [input, setInput] = useState(defaultFormFields);
  const [isDisabled, setIsDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);
  const [day, time] = date.split("T");
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
    const booking = await createReservation({ ...input, slug, partySize, time, day, setDidBook });
    resetFormFields();
  };

  return (
    <>
      {didBook ? (
        <div>
          <h1>You are all booked up</h1>
          <p>Enjoy your reservation</p>
        </div>
      ) : (
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
          <button
            type="submit"
            disabled={isDisabled || loading}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
          >
            {loading ? (
              <div className="flex justify-center items-center" role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Complete reservation"
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms of Use and Privacy Policy. Standard text
            message rates may apply. You may opt out of receiving text messages at any time.
          </p>
        </form>
      )}
    </>
  );
};

export default Form;
