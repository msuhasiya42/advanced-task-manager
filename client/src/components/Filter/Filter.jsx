import React from "react";
import { tags, members } from "../../utils/data/static";
const Filter = () => {
  return (
    <details className="dropdown ">
      <summary className="m-1 btn btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
          />
        </svg>
        Filter
      </summary>
      <ul className="p-1 flex text-white shadow menu dropdown-content z-[1] bg-purple-800 rounded-box w-88">
        <div className="form-control flex flex-row text-xs">
          <div className="ml-2">
            <label className="cursor-pointer label text-gray-400" htmlFor="">
              Due Date
            </label>

            <label className="cursor-pointer label">
              <input type="checkbox" className="checkbox" />

              <span className=" text-white label-text">
                {/* <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 ml-1 text-white "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg> */}
                No Dates
              </span>
            </label>

            <label className="cursor-pointer label">
              <input type="checkbox" className="checkbox" />

              <span className="ml-4 text-white label-text">
                {/* <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 ml-1 text-green-500 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg> */}
                tommorrow
              </span>
            </label>

            <label className="cursor-pointer label">
              <input type="checkbox" className="checkbox" />

              <span className=" text-white label-text">
                {/* <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 ml-1 text-red-500 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg> */}
                Overdue
              </span>
            </label>
          </div>

          {/* members  */}
          <div className="ml-3">
            <label className="cursor-pointer label text-gray-400" htmlFor="">
              Members
            </label>
            {members.map((member, index) => (
              <label key={index} className="cursor-pointer label">
                <input type="checkbox" className="checkbox checkbox-info" />
                <span className="ml-4 text-white label-text">{member}</span>
              </label>
            ))}
          </div>

          {/* tags */}
          <div className="ml-8 mr-2">
            <label className="cursor-pointer label text-gray-400" htmlFor="">
              Tags
            </label>
            {tags.map((tag, index) => (
              <label key={index} className="cursor-pointer label">
                <input type="checkbox" className="checkbox" />
                <span className="ml-4 text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </ul>
    </details>
  );
};

export default Filter;
