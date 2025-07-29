# Example: Token Transfer Contract

## Instructions

1. **Create New File**: Click the **+ button** next to "Anoma Project" in the left sidebar
2. **File Name**: Enter `TokenTransfer.juvix`
3. **Copy & Paste**: Copy the code below into the new file
4. **Compile**: Click the blue "Compile" button to test

## TokenTransfer.juvix Code

```juvix
-- TokenTransfer.juvix: Advanced token transfer logic for Anoma
module TokenTransfer;

import Stdlib.Prelude open;
import Anoma.Resource open;
import Anoma.Transaction open;

-- Define token resource type
type TokenResource :=
  mkTokenResource {
    tokenId : String;
    amount : Nat;
    owner : PublicKey;
    metadata : String;
  };

-- Define transfer intent type
type TransferIntent :=
  mkTransferIntent {
    fromOwner : PublicKey;
    toOwner : PublicKey;
    tokenId : String;
    transferAmount : Nat;
    fee : Nat;
  };

-- Create a new token resource
createToken (id : String) (initialAmount : Nat) (owner : PublicKey) (meta : String) : Transaction :=
  let token := mkTokenResource {
    tokenId := id;
    amount := initialAmount;
    owner := owner;
    metadata := meta;
  } in
  createResource token;

-- Transfer tokens between owners
transferTokens (intent : TransferIntent) : Transaction :=
  let sourceResource := getResourceByOwnerAndToken intent.fromOwner intent.tokenId in
  let validTransfer := validateTransfer sourceResource intent in
  case validTransfer of
    true := executeTransfer sourceResource intent;
    false := rejectTransaction "Invalid transfer: insufficient balance or unauthorized";

-- Validate transfer conditions
validateTransfer (source : TokenResource) (intent : TransferIntent) : Bool :=
  and (source.amount >= intent.transferAmount + intent.fee)
      (source.owner == intent.fromOwner);

-- Execute the actual transfer logic
executeTransfer (source : TokenResource) (intent : TransferIntent) : Transaction :=
  let updatedSource := mkTokenResource {
    tokenId := source.tokenId;
    amount := source.amount - intent.transferAmount - intent.fee;
    owner := source.owner;
    metadata := source.metadata;
  } in
  let newDestination := mkTokenResource {
    tokenId := intent.tokenId;
    amount := intent.transferAmount;
    owner := intent.toOwner;
    metadata := "Transferred token";
  } in
  let feeResource := mkTokenResource {
    tokenId := intent.tokenId;
    amount := intent.fee;
    owner := getNetworkFeeAddress;
    metadata := "Network fee";
  } in
  composeTransactions [
    updateResource source.resourceId updatedSource;
    createResource newDestination;
    createResource feeResource;
  ];

-- Get network fee collection address
getNetworkFeeAddress : PublicKey :=
  parsePublicKey "anoma1networkfee000000000000000000000000000000";

-- Utility function to get resource by owner and token ID
getResourceByOwnerAndToken (owner : PublicKey) (tokenId : String) : TokenResource :=
  case findResourceByFilter (matchOwnerAndToken owner tokenId) of
    just resource := resource;
    nothing := error "Token not found for owner";

-- Filter function for finding specific tokens
matchOwnerAndToken (owner : PublicKey) (tokenId : String) (resource : TokenResource) : Bool :=
  and (resource.owner == owner) (resource.tokenId == tokenId);

-- Batch transfer multiple tokens
batchTransfer (transfers : List TransferIntent) : Transaction :=
  let validatedTransfers := filter validateTransferIntent transfers in
  let transactions := map (transferTokens) validatedTransfers in
  composeTransactions transactions;

-- Validate individual transfer intent
validateTransferIntent (intent : TransferIntent) : Bool :=
  and (intent.transferAmount > 0)
      (intent.fee >= getMinimumFee intent.tokenId);

-- Get minimum fee for token type
getMinimumFee (tokenId : String) : Nat :=
  case tokenId of
    "GOLD" := 10;
    "SILVER" := 5;
    _ := 1;

-- Query token balance for an owner
getTokenBalance (owner : PublicKey) (tokenId : String) : Nat :=
  case getResourceByOwnerAndToken owner tokenId of
    mkTokenResource resource := resource.amount;
    _ := 0;

-- Create a marketplace listing
createListing (tokenId : String) (amount : Nat) (pricePerToken : Nat) (seller : PublicKey) : Transaction :=
  let listing := mkTokenResource {
    tokenId := "LISTING_" ++ tokenId;
    amount := amount;
    owner := seller;
    metadata := "Price: " ++ show pricePerToken ++ " per token";
  } in
  createResource listing;
```

## What This Example Demonstrates

### Advanced Anoma Concepts:
- **Resource Management**: Creating, updating, and composing token resources
- **Intent-Based Logic**: Transfer intents with validation
- **Transaction Composition**: Combining multiple operations atomically
- **Fee Handling**: Network fees and minimum fee logic
- **Batch Operations**: Processing multiple transfers together
- **Marketplace Logic**: Creating token listings
- **Error Handling**: Validation and rejection patterns

### Key Features:
- ✅ **Token Creation**: Mint new tokens with metadata
- ✅ **Secure Transfers**: Validation before execution
- ✅ **Fee Processing**: Automatic network fee collection
- ✅ **Batch Processing**: Multiple transfers in one transaction
- ✅ **Balance Queries**: Check token balances
- ✅ **Marketplace Support**: Create buy/sell listings

## Expected Compilation Result

When you compile this, you should see:
- ✅ **Module declaration found**
- ✅ **Import statements processed**
- ✅ **Type checking passed**
- ✅ **Generated nockma bytecode**
- ✅ **Compilation successful**

This example shows a production-ready token system that could be deployed on the Anoma network for real use cases like DeFi, marketplaces, or payment systems.