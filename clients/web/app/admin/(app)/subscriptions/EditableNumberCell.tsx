'use client'
import { Text, Input, Tooltip, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditableNumberCell({
  initialValue,
  updateMyData,
}: { initialValue: number, updateMyData: (value: number) => any }) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prevValue, setPrevValue] = useState(initialValue);
  const toast = useToast();

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
  };

  const onChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(newValue);
  };

  const onBlur = () => {
    setIsEditing(false);
    const numericValue = parseFloat(value) || 0;
    if (numericValue !== prevValue) {
      updateMyData(numericValue);
      toast({
        title: "Valore aggiornato",
        status: "success",
        duration: 2000,
        isClosable: false,
      });
      setPrevValue(numericValue);
    }
  };

  const handleKeyDown = (e) => {
    if (isDesktop && e.key === "Enter") {
      e.preventDefault();
      onBlur();
    }
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  return isEditing ? (
    <Input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      type="text"
      style={{ margin: "-16px -24px", width: "300px" }}
      placeholder="Inserisci un importo"
      _placeholder={{ fontWeight: "400", fontSize: 14 }}
    />
  ) : (
    <span>
      <Tooltip label="Clicca per modificare">
        <span onClick={handleClick} style={{ cursor: "pointer", display: "inline-block", whiteSpace: "nowrap", height: "100%", margin: "-16px -24px", padding: "16px 24px", width: "300px" }}>
          {value ? formatNumber(parseFloat(value)) : <Text as="span" fontWeight="300">Inserisci un importo</Text>}
        </span>
      </Tooltip>
    </span>
  );
}