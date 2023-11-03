import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ContactInfo } from "src/types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_LOCALHOST_URL }),
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    getContacts: builder.query<ContactInfo, void>({
      query: () => "/contacts",
      providesTags: ["Contact"],
    }),
    addContact: builder.mutation<string, ContactInfo>({
      query: (newContact) => ({
        url: "/addContact",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newContact,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

// Copied from RTK docs for typing caught errors
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

export const { useGetContactsQuery, useAddContactMutation } = apiSlice;
