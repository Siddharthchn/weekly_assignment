import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJob } from "../store/jobSlicer";
import "./JobCard.css";
import { IoIosFlash } from "react-icons/io";

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
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
      ) {
        setIsFetching(true);
        setTimeout(() => {
          loadMoreJobs();
        }, 2000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, isFetching]); // Trigger when job data or fetching state changes

  const loadMoreJobs = () => {
    if (data.length < totalCount) {
      const newLoadCount = initialLoadCount + 12;
      setInitialLoadCount(
        newLoadCount > totalCount ? totalCount : newLoadCount
      );
      setIsFetching(true);
      dispatch(fetchJob()).then(() => {
        setIsFetching(false);
      });
    }
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
                  Show More
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
  );
};

export default JobCard;
