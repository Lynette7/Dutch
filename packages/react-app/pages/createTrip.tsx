import { ethers } from "ethers";
import * as React from "react";
import { useWalletClient } from "wagmi";
import { providers } from "ethers";
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { useAccount } from "wagmi";
import styles from "../styles/Trips.module.css";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { bytecode } from "../contracts/bytecode";
import { useRouter } from "next/router";
import Image from "next/image";
import { WalletClient } from "viem";

export function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain?.id ?? 0,
        name: chain?.name ?? '',
        ensAddress: chain?.contracts?.ensRegistry?.address ?? '',
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account?.address ?? '');
    return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}

const CreateTrip = () => {
  const groupAbi = require("../contracts/groupabi.json");
  const signer = useEthersSigner({ chainId: 11155111 });
  const { address } = useAccount();
  const lockContractAddress = process.env.NEXT_PUBLIC_LOCK as string;
  // const contractAddress = process.env.NEXT_PUBLIC_CONTRACT as string;
  const [isLoading, setIsLoading] = React.useState(false);
  const [contractAddress, setContractAddress] = React.useState("");
  const router = useRouter();

  const handleTripCreation = async (values: any) => {
    setIsLoading(true);
    const factory = new ethers.ContractFactory(groupAbi, bytecode, signer);
    const contract = await factory.deploy("Paige", values.tripName);
    contract.address;
    contract.deployTransaction;
    await contract.deployTransaction.wait();
    console.log(contract.address);
    setContractAddress(contract.address);
    setIsLoading(false);
  };

  const handleKeys = async (values: any) => {
    setIsLoading(true);
    const contract = new ethers.Contract(
      contractAddress as string,
      groupAbi,
      signer
    );
    await contract.createParticipant("Alex", values.fren1);
    await contract.createParticipant("Ursula", values.fren2);
    await contract.createParticipant("Minnie", values.fren3);

    const lockContract = new ethers.Contract(
      lockContractAddress,
      PublicLockV13.abi,
      signer
    );
    const tx2 = await lockContract.grantKeys(
      [values.fren1, values.fren2, values.fren3],
      [0],
      [address]
    );
    if (tx2) {
      console.log("Key TX", tx2);
      router.push(`/trip/${contractAddress}`);
    } else {
      return;
    }
  };

  return (
    <div>
      {/* <button onClick={addParticipant}>+ New Trip</button> */}
      <div className={styles.container}>
        <div className={styles.main}>
          <h1>
            Create a Trip <span>🎉</span>
          </h1>
          {isLoading && <div>Loading...</div>}
          {!contractAddress && !isLoading && (
            <div style={{ border: "black .4rem solid", padding: "1rem" }}>
              <Formik
                initialValues={{
                  tripName: "",
                }}
                onSubmit={(
                  values: any,
                  { setSubmitting }: FormikHelpers<any>
                ) => {
                  handleTripCreation(values);
                }}
              >
                <Form>
                  <label htmlFor="tripName">
                    <h2>Trip Name</h2>
                  </label>
                  <Field
                    style={{ width: "40vw", height: "2rem" }}
                    id="tripName"
                    name="tripName"
                    placeholder="ETH Waterloo 2023"
                  />

                  <button type="submit">Submit</button>
                </Form>
              </Formik>
            </div>
          )}
          {contractAddress && !isLoading && (
            <Formik
              initialValues={{
                fren1: "",
                fren2: "",
                fren3: "",
              }}
              onSubmit={(
                values: any,
                { setSubmitting }: FormikHelpers<any>
              ) => {
                handleKeys(values);
              }}
            >
              <Form>
                <div
                  style={{
                    display: "flex",
                    width: "50vw",
                    alignItems: "center",
                    gap: ".5rem",
                    marginTop: "1rem",
                    alignContent: "center",

                    justifyContent: "center",
                  }}
                >
                  <label style={{ wordWrap: "normal" }} htmlFor="fren1">
                    Fren1
                  </label>
                  <Image
                    src="/Nouns.png"
                    height={60}
                    width={70}
                    alt="Dutch logo"
                  />

                  <Field
                    id="fren1"
                    name="fren1"
                    placeholder="paigexx.eth"
                    style={{ height: 50 }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "50vw",
                    alignItems: "center",
                    gap: ".5rem",
                    marginTop: "1rem",
                    alignContent: "center",

                    justifyContent: "center",
                  }}
                >
                  <label style={{ wordWrap: "normal" }} htmlFor="fren2">
                    Fren2
                  </label>
                  <Image
                    src="/Nouns4.png"
                    height={60}
                    width={70}
                    alt="Dutch logo"
                  />

                  <Field
                    id="fren2"
                    name="fren2"
                    placeholder="phil.eth"
                    style={{ height: 50 }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "50vw",
                    alignItems: "center",
                    gap: ".5rem",
                    marginTop: "1rem",
                    alignContent: "center",

                    justifyContent: "center",
                  }}
                >
                  <label style={{ wordWrap: "normal" }} htmlFor="fren3">
                    Fren3
                  </label>
                  <Image
                    src="/Nouns6.png"
                    height={60}
                    width={70}
                    alt="Dutch logo"
                  />

                  <Field
                    id="fren3"
                    name="fren3"
                    placeholder="kate.eth"
                    style={{ height: 50 }}
                  />
                </div>

                <button type="submit">Submit</button>
              </Form>
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
