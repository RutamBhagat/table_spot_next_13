"use client";
import React from "react";

export default function error({ error }: { error: Error }) {
  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <div role="status">
        <span className="font-semibold text-lg text-gray-700 ">{error.message}</span>
      </div>
    </div>
  );
}
