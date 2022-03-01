import http from "./index"

export const getWishlist = () => http.get("/api/v1/wishlists")

export const addWishlist = (dataWishlist) => http.post("/api/v1/wishlist/new", dataWishlist)

export const deleteWishlist = (productId) => http.delete(`/api/v1/wishlists/${productId}`)

export const deleteAllWishlist = () => http.delete("/api/v1/deleteAllWishlist")