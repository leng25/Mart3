import React from 'react'
import { Button, Card, Container} from 'react-bootstrap'
import {useMoralis} from "react-moralis"
import {useNavigate} from "react-router-dom";
import styled from 'styled-components'
import metalogo from '../assets/MetaMaskLogo.png'
import martlogo from '../assets/official-mart-logo-2@2x.png'

const CustomContainer = styled(Container)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

const CustomCard = styled(Card)`
    display: flex;
    align-items: center;
    justify-content: center;
    border: dark;
    width: 30rem;
    border-radius: 20px;
`;


const CustomImage = styled(Card.Img)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25rem;
    height: 25rem;
`;

const CustomButton = styled(Button)`
    width: 10rem;
    height: 3rem;
    border-radius: 20px;

`;



export const Login = () =>{

  const { authenticate, logout, isAuthenticated, user} = useMoralis();
  const navigate = useNavigate()

  const connect = async () =>{
    if(!isAuthenticated){
      await authenticate({signingMessage: "Log in using Moralis" })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
        navigate('/')
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else{
      navigate('/')
    }
  
  }

  const logmeout = () =>{
    logout()
  }


  return (
      <CustomContainer>
        
          <CustomCard >

            <Card.Body>
              <CustomImage  src ={metalogo} />
            </Card.Body>
            
            <Card.Body>
              <Card.Title>Log In With MetaMask</Card.Title>
            </Card.Body>
            
            <Card.Body>
              <CustomButton variant="primary center" onClick={connect}>Connect</CustomButton>
  {/*       <CustomButton variant="primary center" onClick={logmeout}>logmeout</CustomButton> */}

            </Card.Body>

          
          </CustomCard>

      </CustomContainer>
  )
}
