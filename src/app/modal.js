import { Box, Modal, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import AboutPhotographers from '../../src/components/photographers/aboutPhotographers';
import BannerProfilePhotographers from '../../src/components/photographers/bannerProfile';

const RegistrationModal = ({open, handleClose, data}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 1,
        overflowY: 'scroll'
    };

    return ( 
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {(data)? <>
                <BannerProfilePhotographers
                    edit={false}
                    urlImgBackground={data.banner}
                    urlImgPhotographers={data.avatar}
                    urlFacebook={data.social["Facebook"]?? ""}
                    urlLinkedIn={data.social["Linkedin"]?? ""}
                    urlTwitter={data.social["Twitter"]?? ""}
                    urlReddit={data.social["Reddit"]?? ""}
                    urlWebsite={data.social["Website"]?? ""}
                    urlYoutube={data.social["Youtube"]?? ""}
                    urlInstagram={data.social["Instagram"]?? ""}
                    photographerName={data.fullname}
                    logoBanner="" // example props
                    linkLogoBanner="" // example props
                />
                
                <AboutPhotographers
                edit={false}
                text1={data.description}
                text2=""
                text3=""
                /></> : <Fragment />}
            </Box>
        </Modal>
    );
}
 
export default RegistrationModal;