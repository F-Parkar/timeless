import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    // method:'GET' is default, so it's optional for queries
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ( {keyword, pageNumber} ) => ({
                url: PRODUCTS_URL,
                params: { keyword ,pageNumber }, // pass the page number as a query parameter
            }),
            providesTags: ['Products'], // this is used to invalidate the cache for the product list, so we have fresh data
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: () => ({ //no need to pass any data we loading the sample data
                url: PRODUCTS_URL,
                method: 'POST',
            }),
            //invalidates the cache for the product list, so we have fresh data, so we dont have refresh the page
            invalidatesTags: ['Products'], 
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'], // this is used to invalidate the cache for the product list, so we have fresh data
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'], 
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'], // this is used to invalidate the cache for the product list, so we have fresh data  
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'], // this is used to invalidate the cache for the product list, so we have fresh data
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5
        }),
    }),
});

export const { 
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,

} = productsApiSlice;