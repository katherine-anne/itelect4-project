// src/pages/ClaimsPage.tsx -- NEW FILE

import ClaimCard from "../components/ClaimCard";
import { allClaims } from "../data/mockData";

function ClaimsPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allClaims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Proof: {claim.proof}
            </p>
          </ClaimCard>
        ))}
      </div>
    </div>
  );
}

export default ClaimsPage;