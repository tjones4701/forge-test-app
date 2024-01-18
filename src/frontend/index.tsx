import ForgeReconciler, { ModalDialog, Text } from '@forge/react';
import React, { useState } from 'react';
import { useForgeInvoke } from '../common/useForgeInvoke';

const App = () => {
  const { value, loading } = useForgeInvoke("getText", { example: 'my-invoke-variable' });

  const [isOpen, setOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalDialog header="Hello" onClose={() => setOpen(false)}>
      <Text>Hello world!</Text>
      <Text>{!loading ? value : 'Loading...'}</Text>
    </ModalDialog>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
