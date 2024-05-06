import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../store/jobSlicer';
import './JobCard.css'

const JobCard = () => {

    
    const dispatch = useDispatch();
    const { isLoading, data, error } = useSelector(state => state.job);

    useEffect(() => {
        dispatch(fetchJob());
    }, [dispatch]);

    console.log(data);

  return (
    <div className="job-container">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {data && data.map(job => (
                <div key={job.jdUid} className="job-card">
                    <div className='job-wrapper'>
                    <img className='job-image' src={job.logoUrl} alt={job.companyName} />
                    <div className='job-wrap'>
                    <p className='job-title'>{job.companyName}</p>
                    <p className='job-role'>{job.jobRole} Developer</p>
                    {job.minJdSalary !== null && job.maxJdSalary !== null && job.salaryCurrencyCode ? (
    <p className='job-salary'>Salary: {job.minJdSalary} - {job.maxJdSalary} {job.salaryCurrencyCode}</p>
) : (
    <p className='job-salary'>Salary: 20 - 26 USD</p>
)}

                    </div>
                    </div>
                    {job.location && <p className='job-location'>Location: {job.location}</p>}
                   {job.maxExp ? (
    <p className='job-experience'>Max Experience: {job.maxExp} years</p>
) : (
    <p className='job-experience'>Max Experience: 3 years</p>
)}

                  
                    {job.jobDetailsFromCompany && <p>{job.jobDetailsFromCompany}</p>}
                    {job.jdLink && <button>Easy Apply: <a href={job.jdLink} target="_blank" rel="noopener noreferrer"></a></button>}
                </div>
            ))}
        </div>
  )
}

export default JobCard