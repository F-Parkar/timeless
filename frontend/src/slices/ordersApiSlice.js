import { ORDERS_URL, PAYPAL_URL } from '../constants';
import { apiSlice } from './apiSlice'; //think of like parent

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: `${ORDERS_URL}`,
                method: 'POST',
                body: order,
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5, //keep data for 5 seconds
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details },
            }),
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
                method: 'GET',
            }),
            keepUnusedDataFor: 5, //keep data for 5 seconds
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5, //keep data for 5 seconds
        }),
        getOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5, //keep data for 5 seconds
        }),
        
    }),
});

export const { 
    useCreateOrderMutation, 
    useGetOrderDetailsQuery, 
    usePayOrderMutation, 
    useGetPaypalClientIdQuery, 
    useDeliverOrderMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
} = orderApiSlice;