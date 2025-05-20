import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice'; //think of like parent

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({ //Because login sends a POST request to the server with a username and password to authenticate the user
            query: (data) => ({ //because POST we SENDING DATA
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        profile: builder.mutation({ //update user profile
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
                method: 'GET',
            }),
            providesTags: ['Users'], //might have to reload after deleting a user or updating a user
            keepUnusedDataFor: 5, //keep the data for 5 seconds after the component unmounts
        }),
        getUserDetails: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 5, //keep the data for 5 seconds after the component unmounts
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'], //might have to reload after deleting a user or updating a user
        }),
    }),
});

export const { useLoginMutation, 
               useRegisterMutation , 
               useLogoutMutation, 
               useProfileMutation, 
               useGetUsersQuery,
               useGetUserDetailsQuery,
               useDeleteUserMutation,
               useUpdateUserMutation  } = usersApiSlice;