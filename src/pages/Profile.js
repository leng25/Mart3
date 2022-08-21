import React , { useState, useEffect } from 'react'
import { Button, Card, Container, Image, Navbar, Nav, NavDropdown, Modal, Form} from 'react-bootstrap'
import styled from 'styled-components'
import {useNavigate} from "react-router-dom";
import picture from '../assets/antelope-canyon-6-1532993.jpg'
import {useMoralis} from "react-moralis"
import Web3 from 'web3'
import contract from '../abi/contract.json'
import marketPlaceAbi from '../abi/marketplaceAbi.json'



const CustomContainer = styled(Container)`
    margin-top: 100px;
    align-items: center;
    justify-content: center;
`;

const CustomCardContainer = styled(Container)`
  margin-top: 100px;
  justify-content: center;
  display:flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const CustomButton = styled(Button)`
    justify-content: center;
    d-grid gap-2;
    font-size: x-large;
    border-radius: 20px;
    `;

const CustomListButton = styled(Button)`
    width: 8rem;
    font-size: large;
    border-radius: 20px;
    `;

const CustomCard = styled(Card)`
    display: flex;
    align-items: center;
    justify-content: center;
    border: dark;
    width: 25rem;
    border-radius: 25px;
    margin-bottom: 25px;
    margin-top: 20px;
    margin-right: 20px;
`;

const CustomImage = styled(Card.Img)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 23rem;
    height: 23rem;
    margin-top: 15px;
    object-fit: cover;

`;


const CustomCardTitle = styled(Card.Title)`
    align-items: center;
    justify-content: center;
    font-size: x-large;

    `;


const CustomLogoutButton = styled(Button)`
    width: 8rem;
    font-size: large;
    border-radius: 20px;
`;

export const Profile = () => {


  const [NftMetaData, setNftMetaData] = useState([])
  const [NftPrice, setNftPrice] = useState()
  const [CurrentIndex, setCurrentIndex] = useState()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const navigate = useNavigate()

  const { authenticate, logout, isAuthenticated, user} = useMoralis();


/*
  useEffect(() =>{
    const fetchData = async  () =>{
        console.log(user)
        await getblock()
    }
    fetchData()
  });
*/

  const navigateToCreate = async () =>{
    navigate('/create')
  }

  

  const getTokens = async () =>{
    const tokens =  user.get("TokenIds")
    return tokens
  }

  const getmetadeta = async (hash) =>{

    const url = "https://ipfs.moralis.io:2053/" + hash
    const response = await fetch(url);
    const metadata = await response.json()
    return (metadata)
  }

  const getblock = async () => {

    const tokens =  await getTokens()
    if(tokens){
    
        const nftabi = contract.abi
        const nftcontactAdress = "0xf2E65A8c964EE9f6dF41A63be42a4213a66a16c8"
        const web3 = new Web3(window.ethereum);
        const myContract = new web3.eth.Contract(nftabi, nftcontactAdress);
        const metadetalist = []

        for(let i =0; i < tokens.length; i++){
          myContract.methods.tokenURI(tokens[i]).call().then(async (response) =>{
            const metadata = await getmetadeta(response)
            metadata['tokenId'] =  tokens[i];

            setNftMetaData(oldArray => [...oldArray,metadata ])
          })
        }

    
    }
    else{
      console.log("No tokens")
    }
  }

  const Post = async (card) =>{


    const web3 = new Web3(window.ethereum);
   
    const myContract = new web3.eth.Contract(contract.abi, "0xf2E65A8c964EE9f6dF41A63be42a4213a66a16c8");
    const myMarketContract = new web3.eth.Contract(marketPlaceAbi.abi, "0xcfBFeF79ff3835937De069f4FEe54750a8945977");

    card["price"] = NftPrice


    console.log( web3.utils.toWei(card["price"], "ether"))
   
    myContract.methods.setApprovalForAll("0xcfBFeF79ff3835937De069f4FEe54750a8945977", true).send({ from: user.get("ethAddress")}).then(() => {
      myMarketContract.methods.makeItem("0xf2E65A8c964EE9f6dF41A63be42a4213a66a16c8", card['tokenId'], web3.utils.toWei(card["price"], "ether") ).send({ from: user.get("ethAddress")}).then(() =>{
        myMarketContract.methods.getItemCount().call().then((response)=>{
          console.log(response)
          card["itemCount"] = response
              
          const timeStamp = new Date().getTime();

          card["timeStamp"] = timeStamp

          card["ethAddres"] = user.get("ethAddress")

          console.log(card)

          user.add("Posts", card )
          user.save()

          handleClose()

        })
      })
    })

    


  }

  const renderModal = (index) =>{
    setCurrentIndex(index)
    handleShow()
  }
  
  

  const renderCard = (card, index) =>{
    return(
      <CustomCard key={index}>
            <CustomImage variant="top" src = {"https://ipfs.moralis.io:2053/" + card.image} />
              
              <Card.Body>
                <Card.Title>{card.name}</Card.Title>
                <Card.Text>
                  {card.describtion}
                </Card.Text>
              </Card.Body>
              
              <Card.Body>
                <CustomListButton variant="primary" onClick={() =>renderModal(index)} >List</CustomListButton>
              </Card.Body>


      <Modal  centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>List NFT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Set Price</Form.Label>
                <Form.Control type="number" onChange={(e) => setNftPrice(e.target.value)}/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => Post(NftMetaData[CurrentIndex])}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>

      </CustomCard>
    )
  }

  const logmeout = () =>{
    logout()
    navigate('/login')
  }

  window.onload = () =>{
    getblock()
  }


  return (

  <div>
      
    <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand onClick={ () => navigate('/')}>Mart</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#profile">Profile</Nav.Link>
      </Nav>
      </Container>
      <Navbar.Collapse className="justify-content-end">
        <CustomLogoutButton onClick={logmeout}>LogOut</CustomLogoutButton>
      </Navbar.Collapse>
    </Navbar>

    <CustomContainer>  
      <div className="d-grid gap-2">    
        <CustomButton  variant="primary center" size="lg" onClick={navigateToCreate}>Create NFT</CustomButton>
      </div>
      <CustomCardContainer>
        {NftMetaData.map( (data,i) =>renderCard(data,i) )}
      </CustomCardContainer>
    
    </CustomContainer>

  </div>
  )
}
