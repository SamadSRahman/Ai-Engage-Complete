import { findAllByTestId } from '@testing-library/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Spinner from '../../components/spinner/Spinner';
import styles from './analytics.module.css'

const Summary = ({id}) => {
const [summaryData, setSummaryData] = useState("") 
const [loading, setLoading] = useState(true)

    const getSummary = async()=>{
        setLoading(true)
        let token  = localStorage.getItem("accessToken")
        try{
            const response = await axios.get(`https://videosurvey.xircular.io/api/v1/video/analytic/feedback/summary/${id}`,
                {
                    headers:{
                        Authorization : `Bearer ${token}`
                    }
                }
            )
            console.log(response.data)
            setSummaryData(response.data.content)
        }
        catch(error){
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(()=>{
        getSummary()
    },[])

  return (
    <div>
      {loading? (
       <div className={styles.spinnerSection}> <Spinner size={''}/>
       <span>Generating Summary...</span>
       </div>
      ):(  
      <ReactMarkdown>{summaryData}</ReactMarkdown>
      )}
    </div>
  );
};

export default Summary;