"use client";

import React from "react";
import {
  Box,
  Heading,
  Text,
  IconButton,
  useBreakpointValue,
  Link,
  UnorderedList,
  ListItem,
  Flex,
  OrderedList,
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 10000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Carousel() {
  const [slider, setSlider] = React.useState<Slider | null>(null);

  const slideProps = {
    minH: "280px",
    padding: "10",
    backgroundColor: "white",
    borderRadius: "md",
    textAlign: "left",
    alignItems: "center",
  };

  return (
    <Box
      position={"relative"}
      width={"full"}
      overflow={"hidden"}
      boxShadow="base"
      lineHeight={2}
      pb="30px"
      mb="30px"
    >
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />

      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading>🎉 Benvenuto su Paytomorrow!</Heading>
              <Text>
                Siamo felici di averti con noi! Scopri subito come il nostro
                sistema Buy Now, Pay Later (BNPL) può aiutarti a rendere più
                flessibili i pagamenti per i tuoi clienti, aumentando le tue
                vendite e migliorando la loro esperienza di acquisto.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading>Cos'è un link di pagamento editabile?</Heading>
              <Text>
                È un link che puoi inviare ai clienti per permettere loro di
                pagare una cifra specifica. Ecco come funziona in modo semplice:
              </Text>
              <OrderedList>
                <ListItem>
                  <b>Importo personalizzabile</b>: chi riceve il link può
                  inserire l’importo da pagare.
                </ListItem>
                <ListItem>
                  <b>Facilità d'uso</b>: puoi riutilizzare lo stesso link per
                  diversi clienti o per acquisti futuri.
                </ListItem>
                <ListItem>
                  <b>Flessibilità</b>: utile per vendere prodotti con prezzi
                  variabili o offrire una soluzione di pagamento più flessibile.
                </ListItem>
              </OrderedList>
            </Box>
          </Flex>
        </Box>

        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading>
                Scopri la comodità del link di pagamento editabile di
                Paytomorrow!
              </Heading>
              <UnorderedList listStyleType="none" mx="0">
                <ListItem>
                  💰 <b>Personalizza l’importo</b> – Invia il link e lascia che
                  i tuoi clienti inseriscano facilmente la cifra da pagare. Un
                  acquisto singolo o multiplo? Nessun problema! I clienti
                  possono sommare i prodotti e pagare tutto in una volta.
                </ListItem>
                <ListItem>
                  ♻️ <b>Usalo più volte</b> – Dimentica la creazione di link
                  ogni volta: questo link è flessibile e riutilizzabile!
                  Perfetto per clienti ricorrenti o per chi offre servizi con
                  prezzi variabili.
                </ListItem>
              </UnorderedList>
              <Text>
                <b>Inizia subito</b> a semplificare i tuoi pagamenti con
                Paytomorrow e offri ai tuoi clienti un'esperienza di pagamento
                semplice e veloce!
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading size="xl">
                📲 Semplifica ancora di più con il QR Code di Paytomorrow!
              </Heading>
              <Text as="div">
                Il QR Code è la versione digitale del tuo link di pagamento
                editabile: ha le stesse identiche funzioni e flessibilità! Basta
                mostrarlo al cliente e farglielo inquadrare con lo smartphone.
                Il cliente potrà inserire l'importo, sommare eventuali prodotti,
                e pagare in pochi secondi!
                <b>🚀 Come funziona?</b>
                <OrderedList>
                  <ListItem>Genera il QR Code del link di pagamento.</ListItem>
                  <ListItem>Mostralo al cliente.</ListItem>
                  <ListItem>
                    Il cliente inquadra, inserisce la cifra e paga al volo!
                  </ListItem>
                </OrderedList>
                <b>Provalo ora</b> e rendi i tuoi pagamenti ancora più smart e
                immediati con il QR Code di Paytomorrow!
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading size="xl">
                Scarica le immagini QR Code per la tua cassa con Paytomorrow!
              </Heading>
              <Text as="div">
                Abbiamo creato le versioni del QR Code in{" "}
                <b>diverse dimensioni</b> pensate apposta per la tua postazione
                cassa. Scegli il formato che meglio si adatta al tuo spazio,
                scaricalo e stampalo: sarà pronto da usare direttamente al
                banco!
                <b>🚀 Come funziona?</b>
                <UnorderedList listStyleType="none" mx="0">
                  <ListItem>
                    📏 <b>Adattabilità perfetta</b> – Le immagini QR Code sono
                    disponibili in vari formati, ideali per essere ben visibili
                    sulla tua cassa, indipendentemente dalle dimensioni della
                    tua postazione.
                  </ListItem>
                  <ListItem>
                    📲 <b>Stessa praticità e funzionalità</b> – Come il link di
                    pagamento, anche il QR Code permette ai clienti di inserire
                    l’importo e pagare in un attimo.
                  </ListItem>
                </UnorderedList>
                <b>Scarica e stampa ora</b> le immagini del QR Code Paytmorrow e
                porta la semplicità dei pagamenti digitali direttamente alla tua
                cassa!
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading>🎥 Vuoi vedere Paytomorrow in azione?</Heading>
              <Text>
                Dai un’occhiata ai nostri video di spiegazione e agli ultimi
                aggiornamenti sul nostro canale YouTube:{" "}
                <Link href="#" isExternal textDecoration="underline">
                  Legconsulenze
                </Link>
                .
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box {...slideProps}>
          <Flex alignItems="center" h="100%">
            <Box>
              <Heading>📧 Hai domande?</Heading>
              <Text>
                Scrivici una mail a{" "}
                <Link
                  href="mailto:info@paytomorrow.it"
                  textDecoration="underline"
                >
                  <b>info@paytomorrow.it</b>
                </Link>{" "}
                o contattaci su WhatsApp al <b>+39 351 475 3825</b>! Siamo qui
                per aiutarti a ogni passo.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Slider>
    </Box>
  );
}
