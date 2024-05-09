import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJob } from "../store/jobSlicer";
import { updateFilteredData } from "../store/jobSlicer";
import "./JobCard.css";
import { IoIosFlash } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

const JobCard = () => {
  const dispatch = useDispatch();
  const { isLoading, data, error, totalCount, filteredData } = useSelector(
    (state) => state.job
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialLoadCount, setInitialLoadCount] = useState(12);
  const modalRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState({
    experience: "",
    minBasePay: "",
    type: "",
    location: "",
    role: "",
    companyName: "",
  });

  useEffect(() => {
    dispatch(fetchJob());
  }, [dispatch]);

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
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;

    if (data.length < totalCount) {
      setTimeout(() => {
        loadMoreJobs();
      }, 1000);
    } else {
      setIsFetching(false);
    }
  }, [isFetching, data, totalCount]);

  const loadMoreJobs = () => {
    const newLoadCount = initialLoadCount + 12;
    setInitialLoadCount(newLoadCount > totalCount ? totalCount : newLoadCount);
    setIsFetching(false);
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

  const handleExperienceChange = (e) => {
    const experienceValue = e.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, experience: experienceValue }));
  };
  
  const handleMinBasePayChange = (e) => {
    const minBasePayValue = e.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, minBasePay: minBasePayValue }));
  };
  
  const handleSearch = () => {
    console.log("Filters:", filters); // Check if filters contain the expected values
    
    const filteredData = data.filter(job => {
      if (
        (filters.experience && parseInt(filters.experience) !== job.maxExp) ||
        (filters.minBasePay && parseInt(filters.minBasePay) > job.minJdSalary) ||
        (filters.type && filters.type !== job.type) ||
        (filters.location && filters.location !== job.location) ||
        (filters.role && filters.role !== job.jobRole) ||
        (filters.companyName && !job.companyName.toLowerCase().includes(filters.companyName.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });
  
    console.log("Filtered Data:", filteredData); // Check the filtered data
  
    // Update state with filtered data
    dispatch(updateFilteredData(filteredData));
  
    // Reset initial load count to show the initial number of jobs
    setInitialLoadCount(12);
  };
  return (
    <>
      <div className="filters">
        <div>
          <label htmlFor="experience">Experience:</label>
          <select
            id="experience"
            name="experience"       
            onChange={handleExperienceChange}>
            <option value="">Select Experience</option>
            <option value="1">Fresher</option>
            <option value="2">1-2 years</option>
            <option value="3">2-4 years</option>
            <option value="4">4-7 years</option>
            <option value="5">7-12 years</option>
          </select>
        </div>
        <div>
          <label htmlFor="minBasePay">Min Base Pay:</label>
          <select
            id="minBasePay"
            name="minBasePay"
            onChange={handleMinBasePayChange}
          >
            <option value="">Select Minimum Pay</option>
            <option value="0">0-20 usd</option>
            <option value="10000">20-60 usd</option>
            <option value="20000">60-80 usd</option>
            <option value="30000">80-100 usd</option>
            <option value="40000">100-120 usd</option>
            <option value="50000">120-140 usd</option>
            <option value="60000">140-160 usd</option>
          </select>
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">Select Type</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            name="location"
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          >
            <option value="">Select Location</option>
            <option value="Delhi Ncr">Delhi Ncr</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          >
            <option value="">Select Role</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Ios Developer">Ios Developer</option>
            <option value="Android Developer">Android Developer</option>
            <option value="Tech Lead Developer">Tech Lead Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Tech Lead Developer">Tech Lead Developer</option>
          </select>
        </div>
        <div className="input-name">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            onChange={(e) => setFilters({...filters, companyName: e.target.value})}
            placeholder="Enter Company Name"
          />
        </div>
        <div className="search-button-wrapper">
          <button className="search-button" onClick={handleSearch}>
            <CiSearch style={{ fontSize: "20px" }} />
          </button>
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
