import { Actor, HttpAgent } from "@dfinity/agent";
import { Secp256k1KeyIdentity } from "@dfinity/identity";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import fetch from "node-fetch";
import { idlFactory } from "./src/certified_assets/index";

const canisterId = process.env.CANISTER_ID!;
const host = process.env.HOST || "http://localhost:8000";

const initIdentity = () => {
  const buffer = readFileSync(process.env.PATH_TO_PRIVATE_KEY!);
  const key = buffer.toString("utf-8");
  const privateKey = createHash("sha256").update(key).digest("base64");

  const secp = Secp256k1KeyIdentity.fromSecretKey(
    Buffer.from(privateKey, "base64"),
  );
  return secp;
};

const identity = initIdentity();

export const principal = identity.getPrincipal();
async function upload() {
  const agent = new HttpAgent({
    identity,
    //@ts-expect-error
    fetch,
    host,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Fetching root key....");
    await agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running",
      );
      console.error(err);
    });
  }

  const assets = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });

  // list all assets "doesn't need authorized caller"
  const result = await assets.list({});
  console.log("result", result);

  const foobar = [...new TextEncoder().encode("foobar")];

  // store an asset "needs authorized caller" this fails
  /* 
    Reject code: 4
    Reject text: Caller is not authorized
  */
  const update = await assets.store({
    key: "/foobar.txt",
    content: foobar,
    sha256: [],
    content_type: "text/plain",
    content_encoding: "identity",
  });
  console.log("patchId", update);
}

upload();
