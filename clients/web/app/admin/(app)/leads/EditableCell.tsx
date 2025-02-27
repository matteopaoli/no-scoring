'use client'
import { Text, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditableCell({
  initialValue,
  updateMyData,
}: { initialValue: any, updateMyData: (value: string) => any }) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prevValue, setPrevValue] = useState(initialValue);
  const toast = useToast();

  useEffect(() => {
    const isDesktopDevice = window.innerWidth > 768;
    setIsDesktop(isDesktopDevice);
  }, []);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setIsEditing(false);
    if (value !== prevValue) {
        updateMyData(value);
        toast({
            title: "Note aggiornate",
            status: "success",
            duration: 2000,
            isClosable: false,
        });
        setPrevValue(value);
    }
  };

  const handleKeyDown = (e) => {
    if (isDesktop && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onBlur();
    }
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  return isEditing ? (
    <Textarea
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      style={{ margin: '-16px -24px', width: "300px" }}
      placeholder="Aggiungi una nota (Premi Invio per salvare, Shift+Invio per un nuovo rigo)"
      _placeholder={{ fontWeight: '400', fontSize: 14 }}
    />
  ) : (
    <span>
        <Tooltip label="Clicca per modificare">
            <span onClick={handleClick} style={{ cursor: "pointer", display: 'inline-block', whiteSpace: 'pre-wrap', height: '100%', margin: '-16px -24px', padding: '16px 24px', width: '300px' }}>
            {value ? value : <Text as="span" fontWeight="300">Inserisci una nota</Text>}
            </span>
        </Tooltip>
    </span>
  );
}
