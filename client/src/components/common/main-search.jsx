import React from "react";

const MainSearch = ({
  handleChange,
  value,
  showPostsImages,
  doSubmit,
  resetSearch,
}) => {

  return (
    <div className="block-tabs">
      <form onSubmit={doSubmit} autoComplete="off" noValidate="noValidate">
        <div className="flex p-2">
          {/* <div className="dropdown center">
            <button
              type="button"
              className="btn dropdown-toggle"
              data-toggle="dropdown"
            >
              <i className="fas fa-sort-amount-down" />
            </button>

            <div className="dropdown-menu mt-3">
              <button className="dropdown-item">Most Commented</button>
              <button className="dropdown-item">Most Liked</button>
              <button className="dropdown-item">
                Most Recent
              </button>
            </div>
          </div> */}

          <button type="submit" className="btn">
            <i className="fas fa-search" />
          </button>

          <label htmlFor="search" className="hide-label">
            Search
          </label>
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search... "
            value={value}
            onChange={handleChange}
          />

          <button type="button" className="btn" onClick={() => showPostsImages(false)}>
            <i className="far fa-file-alt" />
          </button>

          <button type="button" className="btn" onClick={() => showPostsImages(true)}>
            <i className="fas fa-images" />
          </button>

          <div className="border-left mx-2"></div>

          <button type="button" className="btn" onClick={resetSearch}>
            <i className="fas fa-redo-alt" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainSearch;
