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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public.account (
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.account OWNER TO noscoring;

--
-- Name: authenticator; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public.authenticator (
    "credentialID" text NOT NULL,
    "userId" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "credentialPublicKey" text NOT NULL,
    counter integer NOT NULL,
    "credentialDeviceType" text NOT NULL,
    "credentialBackedUp" boolean NOT NULL,
    transports text
);


ALTER TABLE public.authenticator OWNER TO noscoring;

--
-- Name: businessType; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public."businessType" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."businessType" OWNER TO noscoring;

--
-- Name: businessType_id_seq; Type: SEQUENCE; Schema: public; Owner: noscoring
--

CREATE SEQUENCE public."businessType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."businessType_id_seq" OWNER TO noscoring;

--
-- Name: businessType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noscoring
--

ALTER SEQUENCE public."businessType_id_seq" OWNED BY public."businessType".id;


--
-- Name: commissionRules; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public."commissionRules" (
    id integer NOT NULL,
    "businessTypeId" integer NOT NULL,
    "minAmount" numeric(10,2) NOT NULL,
    "maxAmount" numeric(10,2),
    "commissionType" text NOT NULL,
    "commissionValue" numeric(10,2) NOT NULL
);


ALTER TABLE public."commissionRules" OWNER TO noscoring;

--
-- Name: commissionRules_id_seq; Type: SEQUENCE; Schema: public; Owner: noscoring
--

CREATE SEQUENCE public."commissionRules_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."commissionRules_id_seq" OWNER TO noscoring;

--
-- Name: commissionRules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noscoring
--

ALTER SEQUENCE public."commissionRules_id_seq" OWNED BY public."commissionRules".id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public.product (
    id text NOT NULL,
    qrcode text,
    "tagImage" text,
    "paymentLinkId" text,
    "userId" text NOT NULL
);


ALTER TABLE public.product OWNER TO noscoring;

--
-- Name: sale; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public.sale (
    id text NOT NULL,
    "storeId" text NOT NULL,
    amount numeric(12,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "stripePaymentIntentId" text NOT NULL,
    "legCommission" numeric(12,2) NOT NULL,
    "firstLevelPartnerCommission" numeric(12,2) NOT NULL,
    "secondLevelPartnerCommission" numeric(12,2) NOT NULL
);


ALTER TABLE public.sale OWNER TO noscoring;

--
-- Name: session; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public.session (
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO noscoring;

--
-- Name: store; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public.store (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    image text,
    "partnerId" text
);


ALTER TABLE public.store OWNER TO noscoring;

--
-- Name: user; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public."user" (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" text,
    email text,
    "createdAt" timestamp without time zone DEFAULT now(),
    image text,
    password text,
    "stripeSecretKey" text,
    role text NOT NULL,
    "businessTypeId" integer,
    "businessName" text,
    "onboardingCompleted" boolean DEFAULT false,
    "lastName" text,
    "stripeUserId" text,
    "genericProductId" text,
    "genericProductSmallImage" text,
    "genericProductLargeImage" text,
    "stripeLegAccountId" text,
    "tosAccepted" boolean DEFAULT false NOT NULL,
    "tosAcceptedAt" timestamp without time zone,
    "partnerId" text,
    provincia text
);


ALTER TABLE public."user" OWNER TO noscoring;

--
-- Name: userStoreRole; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public."userStoreRole" (
    "userId" text NOT NULL,
    "storeId" text NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public."userStoreRole" OWNER TO noscoring;

--
-- Name: verificationToken; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public."verificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp without time zone NOT NULL
);


ALTER TABLE public."verificationToken" OWNER TO noscoring;

--
-- Name: webhookSecret; Type: TABLE; Schema: public; Owner: noscoring
--

CREATE TABLE public."webhookSecret" (
    "accountId" text,
    secret text
);


ALTER TABLE public."webhookSecret" OWNER TO noscoring;

--
-- Name: businessType id; Type: DEFAULT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."businessType" ALTER COLUMN id SET DEFAULT nextval('public."businessType_id_seq"'::regclass);


--
-- Name: commissionRules id; Type: DEFAULT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."commissionRules" ALTER COLUMN id SET DEFAULT nextval('public."commissionRules_id_seq"'::regclass);


--
-- Name: account account_provider_providerAccountId_pk; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY (provider, "providerAccountId");


--
-- Name: authenticator authenticator_credentialID_unique; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.authenticator
    ADD CONSTRAINT "authenticator_credentialID_unique" UNIQUE ("credentialID");


--
-- Name: authenticator authenticator_userId_credentialID_pk; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.authenticator
    ADD CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY ("userId", "credentialID");


--
-- Name: businessType businessType_pkey; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."businessType"
    ADD CONSTRAINT "businessType_pkey" PRIMARY KEY (id);


--
-- Name: commissionRules commissionRules_pkey; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."commissionRules"
    ADD CONSTRAINT "commissionRules_pkey" PRIMARY KEY (id);


--
-- Name: sale sale_pkey; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT sale_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY ("sessionToken");


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verificationToken verificationToken_identifier_token_pk; Type: CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."verificationToken"
    ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY (identifier, token);


--
-- Name: account account_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: authenticator authenticator_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.authenticator
    ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: commissionRules commissionRules_businessTypeId_businessType_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."commissionRules"
    ADD CONSTRAINT "commissionRules_businessTypeId_businessType_id_fk" FOREIGN KEY ("businessTypeId") REFERENCES public."businessType"(id);


--
-- Name: product product_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "product_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: sale sale_storeId_store_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.sale
    ADD CONSTRAINT "sale_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES public.store(id);


--
-- Name: session session_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: store store_partnerId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT "store_partnerId_user_id_fk" FOREIGN KEY ("partnerId") REFERENCES public."user"(id);


--
-- Name: userStoreRole userStoreRole_storeId_store_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."userStoreRole"
    ADD CONSTRAINT "userStoreRole_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES public.store(id);


--
-- Name: userStoreRole userStoreRole_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."userStoreRole"
    ADD CONSTRAINT "userStoreRole_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: user user_businessTypeId_businessType_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_businessTypeId_businessType_id_fk" FOREIGN KEY ("businessTypeId") REFERENCES public."businessType"(id);


--
-- Name: user user_partnerId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: noscoring
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_partnerId_user_id_fk" FOREIGN KEY ("partnerId") REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

