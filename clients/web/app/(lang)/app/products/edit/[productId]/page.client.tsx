// "use client";

// import {
//   Box,
//   Button,
//   Text,
//   Textarea,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { useState } from "react";

// import updateProduct from '../../updateProduct.action'; // Import the edit product action
// import { useFormState } from "react-dom";
// import type Stripe from "stripe";

// import InputField from "@/app/components/fields/InputField"; // Import the InputField component

// interface CreateOrEditProductPageProps {
//   product: Stripe.Product; // Prop to receive the product data for editing
//   price: number;
// }

// export default function EditProductPage({ product, price }: CreateOrEditProductPageProps) {
//   const [errors, setErrors] = useState<Record<string, any>[]>([]);
//   const [formState, action] = useFormState(updateProduct, '');

//   // Chakra color mode
//   const textColor = useColorModeValue("navy.700", "white");
//   const brandStars = useColorModeValue("brand.500", "brand.400");

//   return (
//     <Box width={{ base: "100%", md: "500px" }}>
//       <form action={action} style={{ width: "100%" }}>
//         <input type="hidden" name="id" value={product.id} />

//         {/* Product Name */}
//         <InputField
//           id="name"
//           label="Nome Prodotto"
//           placeholder="Nome del prodotto"
//           type="text"
//           defaultValue={product.name} // Set default value for editing
//           isRequired
//           extra="*"
//           isInvalid={errors.some((e) => e.path.includes("name"))}
//         />
//         {errors
//           .filter((e) => e.path.includes("name"))
//           .map((m) => (
//             <Text key={m.message} color="red.500" fontSize="sm">
//               {m.message}
//             </Text>
//           ))}

//         {/* Description */}
//         <FormControl isInvalid={errors.some((e) => e.path.includes("description"))}>
//           <FormLabel
//             display="flex"
//             ms="4px"
//             fontSize="sm"
//             fontWeight="500"
//             color={textColor}
//             mb="8px"
//             mt="24px"
//           >
//             Descrizione
//             <Text color={brandStars}>*</Text>
//           </FormLabel>
//           <Textarea
//             isRequired={true}
//             fontSize="sm"
//             ms={{ base: "0px", md: "0px" }}
//             placeholder="Descrizione del prodotto"
//             fontWeight="500"
//             size="lg"
//             name="description"
//             defaultValue={product.description ?? ''} // Set default value for editing
//           />
//           {errors
//             .filter((e) => e.path.includes("description"))
//             .map((m) => (
//               <Text key={m.message} color="red.500" fontSize="sm">
//                 {m.message}
//               </Text>
//             ))}
//         </FormControl>

//         {/* Price */}
//         <InputField
//           id="price"
//           label="Prezzo"
//           placeholder="Prezzo"
//           type="number"
//           step=".01"
//           defaultValue={price / 100} // Set default value for editing
//           isRequired
//           extra="*"
//           isInvalid={errors.some((e) => e.path.includes("price"))}
//         />
//         {errors
//           .filter((e) => e.path.includes("price"))
//           .map((m) => (
//             <Text key={m.message} color="red.500" fontSize="sm">
//               {m.message}
//             </Text>
//           ))}

//         {/* Product Image */}
//         <InputField
//           id="image"
//           label="Immagine del Prodotto"
//           placeholder=""
//           type="file"
//           accept="image/*"
//           isInvalid={errors.some((e) => e.path.includes("image"))}
//         />
//         {errors
//           .filter((e) => e.path.includes("image"))
//           .map((m) => (
//             <Text key={m.message} color="red.500" fontSize="sm">
//               {m.message}
//             </Text>
//           ))}

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           fontSize="sm"
//           variant="brand"
//           fontWeight="500"
//           w="100%"
//           h="50"
//           mt="24px"
//         >
//           Aggiorna Prodotto
//         </Button>
//       </form>
//     </Box>
//   );
// }
