import React, { Fragment, useState } from 'react';
import { playingTeams } from '@data/admin/world-cup/worldcup';
import { CircularProgress, Collapse, IconButton } from '@material-ui/core';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { updateMatchFirestore } from '../../../../src/utils/worldcup';
import SensorsIcon from '@mui/icons-material/Sensors';

const AllMatches = (props) => {
  const {allMatches, refetch, isLoading} = props

  // console.log("All", allMatches)

  const MatchTIle = (props) => {
    const [updating, setUpdating] = useState(false)
    const [open, setOpen] = useState(false)

    const {match} = props
    const data = match.data()
    
    const handleGameStart = async (val) => {
      setUpdating(true)
      if (val){
        await updateMatchFirestore({
          matchId: data.matchId,
          hasGameStarted: true,
          hasGameEnded: false
        })
      }else{
        await updateMatchFirestore({
          matchId: data.matchId,
          hasGameStarted: true,
          hasGameEnded: true
        })
      }
      setUpdating(false)
      refetch()
    }

    const handleWinner = async (winner) => {
      setUpdating(true)
      await updateMatchFirestore({
        matchId: data.matchId,
        winner: winner
      })
      setUpdating(false)
      refetch()
    }

    return (
      <div className='match-tile'>
        <div className='match-tile-header'>
          <span style={{fontSize:'14px'}} class={`fi fi-${data.firstTeam.toLowerCase()}`}></span>
          <p className='match-tile-bold'>{playingTeams[data.firstTeam]}</p>
          <p>vs</p>
          <p className='match-tile-bold'>{playingTeams[data.secondTeam]}</p>
          <span style={{fontSize:'14px'}} class={`fi fi-${data.secondTeam.toLowerCase()}`}></span>
          
          <div className='live-status'>
            {!data.hasGameStarted && <button type='button' className='status-started'>Not Started</button>}
            {data.hasGameStarted && !data.hasGameEnded && <button type='button' className='status-live'>
              <SensorsIcon color='info' fontSize='small' />
              <p>Live</p>
            </button>}
            {data.hasGameStarted && data.hasGameEnded && <button type='button' className='status-ended'>Ended</button>}
          </div>

          <div className="collapse-button" >
            <IconButton onClick={() => setOpen(!open)} aria-label="expand" size="small">
                {open ? <KeyboardArrowUpIcon />
                    : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </div>


        <div>
          <Collapse in={open}>
              <div className="collapse-content">
                <div className="collapse-content-section">
                  <p>Match</p>
                  {updating?
                    <CircularProgress />
                      :
                    <Fragment>
                      {!data.hasGameStarted && <button type='button' onClick={() => handleGameStart(true)} className='match-started'>Start</button>}
                      {data.hasGameStarted && !data.hasGameEnded && <button type='button'  onClick={() => handleGameStart(false)} className='match-ended'>End</button>}
                      {data.hasGameStarted && data.hasGameEnded && <button type='button' className='match-completed'>Completed</button>}
                    </Fragment>
                  }
                </div>

                <div className="collapse-content-section">
                  <p>Kick Off</p>
                  <p className="collapse-bold">{data.matchDate.toDate().toDateString()}</p>
                </div>

                <div className="collapse-content-section">
                  <p>Winner</p>
                  {updating?
                    <CircularProgress />
                      :
                    <div style={{display: 'flex', gap: '10px'}}>
                      {(!data.hasGameStarted || !data.hasGameEnded && !data.winner) && <p>TBD</p>}
                      {data.hasGameStarted && data.hasGameEnded && !data.winner && <button type='button' onClick={() => handleWinner(data.firstTeam)} className='winner-button'>{playingTeams[data.firstTeam]}</button>}
                      {data.hasGameStarted && data.hasGameEnded && !data.winner && <button type='button' onClick={() => handleWinner(data.secondTeam)} className='winner-button'>{playingTeams[data.secondTeam]}</button>}
                      {data.hasGameStarted && data.hasGameEnded && !data.winner && <button type='button' onClick={() => handleWinner("draw")} className='winner-button'>Draw</button>}
                      {data.hasGameStarted && data.hasGameEnded && data.winner && <p>{data.winner == "draw"? <b><i>Draw</i></b> : playingTeams[data.winner]}</p>}
                    </div>
                  }
                  
                </div>
              </div>
          </Collapse>
        </div>
      </div>
    )
  }

  return ( 
    <div className='all-matches'>
      {isLoading?
        <CircularProgress />
          :
        <Fragment>
        <h2>All Matches</h2>
        {allMatches && allMatches.map((match) => 
          <MatchTIle key={match.id} match={match} />
        )}
      </Fragment>}
    </div>
  );
}
 
export default AllMatches;