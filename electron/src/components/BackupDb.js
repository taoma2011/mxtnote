import React, { useEffect } from "react";

export default function BackupDb(props) {
  // eslint-disable-next-line react/prop-types
  const { backupDb } = props;

  useEffect(() => {
    const timer = setInterval(() => backupDb(), 30000);
    return () => clearInterval(timer);
  });

  return null;
}
