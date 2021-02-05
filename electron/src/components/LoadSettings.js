import { useEffect } from 'react';

export default function LoadSettings(props) {
  // eslint-disable-next-line react/prop-types
  const { loadSettings } = props;

  useEffect(() => {
    console.log('calling load settings');
    loadSettings();
  });

  return null;
}
