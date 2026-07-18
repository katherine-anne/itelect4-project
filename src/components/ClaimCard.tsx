import type { Claim } from "../types";

interface ClaimCardProps {
  claim: Claim;
}

function ClaimCard({ claim }: ClaimCardProps) {
  return (
    <div className="claim-card">
      <h3>Claim #{claim.id}</h3>
      <p>Item ID: {claim.itemId}</p>
      <p>Claimant ID: {claim.claimantId}</p>
      <p>Status: {claim.status}</p>
    </div>
  );
}

export default ClaimCard;