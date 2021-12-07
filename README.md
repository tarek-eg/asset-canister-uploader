# asset-canister-uploader

A simple Node.js script for uploading assets to an asset canister

install packages

```
- npm i
```

in a different terminal

start the replica

```
- dfx start --clean
```

deploy your own asset canister

```
- dfx deploy
```

or clone and deploy the official assets cansiter

```
- git clone https://github.com/dfinity/certified-assets
- cd certified-assets
- dfx deploy
```

in this script root directory
copy the cansiter id and put it in the .env
CANISTER_ID="yourcanister"
and your path to the private key

in this project terminal run:

```
- npm start
```
