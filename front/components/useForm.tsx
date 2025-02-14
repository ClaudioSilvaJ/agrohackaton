import { useState } from 'react';

export function useForms() {
  const [form, setForm] = useState(null);
  const [aviario, setAviario] = useState(null);

  const updateForm = (newObject: any) => {
    setForm(newObject);
  };

  const updateAviario = (newObject: any) => {
    setAviario(newObject);
  };

  const getform = () => form;
  const getaviario = () => aviario;

  return {
    form,
    aviario,
    updateForm,
    updateAviario,
    getform,
    getaviario,
  };
}
