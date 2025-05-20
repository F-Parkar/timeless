import { apiSlice } from './apiSlice';

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query({
      query: (period = '30d') => `/api/reviews?period=${period}`,
    }),
  }),
});

export const { useGetReportQuery } = reportApiSlice;
