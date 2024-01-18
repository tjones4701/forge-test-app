import ForgeReconciler, { Text } from '@forge/react';
import React, { useState } from 'react';
import { useForgeInvoke } from '../common/useForgeInvoke';

const App = () => {
  const { value, loading } = useForgeInvoke("getText", { example: 'my-invoke-variable' });

  const [isOpen, setOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Text>I am a settings page</Text>
      <Text>{!loading ? value : 'Loading...'}</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
