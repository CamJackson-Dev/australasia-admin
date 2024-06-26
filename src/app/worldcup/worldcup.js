import React from 'react';
import './style.module.css';

import { useState } from 'react';
import { Field, Form, Formik, useField } from 'formik';
import { matchSchema } from '@data/admin/world-cup/schema';
import { playingTeams } from '@data/admin/world-cup/worldcup';
import { createMatchFirestore, getAllMatches } from '../../../src/utils/worldcup';
import { CircularProgress } from '@material-ui/core';
import { useQuery } from 'react-query';
import AllMatches from './components/allMatches';
import { FullPageProgressBar } from '../../../src/components/progressBar/progressBar';

const WorldCupAdmin = () => {
  const [creating, setCreating] = useState(false)
  
  const {data, isLoading, refetch} = useQuery('all-matches', async() => {
    const res = await getAllMatches()

    return res.docs
  })
  
  const generateMatchUID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uid += characters.charAt(randomIndex);
    }
  
    return uid;
  }
  
  const formikProps = {
    initialValues: {
      firstTeam: "",
      secondTeam: "",
      matchId: generateMatchUID(),
      matchDate: new Date(),
      hasGameStarted: false,
      hasGameEnded: false,
      winner: "",
      loser: ""
    },
    validationSchema: matchSchema
  }

  const onDateChange = (values, setValues, date) => {
    setValues({...values, matchDate: date})
  }

  const createMatch = async(values, setFieldValue) => {
    setCreating(true)
    await createMatchFirestore(values)
    setCreating(false)
    setFieldValue("matchId", generateMatchUID())
    refetch()
  }

  if (isLoading) return(
    <FullPageProgressBar />
  )
  
  return ( 
    <Formik {...formikProps} onSubmit={(values, action) => createMatch(values, action.setFieldValue)}>
      {({values, handleSubmit, resetForm, ...props}) => (
        <Form onSubmit={handleSubmit}>
          <div style={{width: '100%'}}>
            <div className='create-match'>
              <h2>Create Match</h2>
              <div className='team-container'>
                <Field as="select" name='firstTeam' className='team-select'>
                  {Object.keys(playingTeams).map((team, index) => (
                    <option key={`first-team-${team}`} value={team}>{playingTeams[team]}</option>
                  ))}
                </Field> 

                <div>vs</div>

                <Field as="select" name='secondTeam' className='team-select'>
                  {Object.keys(playingTeams).map((team, index) => (
                    <option key={`second-team-${team}`} value={team}>{playingTeams[team]}</option>
                  ))}
                </Field> 
              </div>
              <div className='time-container'>
                <p style={{marginRight: '20px'}}>Match date and time:</p>
                
                {/* <DateTimePicker onChange={(date) => onDateChange(values, props.setValues, date)} value={values.matchDate} /> */}
              </div>
              <div>
                {!creating?
                  <button type='submit' className='create-button'>Create</button>
                    :
                  <CircularProgress />
                }
              </div>

            </div>

            <AllMatches isLoading={isLoading} refetch={refetch} allMatches={data} />
          </div>
        </Form>
      )}
    </Formik>
  );
}
 
export default WorldCupAdmin;