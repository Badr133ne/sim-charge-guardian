
import React from "react";

interface RechargeTotalsProps {
  user1Total: number;
  user2Total: number;
  total: number;
  user1Number?: string;
  user2Number?: string;
}

export default function RechargeTotals({ 
  user1Total, 
  user2Total, 
  total, 
  user1Number = 'User 1',
  user2Number = 'User 2'
}: RechargeTotalsProps) {
  return (
    <>
      <div className="flex justify-between w-full">
        <span className="font-medium">{user1Number}:</span>
        <span>{user1Total.toFixed(2)} DA</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="font-medium">{user2Number}:</span>
        <span>{user2Total.toFixed(2)} DA</span>
      </div>
      <div className="flex justify-between w-full">
        <span className="font-medium">Total Recharged:</span>
        <span className="font-semibold">{total.toFixed(2)} DA</span>
      </div>
    </>
  );
}
