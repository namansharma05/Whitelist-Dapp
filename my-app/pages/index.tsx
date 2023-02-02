import Head from 'next/head'
import Web3Modal from 'web3modal'
import {providers, Contract} from 'ethers'
import {WHITELIST_CONTRACT_ADDRESS, abi} from '../constants'
import styles from '@/styles/Home.module.css'
import { useEffect, useState, useRef } from 'react'


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted,setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) =>{
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();
    if (chainId != 5) {
      window.alert("change the network to Goerli");
      throw new Error("change the network to Goerli");
    }

    if(needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };



  const addAddressToWhitelist = async ()=>{
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch(err){
      console.error(err);
    }
  };




  const getNumberOfWhitelisted = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch(err){
      console.error(err);
    }
  };




  const checkIfAddressIsWhitelist = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    } catch(err){
      console.error(err);
    }
  };




  const connectWallet = async()=>{
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelist();
      getNumberOfWhitelisted();
    } catch(err){
      console.error(err);
    }
  };


  const renderButton = () =>{
    if(walletConnected) {
      if(joinedWhitelist){
        return (
          <div className={styles.description}>
            Thanks for Joining the Whitelist!
          </div>
        );
      } else if(loading){
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join The Whitelist!
          </button>
        );
      }
    } else {
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connet Your Wallet
        </button>
      );
    }
  };

  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network:"goerli",
        providerOptions:{},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  },[walletConnected]);


  return (
    <div>
      <Head>
        <title>Whitelist DApp</title>
        <meta name="description" content='whitelist-Dapp'/>
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Crypto Devs!
        </h1>
        <div className={styles.description}>
          {numberOfWhitelisted} have joined the Whitelist
        </div>
        {renderButton()}
        <div>
          <img className={styles.image} src='./crypto-devs.svg'/>
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Naman
      </footer>
    </div>
  )
}
