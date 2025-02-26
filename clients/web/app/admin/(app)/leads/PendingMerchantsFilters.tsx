import {
  Card,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import Select from "react-select";
import { useReducer, useCallback, useEffect } from "react";
import { debounce } from "lodash";

const statusOptions = [
  { value: "to_contact", label: "Da contattare" },
  { value: "awaiting_response", label: "In attesa di risposta" },
  { value: "appointment_set", label: "Fissato appuntamento" },
  { value: "to_cancel", label: "Da annullare" },
  { value: "history", label: "Storico" },
];

// Define the initial state
const initialState = {
  statuses: [] as { value: string; label: string }[],
  email: "",
};

// Define reducer function
function filtersReducer(
  state: typeof initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "SET_STATUSES":
      return { ...state, statuses: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    default:
      return state;
  }
}

interface FilterProps {
  onChange: (filters: { statuses: string[]; email: string }) => void;
}

export default function PendingMerchantFilters({ onChange }: FilterProps) {
  const [state, dispatch] = useReducer((state, action) => {
    const newState = filtersReducer(state, action);

    onChange({
      statuses: newState.statuses.map((status) => status.value),
      email: newState.email,
    });

    return newState;
  }, initialState);

  // Debounced function for handling email changes
  const debouncedEmailChange = useCallback(
    debounce((value: string) => {
      dispatch({ type: "SET_EMAIL", payload: value });
    }, 300),
    [] // The debounce delay is 300ms; adjust as needed
  );

  return (
    <Card p={4} mb="20px">
      <Heading as="h3" size="sm" mb="20px">
        Filtri di ricerca
      </Heading>
      <Flex flexWrap="wrap">
        <Select
          instanceId="status-select"
          isMulti
          options={statusOptions}
          value={state.statuses}
          onChange={(selected) =>
            dispatch({ type: "SET_STATUSES", payload: selected || [] })
          }
          placeholder="Filtra per stato"
          styles={{
            container: (base) => ({
              ...base,
              maxWidth: "400px",
            }),
          }}
        />

        <Input
          placeholder="Cerca indirizzo email"
          defaultValue={state.email} // Use defaultValue to avoid controlled input lag
          onChange={(e) => debouncedEmailChange(e.target.value)}
          maxW="400px"
          ms={{ md: "20px" }}
          mt={{ base: "20px", md: "0" }}
        />
      </Flex>
    </Card>
  );
}
