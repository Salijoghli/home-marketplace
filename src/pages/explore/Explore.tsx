import { Link } from "react-router-dom";
import rentCategoryImg from "../../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImg from "../../assets/jpg/sellCategoryImage.jpg";

const Explore = () => {
  return (
    <div className="explore">
      <header>
        <p className="header">explore</p>
      </header>
      <main>
        {/* //todo slider */}
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <img
              className="exploreCategoryImg"
              src={rentCategoryImg}
              alt="rent img"
            />
            <p className="exploreCategoryName">Place for rent</p>
          </Link>
          <Link to="/category/sale">
            <img
              className="exploreCategoryImg"
              src={sellCategoryImg}
              alt="sale img"
            />
            <p className="exploreCategoryName">Place for sell</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explore;
