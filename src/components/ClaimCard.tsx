import type { ReactNode } from "react";
import type { Claim } from "../types";

interface ClaimCardProps {
  claim: Claim;
  children?: ReactNode;
}

function ClaimCard({ claim, children }: ClaimCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        Claim #{claim.id}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Item ID: {claim.itemId}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Claimant ID: {claim.claimantId}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Status: {claim.status}
      </p>

      {children}
    </div>
  );
}

export default ClaimCard;