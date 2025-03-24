import {
  Card,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useReducer, useCallback } from "react";
import { debounce } from "lodash";

// Define the initial state
const initialState = {
  text: "",
};

// Define reducer function
function filtersReducer(
  state: typeof initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, text: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface FilterProps {
  onChange: (filters: { text: string }) => void;
}

export default function SubscriptionsFilters({ onChange }: FilterProps) {
  const [state, dispatch] = useReducer((state, action) => {
    const newState = filtersReducer(state, action);
    onChange({
      text: newState.text,
    });

    return newState;
  }, initialState);

  // Debounced function for handling email changes
  const debouncedTextChange = useCallback(
    debounce((value: string) => {
      dispatch({ type: "SET_TEXT", payload: value });
    }, 300),
    [] // The debounce delay is 300ms; adjust as needed
  );

  return (
    <Card p={4} mb="20px">
      <Flex flexWrap="wrap">
        <Input
          placeholder="Cerca..."
          defaultValue={state.text}
          onChange={(e) => debouncedTextChange(e.target.value)}
          maxW="400px"
          ms={{ md: "20px" }}
          mt={{ base: "20px", md: "0" }}
        />
      </Flex>
    </Card>
  );
}
