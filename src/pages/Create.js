import React, { useState } from 'react'
import {Form, Container, Card, Button} from 'react-bootstrap'
import styled from 'styled-components'
import {useMoralisFile} from 'react-moralis'
import contract from '../abi/contract.json'
import Web3 from 'web3'
import {useMoralis} from "react-moralis"




const CustomContainer = styled(Container)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

const CustomForm = styled(Form)`
    align-items: center;
    justify-content: center;
    border: dark;
    width: 25rem;
    border-radius: 20px;
    margin-top: 50px;



    `;

const CustomCard = styled(Card)`
    display: flex;
    align-items: center;
    border: dark;
    width: 30rem;
    height: 30rem;
    border-radius: 20px;
`;


// file name describtion
export const Create = () => {
    
    const [nftName, setNftName] = useState()
    const [nftDescribe, setNftDescribe] = useState()
    const [nftfile, setNftfile] = useState()
    const [nfthash, setNfthash] = useState()
    const [nftipfs, setNftIpfs] = useState()
    const { moralisFile, saveFile} = useMoralisFile() 

    const { user} = useMoralis();

    
    const createNFT = async () =>{
        let metadata = {}
        saveFile(nftfile.name, nftfile, { metadata, saveIPFS: true }).then( (moralisFile) => {
            metadata = {name: nftName, 
                        describtion: nftDescribe,
                        image: "/ipfs/" + moralisFile._hash}
            saveFile("metadata.json",{base64: btoa(JSON.stringify(metadata))}, {saveIPFS: true}).then( async (moralisFile)=>{
                console.log("got here 2")

                setNfthash(moralisFile._hash)
                setNftIpfs(moralisFile._ipfs)
                console.log(moralisFile._ipfs)
                const hash = "/ipfs/" + moralisFile._hash
                submitToBlock(hash)
            })

        })
    }


    const submitToBlock = async (hash) => {
        const nftabi = contract.abi
        const nftcontactAdress = "0xf2E65A8c964EE9f6dF41A63be42a4213a66a16c8"
        const web3 = new Web3(window.ethereum);
        const myContract = new web3.eth.Contract(nftabi, nftcontactAdress);
        console.log(nfthash)
        console.log(hash)
        console.log(user)
        myContract.methods.nftmint(hash).send({ from: user.get("ethAddress")}).then( () =>{
            myContract.methods.getToken().call().then( (response) => {
                saveOnDatabase(response)
                myContract.methods.tokenURI(response).call().then( (response2) => {
                    console.log(response2)
                })
            });
        })
    }

    const saveOnDatabase = async (tokenId) => {
        user.add("TokenIds", tokenId)
        user.save()
    }

    return (
    <CustomContainer>
        <CustomCard>
            <CustomForm>
            
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name NFT</Form.Label>
                    <Form.Control type="text" onChange={(e) => setNftName(e.target.value)}/>
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Describe NFT</Form.Label>
                    <Form.Control as="textarea" rows={3}  onChange={(e) => setNftDescribe(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file"  size="lg" onChange={(e) => setNftfile(e.target.files[0])}/>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="primary center" size="lg" onClick={createNFT}>CREATE</Button>
                </div>
                
            </CustomForm>
        </CustomCard>
    </CustomContainer>
  )
}
