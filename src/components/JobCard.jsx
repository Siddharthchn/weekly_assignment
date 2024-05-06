import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJob } from "../store/jobSlicer";
import "./JobCard.css";
import { IoIosFlash } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

const JobCard = () => {
  const dispatch = useDispatch();
  const { isLoading, data, error, totalCount } = useSelector(
    (state) => state.job
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialLoadCount, setInitialLoadCount] = useState(12);
  const modalRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    dispatch(fetchJob());
  }, [dispatch]);

  // Load more job cards when user scrolls to the bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        !isFetching &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight * 0.9
      ) {
        setIsFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]); // Only trigger when the fetching state changes

  useEffect(() => {
    if (!isFetching) return;

    if (data.length < totalCount) {
      setTimeout(() => {
        loadMoreJobs();
      }, 1000); // Simulating delay
    } else {
      setIsFetching(false);
    }
  }, [isFetching, data, totalCount]);

  const loadMoreJobs = () => {
    const newLoadCount = initialLoadCount + 12;
    setInitialLoadCount(newLoadCount > totalCount ? totalCount : newLoadCount);
    setIsFetching(false); // Reset isFetching to allow for subsequent loads
  };

  const handleShowMore = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  return (
    <>
         <div class="filters">
  <div>
    <label for="input1">Min Experience :</label>
    <input type="text" id="input1" />
  </div>
  <div>
    <label for="input2">Min Base Pay :</label>
    <input type="text" id="input2" />
  </div>
  <div>
    <label for="input3">Company Name :</label>
    <input type="text" id="input3" />
  </div>
  <div>
    <label for="input4">Location :</label>
    <input type="text" id="input4" />
  </div>
  <div>
    <label for="input5">Role :</label>
    <input type="text" id="input5" />
  </div>
  <div>
    <CiSearch style={{fontSize: '25px', marginTop: '13px'}}/>
  </div>
</div>

      <div className="job-container">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data &&
          data.slice(0, initialLoadCount).map((job) => (
            <div
              key={job.jdUid}
              className="job-card"
              style={{ maxHeight: "450px" }}
            >
              <div className="job-wrapper">
                <img
                  className="job-image"
                  src={job.logoUrl}
                  alt={job.companyName}
                />
                <div className="job-wrap">
                  <p className="job-title">{job.companyName}</p>
                  <p className="job-role">{job.jobRole} Developer</p>
                  {job.minJdSalary !== null &&
                  job.maxJdSalary !== null &&
                  job.salaryCurrencyCode ? (
                    <p className="job-salary">
                      Salary: {job.minJdSalary} - {job.maxJdSalary}{" "}
                      {job.salaryCurrencyCode}
                    </p>
                  ) : (
                    <p className="job-salary">Salary: 20 - 26 USD</p>
                  )}
                </div>
              </div>
              {job.location && (
                <p className="job-location">Location: {job.location}</p>
              )}
              {job.maxExp ? (
                <p className="job-experience">
                  Max Experience: {job.maxExp} years
                </p>
              ) : (
                <p className="job-experience">Max Experience: 3 years</p>
              )}
              <div className="job-details-container">
                <p className="job-details-text1">About Company:</p>
                <div className="job-details-content">
                  <p className="job-details-text2">{job.jobDetailsFromCompany}</p>
                  <button
                    className="show-more-button"
                    onClick={() => handleShowMore(job)}
                  >
                    Show More <FaPlus style={{marginLeft: '10px'}}/>
                  </button>
                </div>
              </div>

              {job.jdLink && (
                <button className="job-button">
                  <IoIosFlash style={{ color: "#FFEA00" }} /> Easy Apply:{" "}
                  <a
                    href={job.jdLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  ></a>
                </button>
              )}
            </div>
          ))}
        {isFetching && <p className="loading">Loading more jobs...</p>}
        {showModal && (
          <div className="modal" onClick={handleModalClick}>
            <div className="modal-content" ref={modalRef}>
              <span className="close-button" onClick={closeModal}>
                ×
              </span>
              <h2 className="selected-job">{selectedJob.companyName}</h2>
              <p>{selectedJob.jobDetailsFromCompany}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobCard;
