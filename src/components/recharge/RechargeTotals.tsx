
import React from "react";

interface RechargeTotalsProps {
  user1Total: number;
  user2Total: number;
  total: number;
}

export default function RechargeTotals({ user1Total, user2Total, total }: RechargeTotalsProps) {
  return (
    <>
      <div className="flex justify-between w-full">
        <span className="font-medium">User 1 Total:</span>
        <span>{user1Total.toFixed(2)} DA</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="font-medium">User 2 Total:</span>
        <span>{user2Total.toFixed(2)} DA</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="font-medium">Total Recharged:</span>
        <span className="font-semibold">{total.toFixed(2)} DA</span>
      </div>
    </>
  );
}
