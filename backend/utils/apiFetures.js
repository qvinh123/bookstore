const APIFeatures = {
    search: (queryStr) => {
        const keyword = queryStr.keyword ? {
            $or: [
                {
                    name: {
                        $regex: queryStr.keyword,
                        $options: "i"
                    }
                },
                {
                    slugName: {
                        $regex: queryStr.keyword.split(" ").join("-"),
                        $options: "i"
                    }
                }
            ]
        } : {}

        return keyword
    },

    filter: (queryStr) => {
        const queryCopy = { ...queryStr }

        const removeFields = ["keyword", "page", "limit","sort"]
        removeFields.forEach(el => delete queryCopy[el])

        let queryString = JSON.stringify(queryCopy)

        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        let a = JSON.parse(queryString)

        if (a.authors) {
            a.authors = { $in: queryCopy.authors }
        }

        if (a.object) {
            a.object = { $in: queryCopy.object }
        }

        return a
    },

    sort: (queryStr) => {
        if (queryStr.sort) {
            return queryStr.sort
        } else {
            return { createdAt: -1 }
        }
    },

    panigation: (queryStr, resultPerPage) => {
        const currentPage = queryStr.page || 1
        const skip = resultPerPage * (currentPage - 1)
        return skip
    },
}

module.exports = APIFeatures