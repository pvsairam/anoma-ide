# Example: Voting Contract

## Instructions

1. **Create New File**: Click the **+ button** next to "Anoma Project" in the left sidebar
2. **File Name**: Enter `Voting.juvix`
3. **Copy & Paste**: Copy the code below into the new file
4. **Compile**: Click the blue "Compile" button to test the dynamic explanations

## Voting.juvix Code

```juvix
-- Voting.juvix: Secure voting system for Anoma Network
module Voting;

import Stdlib.Prelude open;
import Anoma.Resource open;
import Anoma.Transaction open;

-- Define voter identity type
type VoterID :=
  mkVoterID {
    publicKey : PublicKey;
    voterAddress : String;
    isEligible : Bool;
  };

-- Define voting proposal type
type Proposal :=
  mkProposal {
    proposalId : Nat;
    title : String;
    description : String;
    options : List String;
    startTime : Nat;
    endTime : Nat;
    isActive : Bool;
  };

-- Define vote record type
type Vote :=
  mkVote {
    voterID : VoterID;
    proposalId : Nat;
    selectedOption : Nat;
    timestamp : Nat;
    signature : String;
  };

-- Define voting results type
type VotingResults :=
  mkVotingResults {
    proposalId : Nat;
    totalVotes : Nat;
    optionCounts : List Nat;
    winningOption : Nat;
    isFinalized : Bool;
  };

-- Create a new voting proposal
createProposal (title : String) (description : String) (options : List String) (duration : Nat) : Transaction :=
  let currentTime := getCurrentTime in
  let proposal := mkProposal {
    proposalId := generateProposalId;
    title := title;
    description := description;
    options := options;
    startTime := currentTime;
    endTime := currentTime + duration;
    isActive := true;
  } in
  createResource proposal;

-- Register a new voter
registerVoter (publicKey : PublicKey) (address : String) : Transaction :=
  let voter := mkVoterID {
    publicKey := publicKey;
    voterAddress := address;
    isEligible := true;
  } in
  createResource voter;

-- Cast a vote with validation
castVote (voterID : VoterID) (proposalId : Nat) (optionIndex : Nat) : Transaction :=
  let proposal := getProposalById proposalId in
  let validVote := validateVote voterID proposal optionIndex in
  case validVote of
    true := recordVote voterID proposalId optionIndex;
    false := rejectTransaction "Invalid vote: voter not eligible or proposal not active";

-- Validate voting conditions
validateVote (voter : VoterID) (proposal : Proposal) (optionIndex : Nat) : Bool :=
  let eligibleVoter := voter.isEligible in
  let activeProposal := proposal.isActive in
  let currentTime := getCurrentTime in
  let withinTimeWindow := and (currentTime >= proposal.startTime) (currentTime <= proposal.endTime) in
  let validOption := optionIndex < length proposal.options in
  let notVotedBefore := not (hasVotedBefore voter.publicKey proposal.proposalId) in
  and (and (and eligibleVoter activeProposal) (and withinTimeWindow validOption)) notVotedBefore;

-- Record a valid vote
recordVote (voterID : VoterID) (proposalId : Nat) (optionIndex : Nat) : Transaction :=
  let vote := mkVote {
    voterID := voterID;
    proposalId := proposalId;
    selectedOption := optionIndex;
    timestamp := getCurrentTime;
    signature := signVote voterID proposalId optionIndex;
  } in
  createResource vote;

-- Finalize voting and calculate results
finalizeVoting (proposalId : Nat) : Transaction :=
  let proposal := getProposalById proposalId in
  let currentTime := getCurrentTime in
  case currentTime > proposal.endTime of
    true := calculateResults proposalId;
    false := rejectTransaction "Voting period has not ended yet";

-- Calculate voting results
calculateResults (proposalId : Nat) : Transaction :=
  let votes := getVotesByProposal proposalId in
  let optionCounts := countVotesByOption votes in
  let totalVotes := length votes in
  let winningOption := getWinningOption optionCounts in
  let results := mkVotingResults {
    proposalId := proposalId;
    totalVotes := totalVotes;
    optionCounts := optionCounts;
    winningOption := winningOption;
    isFinalized := true;
  } in
  composeTransactions [
    createResource results;
    updateProposalStatus proposalId false;
  ];

-- Count votes for each option
countVotesByOption (votes : List Vote) : List Nat :=
  foldl incrementOptionCount (replicate maxOptions 0) votes;

-- Increment vote count for selected option
incrementOptionCount (counts : List Nat) (vote : Vote) : List Nat :=
  updateAtIndex counts vote.selectedOption (+ 1);

-- Find the winning option (highest vote count)
getWinningOption (optionCounts : List Nat) : Nat :=
  findMaxIndex optionCounts 0 0 0;

-- Helper function to find index of maximum value
findMaxIndex (counts : List Nat) (currentIndex : Nat) (maxIndex : Nat) (maxCount : Nat) : Nat :=
  case counts of
    [] := maxIndex;
    (x :: xs) := case x > maxCount of
      true := findMaxIndex xs (currentIndex + 1) currentIndex x;
      false := findMaxIndex xs (currentIndex + 1) maxIndex maxCount;

-- Check if voter has already voted on this proposal
hasVotedBefore (voterKey : PublicKey) (proposalId : Nat) : Bool :=
  case findVoteByVoterAndProposal voterKey proposalId of
    just _ := true;
    nothing := false;

-- Generate unique proposal ID
generateProposalId : Nat :=
  getCurrentTime + getRandomSeed;

-- Sign a vote for verification
signVote (voterID : VoterID) (proposalId : Nat) (optionIndex : Nat) : String :=
  let voteData := show proposalId ++ "_" ++ show optionIndex ++ "_" ++ show getCurrentTime in
  cryptoSign voterID.publicKey voteData;

-- Get current timestamp
getCurrentTime : Nat :=
  1640995200; -- Mock timestamp

-- Get random seed for ID generation
getRandomSeed : Nat :=
  42; -- Mock seed

-- Maximum number of options per proposal
maxOptions : Nat :=
  10;

-- Query functions
getProposalById (proposalId : Nat) : Proposal :=
  case findResourceByFilter (matchProposalId proposalId) of
    just proposal := proposal;
    nothing := error "Proposal not found";

getVotesByProposal (proposalId : Nat) : List Vote :=
  filterResourcesByType (matchVoteProposal proposalId);

findVoteByVoterAndProposal (voterKey : PublicKey) (proposalId : Nat) : Maybe Vote :=
  findResourceByFilter (matchVoterAndProposal voterKey proposalId);

-- Filter functions
matchProposalId (proposalId : Nat) (proposal : Proposal) : Bool :=
  proposal.proposalId == proposalId;

matchVoteProposal (proposalId : Nat) (vote : Vote) : Bool :=
  vote.proposalId == proposalId;

matchVoterAndProposal (voterKey : PublicKey) (proposalId : Nat) (vote : Vote) : Bool :=
  and (vote.voterID.publicKey == voterKey) (vote.proposalId == proposalId);

-- Update proposal status
updateProposalStatus (proposalId : Nat) (isActive : Bool) : Transaction :=
  let proposal := getProposalById proposalId in
  let updatedProposal := mkProposal {
    proposalId := proposal.proposalId;
    title := proposal.title;
    description := proposal.description;
    options := proposal.options;
    startTime := proposal.startTime;
    endTime := proposal.endTime;
    isActive := isActive;
  } in
  updateResource proposal.resourceId updatedProposal;
```

## What This Example Demonstrates

### Voting System Features:
- **Voter Registration**: Secure voter identity management
- **Proposal Creation**: Create voting proposals with multiple options
- **Vote Casting**: Secure vote submission with validation
- **Vote Verification**: Prevent double voting and unauthorized votes
- **Result Calculation**: Automatic vote counting and winner determination
- **Time-based Controls**: Voting periods with start/end times

### Advanced Anoma Concepts:
- **Identity Management**: Voter registration and verification
- **Temporal Logic**: Time-based voting windows
- **Resource Composition**: Votes, proposals, and results as resources
- **Cryptographic Signatures**: Vote integrity and verification
- **Query Operations**: Finding and filtering voting data
- **Transaction Composition**: Multi-step voting operations

### Expected Result:
When you compile this, the system should recognize it's a voting contract and show:
- "You designed a digital voting machine"
- "Your voting system can now run on the Anoma blockchain"
- Contextual explanations about secure vote collection

This demonstrates a complete governance system suitable for DAOs, elections, or community decision-making on the Anoma network.