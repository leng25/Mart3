import React, {useState} from 'react'
import { Button, Card, Container, Image, Navbar, Nav, NavDropdown} from 'react-bootstrap'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller';
import metalogo from '../assets/MetaMaskLogo.png'
import picture from '../assets/antelope-canyon-6-1532993.jpg'
import {useNavigate} from "react-router-dom";
import {useMoralis, useMoralisQuery, useMoralisCloudFunction, useWeb3Transfer} from "react-moralis"
import CardHeader from 'react-bootstrap/esm/CardHeader';
import marketPlaceAbi from '../abi/marketplaceAbi.json'
import Web3 from 'web3'



const CustomContainer = styled(Container)`
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CustomCardContainer = styled(Container)`
    margin-bottom: 150px;
    margin-top: 150px;


`;


const CustompriceCArdText = styled(Card.Text)`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: x-large;
    
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
    width: 28rem;
    height: 28rem;
    object-fit: cover;
`;

const CustomUserImage = styled(Image)`
    display: flex;
    border-radius: 100px;
    margin-bottom: 10px;
    width: 4rem;
    height: 4rem;
`;

const CustomButton = styled(Button)`
    width: 10rem;
    height: 4rem;
    font-size: x-large;
    border-radius: 20px;
    `;


const CustomLogoutButton = styled(Button)`
    width: 8rem;
    font-size: large;
    border-radius: 20px;
    `;


  const CustomCardTitle = styled(Card.Title)`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: x-large;

    `;




export const  Home = () => {

  const Moralis = require("moralis/node");

  
  const { authenticate, logout, isAuthenticated, user} = useMoralis();
  const [postList, setPostList] = useState([])

  const navigate = useNavigate()


const { fetch : fetchpost, data, error, isLoading } = useMoralisCloudFunction(
    "UserTest",

    { autoFetch: false }
);

  const logmeout = () =>{
    logout()  
    navigate('/login')
  }


  const generatePost = async() =>{
    const respones = await fetchpost()
    console.log(respones)
    setPostList(respones)
  }

  window.onload = () =>{
    generatePost()
  }

  const buy = async (card) =>{
    console.log(card.name)

    const web3 = new Web3(window.ethereum);
    const myMarketContract = new web3.eth.Contract(marketPlaceAbi.abi, "0x6a92CeCe5917EcF17b07bE17307dF5DFc6fA6cD2");

    console.log(card.itemCount)
    
    myMarketContract.methods.purchaseItem(card.itemCount).send({ from: user.get("ethAddress")}).then(()=>{
      console.log("HELLO")
    })


  }

  const renderCard = (card, index) =>{
    return(
      <CustomCardContainer key={index}>
            <Card.Text >{card.ethAddres}</Card.Text>
          <CustomCard >

            <Card.Body>
              <CustomImage  src ={"https://ipfs.moralis.io:2053/" + card.image} />
            </Card.Body>

            <Card.Body>
              <CustomCardTitle>{card.name}</CustomCardTitle>
            
              <CustompriceCArdText>{card.price}</CustompriceCArdText>

              <CustomButton variant="primary center" onClick={() => buy(card)} >BUY</CustomButton>
            </Card.Body>

          </CustomCard>
      </CustomCardContainer>

    )
  }

  return (
  
   <div> 
  <Navbar bg="dark" variant="dark">
    <Container>
    <Navbar.Brand onClick={ () => navigate('/')}>Mart</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="profile">Profile</Nav.Link>
    </Nav>
    <Navbar.Collapse className="justify-content-end">
      <CustomLogoutButton onClick={logmeout}>LogOut</CustomLogoutButton>
    </Navbar.Collapse>
    </Container>
  </Navbar>

      <CustomContainer>




          <InfiniteScroll>
          {postList.map( (data,i) =>renderCard(data,i) )}
          </InfiniteScroll>

      </CustomContainer>
    </div>
  )
}
