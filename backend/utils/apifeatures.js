class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
    //  search filter
    search() {
        const keyword = this.queryStr.keyword
          ? {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i",  // case insensitive
              },
            }
          : {};
            // console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr };
        //   Removing some fields for category
        // console.log("before",queryCopy)
        const removeFields = ["keyword", "page", "limit"];
    
        removeFields.forEach((key) => delete queryCopy[key]);
        // console.log("after",queryCopy)

        // Filter For Price and Rating
    
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    
        this.query = this.query.find(JSON.parse(queryStr));
    
        return this;
    }
    // pagination 
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        console.log("(",currentPage,",",skip,")")
    
        this.query = this.query.limit(resultPerPage).skip(skip);
    
        return this;
      }
}

module.exports=ApiFeatures  