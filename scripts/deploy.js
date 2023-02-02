const {ethers} = require("hardhat")

async function main(){
  const whitelistcontract = await ethers.getContractAt("whitelist");
  const deployedWhitelistContract = await whitelistcontract.deploy(10);
  await deployedWhitelistContract.deployed();

  console.log("whitelist contract Address : ",deployedWhitelistContract.address);
}

main().then(()=> process.exit(0)).catch(error=>{
  console.error(error);
  process.exit(1);
});