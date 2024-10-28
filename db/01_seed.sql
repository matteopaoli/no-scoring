--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-1.pgdg120+1)
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: businessType; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."businessType" (id, name) VALUES
(3, 'Ristorazione'),
(4, 'Artigianato'),
(5, 'Hotellerie'),
(6, 'Estetica e parrucchieri'),
(7, 'E-Commerce e vendita online'),
(9, 'Farmacie'),
(10, 'Concessionari e carrozzerie'),
(11, 'Broker e prodotti assicurativi'),
(12, 'Abbigliamento e calzature'),
(13, 'Attività con servizio di consegna'),
(14, 'Società di consulenza'),
(15, 'Studi dentistici'),
(16, 'Negozi di arredamento e utensileria'),
(2, 'Generico');



--
-- Name: businessType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."businessType_id_seq"', 16, true);


--
-- PostgreSQL database dump complete
--

