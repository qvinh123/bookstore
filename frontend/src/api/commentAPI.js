import http from "./index"

export const addComment = (dataComment) => http.post("/api/v1/product/review", dataComment)
export const deleteComment = (reviewId) => http.delete(`/api/v1/product/review/${reviewId}`)
export const updateComment = (reviewId, dataUpdate) => http.patch(`/api/v1/product/review/${reviewId}`, dataUpdate)