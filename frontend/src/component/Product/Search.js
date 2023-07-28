// import React, { useState, Fragment } from "react";
// import MetaData from "../layout/MetaData";
// // import { useHistory } from "react-router-dom";  // to red histry
// import "./Search.css";

// const Search = ({history}) => {
//   const [keyword, setKeyword] = useState("");
// //   const history = useHistory(); // Use the useHistory hook to access the history object
//   const searchSubmitHandler = (e) => {
//     e.preventDefault(); // form sublmit krne pr reload nhi hoga
    
//     if (keyword.trim()) {
//       history.push(`/products/${keyword}`);
//     } else {
//       history.push("/products");
//     }
//   };

//   return (
//     <Fragment>
//       <MetaData title="Search A Product -- ECOMMERCE" />
//       <form className="searchBox" onSubmit={searchSubmitHandler}>
//         <input
//           type="text"
//           placeholder="Search a Product ..."
//           onChange={(e) => setKeyword(e.target.value)}
//         />
//         <input type="submit" value="Search" />
//       </form>
//     </Fragment>
//   );
// };
// export default Search;

import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate(); // use the useNavigate hook to get the navigate function

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); // use navigate function to navigate to the desired route
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
