--
-- PostgreSQL database dump
--

\restrict HHffF7Y0wdFWLJ7c9xyHyR1rM0QQ4Sl54RIzOMkxscUdV34elvLXP9CVaBhqGB3

-- Dumped from database version 16.11 (Homebrew)
-- Dumped by pg_dump version 16.11 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Account" (
    id text NOT NULL,
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


--
-- Name: Exercise; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Exercise" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    calories double precision NOT NULL,
    duration integer,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: FoodEntry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FoodEntry" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    calories double precision NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    protein double precision
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    height double precision,
    age integer,
    lifestyle text,
    "ifType" text,
    "ifStartTime" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "milestoneStep" double precision,
    "sustainabilityMode" text,
    "targetWeightMax" double precision,
    "targetWeightMin" double precision
);


--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: WeightEntry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WeightEntry" (
    id text NOT NULL,
    "userId" text NOT NULL,
    weight double precision NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Exercise; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Exercise" (id, "userId", name, calories, duration, date, "createdAt") FROM stdin;
cmj7rbejz00058ftr4bbr86h2	cmj6f045p0000y0egt7i4n8bg	Caminata 1,5 km	70	\N	2025-12-15 21:59:00	2025-12-15 23:00:19.439
cmj7s84xq000d8ftrmyzc9546	cmj6f045p0000y0egt7i4n8bg	Caminata 2 km	110	\N	2025-12-15 23:25:00	2025-12-15 23:25:46.613
cmj969q50000932ifqsvzlpf0	cmj6f045p0000y0egt7i4n8bg	Caminata 4,5 km	210	\N	2025-12-16 22:00:00	2025-12-16 22:46:41.556
cmj9c3883000b32if18jgnsvl	cmj6f045p0000y0egt7i4n8bg	Eliptica	180	20	2025-12-17 00:00:00	2025-12-17 01:29:36.099
cmj9ccumh000d32ifi96p2k1i	cmj6f045p0000y0egt7i4n8bg	Ejercicios de Tren superior 	250	40	2025-12-17 00:30:00	2025-12-17 01:37:05.024
cmjasfldq000z32if3e62l4ok	cmj6f045p0000y0egt7i4n8bg	Caminata 7,5km	450	\N	2025-12-18 01:50:00	2025-12-18 01:54:53.047
cmjc1a6vv001d32if7vtlyi0a	cmj6f045p0000y0egt7i4n8bg	Caminata 2 km	110	\N	2025-12-18 13:49:00	2025-12-18 22:50:23.707
cmjc1cppd001f32ifi5p6di2a	cmj6f045p0000y0egt7i4n8bg	Caminata de 2,7 km con caja de 5kg	190	\N	2025-12-18 22:50:00	2025-12-18 22:52:21.409
cmjc5nqre0001dkiqx1rr68pf	cmj6f045p0000y0egt7i4n8bg	Caminata 2,3 km	130	\N	2025-12-19 00:52:00	2025-12-19 00:52:54.44
cmj6ddmfa0006tyz3qi16vtwh	cmj6f045p0000y0egt7i4n8bg	Caminata 2 km	110	\N	2025-12-14 18:42:00	2025-12-14 23:42:22.151
cmjgex5gy000n4gwm7mirvyoz	cmj6f045p0000y0egt7i4n8bg	Caminata Trabajo 4,5 km	210	\N	2025-12-20 00:22:00	2025-12-22 00:23:14.669
cmjh4nvos000r4gwm77fw5ww1	cmj6f045p0000y0egt7i4n8bg	Caminata 2 km	110	\N	2025-12-21 18:23:00	2025-12-22 12:23:52.109
cmjhe3e9t000t4gwmbgcbne0k	cmj6f045p0000y0egt7i4n8bg	Caminata 3,5 km	190	\N	2025-12-22 16:47:00	2025-12-22 16:47:52.567
cmjhw0q9c00114gwm3gcqdqnt	cmj6f045p0000y0egt7i4n8bg	Caminata 3,5 km	190	\N	2025-12-22 22:09:00	2025-12-23 01:09:41.232
cmjrr7bbk0005pdt36wdaojyd	cmj6f045p0000y0egt7i4n8bg	Caminata 3 km	165	\N	2025-12-29 22:50:00	2025-12-29 22:52:32.14
cmk2j4iyb0001nv09mdz0nor3	cmj6f045p0000y0egt7i4n8bg	Caminata 10 km	600	\N	2026-01-05 21:51:00	2026-01-06 11:51:53.075
cmk39mc3c000hnv09mikmetba	cmj6f045p0000y0egt7i4n8bg	Caminata 3,3 km	150	\N	2026-01-06 22:13:00	2026-01-07 00:13:34.004
cmk4aop2d000lnv09d7q9k26e	cmj6f045p0000y0egt7i4n8bg	Caminata 3,3 km	150	\N	2026-01-07 10:30:00	2026-01-07 17:31:09.924
cmk5xu83w000xnv09l0tfcop0	cmj6f045p0000y0egt7i4n8bg	Caminata 3,1 km	140	\N	2026-01-08 21:04:00	2026-01-08 21:07:04.948
cmk638u47000znv09ab2qstom	cmj6f045p0000y0egt7i4n8bg	Caminata 3,3 km	150	\N	2026-01-08 23:37:00	2026-01-08 23:38:25
\.


--
-- Data for Name: FoodEntry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FoodEntry" (id, "userId", name, calories, date, "createdAt", protein) FROM stdin;
cmj6dfemm0008tyz3959gpdy8	cmj6f045p0000y0egt7i4n8bg	Ensalada de Kale, Palta y Tomate	430	2025-12-14 23:42:00	2025-12-14 23:43:45.359	\N
cmj6dgw5a000atyz34aekirqm	cmj6f045p0000y0egt7i4n8bg	Omelette con 3 huevos, 4 champignones y 1/4 de cebolla grande	290	2025-12-14 23:43:00	2025-12-14 23:44:54.718	\N
cmj7r61ey00018ftr6vmc2d4i	cmj6f045p0000y0egt7i4n8bg	Bolulac	725	2025-12-15 17:30:00	2025-12-15 22:56:09.129	\N
cmj7r7lwe00038ftrja48hobk	cmj6f045p0000y0egt7i4n8bg	2 medialunas de manteca	360	2025-12-16 01:30:00	2025-12-15 22:57:22.334	\N
cmj7rcsxc00078ftr84zd2213	cmj6f045p0000y0egt7i4n8bg	Mazapan de La Rosa	140	2025-12-15 19:00:00	2025-12-15 23:01:24.72	\N
cmj7rdte800098ftro51l64i9	cmj6f045p0000y0egt7i4n8bg	Picafresa	35	2025-12-15 19:01:00	2025-12-15 23:02:11.984	\N
cmj9603aa000332ifhjfgo8i2	cmj6f045p0000y0egt7i4n8bg	Mini Oblea	38	2025-12-16 18:00:00	2025-12-16 22:39:12.034	\N
cmj960ddo000532iflsjbzdk9	cmj6f045p0000y0egt7i4n8bg	Borrachito	38	2025-12-16 18:10:00	2025-12-16 22:39:25.116	\N
cmj96172f000732ifoipgdts3	cmj6f045p0000y0egt7i4n8bg	Ensalada con Mango, Palta, Salmon, Rucula, Cous Cous y aderezo de dijon	450	2025-12-16 17:30:00	2025-12-16 22:40:03.591	\N
cmj9e7gc3000f32iff1hu8zeq	cmj6f045p0000y0egt7i4n8bg	Bife de chorizo, pocas papas fritas, rucula con aceite de oliva	730	2025-12-17 02:28:00	2025-12-17 02:28:52.467	\N
cmjas55qe000j32if4k3vjxvi	cmj6f045p0000y0egt7i4n8bg	Bombon con pitanga	50	2025-12-17 15:46:00	2025-12-18 01:46:46.213	\N
cmjas5mka000l32ifq2lm207z	cmj6f045p0000y0egt7i4n8bg	Medialuna de grasa	180	2025-12-17 16:46:00	2025-12-18 01:47:08.026	\N
cmjas5vqz000n32if3hrw3i86	cmj6f045p0000y0egt7i4n8bg	Pacoquita	100	2025-12-17 16:47:00	2025-12-18 01:47:19.931	\N
cmjas62rp000p32ifrh3krxwg	cmj6f045p0000y0egt7i4n8bg	2 Empanadas	460	2025-12-18 01:47:00	2025-12-18 01:47:29.029	\N
cmjas7lej000t32if9knm3zfc	cmj6f045p0000y0egt7i4n8bg	2 Bastones de Muzzarella	175	2025-12-18 01:48:00	2025-12-18 01:48:39.835	\N
cmjas6sup000r32ifk80wg3r4	cmj6f045p0000y0egt7i4n8bg	2 Shots de Mezcal	95	2025-12-18 01:47:00	2025-12-18 01:48:02.833	\N
cmjas9ip9000x32ifhy1sx0m8	cmj6f045p0000y0egt7i4n8bg	Papas fritas	450	2025-12-18 01:49:00	2025-12-18 01:50:09.645	\N
cmjas88vu000v32ifvk4u1j9a	cmj6f045p0000y0egt7i4n8bg	2 vasos de Cerveza	280	2025-12-18 01:48:00	2025-12-18 01:49:10.266	\N
cmjc180v1001132if1pqa1chf	cmj6f045p0000y0egt7i4n8bg	2 Medialunas	380	2025-12-18 14:00:00	2025-12-18 22:48:42.588	\N
cmjc189v8001332ifjg6hv6f5	cmj6f045p0000y0egt7i4n8bg	Sandwich de Miga	280	2025-12-18 16:48:00	2025-12-18 22:48:54.26	\N
cmjc18k6l001532ifi6gwycio	cmj6f045p0000y0egt7i4n8bg	Sandwich de Pernil	150	2025-12-18 16:48:00	2025-12-18 22:49:07.63	\N
cmjc18tkg001732if0bfj5u15	cmj6f045p0000y0egt7i4n8bg	Vasito de Coca Cola	70	2025-12-18 16:49:00	2025-12-18 22:49:19.792	\N
cmjc192zn001932if3pr5xyye	cmj6f045p0000y0egt7i4n8bg	Queso Fresco con Dulce de Batata	200	2025-12-18 16:49:00	2025-12-18 22:49:32.003	\N
cmjc19hp6001b32ifiujkyux0	cmj6f045p0000y0egt7i4n8bg	Borrachito	38	2025-12-18 16:49:00	2025-12-18 22:49:51.066	\N
cmjc7bty30001zic9dvg7i38c	cmj6f045p0000y0egt7i4n8bg	Carne y papas	160	2025-12-19 01:39:00	2025-12-19 01:39:37.936	\N
cmjgekc9r00014gwm44n6v2c1	cmj6f045p0000y0egt7i4n8bg	2 Medialunas	380	2025-12-20 00:12:00	2025-12-22 00:13:16.956	\N
cmjgel4fx00034gwmkl24sk7q	cmj6f045p0000y0egt7i4n8bg	2 Sanguches de jamon y queso	450	2025-12-20 00:13:00	2025-12-22 00:13:53.469	\N
cmjgelwtn00054gwm8yaduhjn	cmj6f045p0000y0egt7i4n8bg	1 Vaso de coca cola	105	2025-12-20 00:13:00	2025-12-22 00:14:30.251	\N
cmjgemtx000074gwmxeufpr9r	cmj6f045p0000y0egt7i4n8bg	Picada	500	2025-12-20 00:14:00	2025-12-22 00:15:13.14	\N
cmjgenmhu00094gwmmwnyi2ud	cmj6f045p0000y0egt7i4n8bg	Vermut y Cerveza	540	2025-12-20 00:15:00	2025-12-22 00:15:50.178	\N
cmjgeovaj000b4gwm78c7c1x0	cmj6f045p0000y0egt7i4n8bg	Tostado de Jamon y Queso	475	2025-12-21 00:15:00	2025-12-22 00:16:48.235	\N
cmjgepekk000d4gwmbi8yiqyu	cmj6f045p0000y0egt7i4n8bg	Papas Fritas	280	2025-12-21 00:16:00	2025-12-22 00:17:13.22	\N
cmjgesc8v000l4gwm3b3g72e7	cmj6f045p0000y0egt7i4n8bg	Sandwich de masa madre, 4 rodajas de tomate, dos fetas de jamon cocido natural y 4 boconchinos chicos de muzzarella, con una cucharada de aceite de oliva y rúcula	600	2025-12-22 00:18:00	2025-12-22 00:19:30.175	\N
cmjgeq7yh000f4gwmylyk9mb0	cmj6f045p0000y0egt7i4n8bg	2 Choripanes	900	2025-12-21 00:17:00	2025-12-22 00:17:51.294	\N
cmjgeqntz000h4gwm5afs5gjh	cmj6f045p0000y0egt7i4n8bg	Cerveza y Vermuth	440	2025-12-21 00:17:00	2025-12-22 00:18:11.879	\N
cmjgeqxio000j4gwm375nqa6d	cmj6f045p0000y0egt7i4n8bg	Tiramisu	300	2025-12-21 00:18:00	2025-12-22 00:18:24.432	\N
cmjh4lm8v000p4gwm8ug5utn5	cmj6f045p0000y0egt7i4n8bg	15 Piezas de Sushi	700	2025-12-22 02:03:00	2025-12-22 12:22:06.558	\N
cmjhe3qjo000v4gwmejndq2ri	cmj6f045p0000y0egt7i4n8bg	Sandwich de masa madre, 4 rodajas de tomate, dos fetas de jamon cocido natural y 4 boconchinos chicos de muzzarella, con una cucharada de aceite de oliva y rúcula	600	2025-12-22 16:47:00	2025-12-22 16:48:08.484	\N
cmjhfl9rw000x4gwmqzhh60n2	cmj6f045p0000y0egt7i4n8bg	3 Boconchinos	150	2025-12-22 17:29:00	2025-12-22 17:29:46.172	\N
cmjhkubyw000z4gwm03l0s6j2	cmj6f045p0000y0egt7i4n8bg	Tabletita de DDL	88	2025-12-22 19:56:00	2025-12-22 19:56:46.992	\N
cmjhw19b800134gwmx95bg5n4	cmj6f045p0000y0egt7i4n8bg	Cafe con leche	120	2025-12-22 22:09:00	2025-12-23 01:10:05.924	\N
cmjhydzrd00154gwme6mbm6b9	cmj6f045p0000y0egt7i4n8bg	Trucha con espárragos	300	2025-12-23 02:15:00	2025-12-23 02:15:59.291	\N
cmjisr9q700194gwm2usw721i	cmj6f045p0000y0egt7i4n8bg	Omelette con 2 huevos, 4 champignones y una tostada	280	2025-12-23 16:25:00	2025-12-23 16:26:07.231	\N
cmjk0bha0001b4gwm4zdrbk8m	cmj6f045p0000y0egt7i4n8bg	Cena 	1000	2025-12-24 01:02:00	2025-12-24 12:45:33.621	\N
cmjrm49oq0001pdt3hv9rpquq	cmj6f045p0000y0egt7i4n8bg	2 Huevos	340	2025-12-29 17:52:00	2025-12-29 20:30:11.975	\N
cmjrm56ln0003pdt351uqv3ta	cmj6f045p0000y0egt7i4n8bg	Pan dulce 	550	2025-12-29 20:30:00	2025-12-29 20:30:54.635	\N
cmk2j608t0005nv095tb4zbia	cmj6f045p0000y0egt7i4n8bg	Sandwich de palta, 4 rodajas de tomate y 2 huevos 	500	2026-01-05 16:52:00	2026-01-06 11:53:02.141	\N
cmk2j884e0007nv0920a2ackp	cmj6f045p0000y0egt7i4n8bg	Bife de chorizo, ensalada y pan	900	2026-01-06 00:01:00	2026-01-06 11:54:45.652	\N
cmk30iowf0009nv099o7zqhb9	cmj6f045p0000y0egt7i4n8bg	Mantecol	165	2026-01-06 19:58:00	2026-01-06 19:58:47.437	\N
cmk30js7a000bnv09lvw90zbl	cmj6f045p0000y0egt7i4n8bg	Yogur sin azucar con un poco de mermelada de frutilla, unas frutillas, un poco de manzana verde, un poco de pera y un poco de banana	250	2026-01-06 19:58:00	2026-01-06 19:59:38.374	\N
cmk30ktpg000dnv097oz8iybr	cmj6f045p0000y0egt7i4n8bg	Latte doble	140	2026-01-06 19:59:00	2026-01-06 20:00:26.98	\N
cmk30mlhe000fnv09tbaocom6	cmj6f045p0000y0egt7i4n8bg	Queso duro	120	2026-01-06 20:01:00	2026-01-06 20:01:49.633	\N
cmk3eygfk000jnv09zvuz4rs1	cmj6f045p0000y0egt7i4n8bg	Pechuga de pollo con fideos	1000	2026-01-07 02:42:00	2026-01-07 02:42:57.584	\N
cmk4apeuc000nnv092ug1p7b5	cmj6f045p0000y0egt7i4n8bg	Latte doble	140	2026-01-07 11:50:00	2026-01-07 17:31:43.333	\N
cmk4apu7y000pnv09htkbop3m	cmj6f045p0000y0egt7i4n8bg	Omelette con 2 huevos y una pechuga de pollo	590	2026-01-07 17:31:00	2026-01-07 17:32:03.262	\N
cmk4bl1fe000rnv09zytyer79	cmj6f045p0000y0egt7i4n8bg	Durazno	60	2026-01-07 17:55:00	2026-01-07 17:56:18.925	\N
cmk4bmfza000tnv09aebut1t6	cmj6f045p0000y0egt7i4n8bg	Cafe con leche	33	2026-01-07 17:56:00	2026-01-07 17:57:24.451	\N
cmk63a8hy0011nv099ehyrv4z	cmj6f045p0000y0egt7i4n8bg	Cafe con leche	35	2026-01-08 23:38:00	2026-01-08 23:39:30.309	\N
cmk66uh2w0013nv09tj4dt5gb	cmj6f045p0000y0egt7i4n8bg	2 bifes de cuadril con ensalada de tomate y lechuga	500	2026-01-09 01:18:00	2026-01-09 01:19:13.39	\N
cmk754v050003u2iovjnoisdj	cmj6f045p0000y0egt7i4n8bg	Omelette con 2 huevos y 50 gramos de queso duro, hecho en una sarten con aceite en spray.	350	2026-01-09 17:17:00	2026-01-09 17:19:04.949	\N
cmk755w700005u2io4g9yp2t8	cmj6f045p0000y0egt7i4n8bg	30g de frutas secas: pasas, almendras y castañas.	120	2026-01-09 17:19:00	2026-01-09 17:19:53.148	\N
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, name, height, age, lifestyle, "ifType", "ifStartTime", "createdAt", "updatedAt", "milestoneStep", "sustainabilityMode", "targetWeightMax", "targetWeightMin") FROM stdin;
cmj6f045p0000y0egt7i4n8bg	guido.glarosa@gmail.com	$2b$10$BseSycFU3dM8c/8kaWYISufXkWPBLewdSQwgsg5n0QPP1sGvf1zBy	Guido	162	32	moderate	16:8	14:00	2025-12-15 00:27:51.182	2026-01-09 03:15:41.319	1	sustainable	66	62
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: WeightEntry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WeightEntry" (id, "userId", weight, date, "createdAt") FROM stdin;
cmj6dcvn60002tyz3txdrh95j	cmj6f045p0000y0egt7i4n8bg	71.4	2025-12-14 23:41:00	2025-12-14 23:41:47.442
cmj6dd8rt0004tyz3vlvs9sf7	cmj6f045p0000y0egt7i4n8bg	72.6	2025-11-20 23:41:00	2025-12-14 23:42:04.458
cmj7rej6r000b8ftrtncs0ybo	cmj6f045p0000y0egt7i4n8bg	71.6	2025-12-15 23:02:00	2025-12-15 23:02:45.411
cmj8gms68000132ifylgr9yha	cmj6f045p0000y0egt7i4n8bg	71.2	2025-12-16 03:00:00	2025-12-16 10:49:00.704
cmj9v7fzl000h32ifzwqbagcs	cmj6f045p0000y0egt7i4n8bg	70.8	2025-12-17 03:00:00	2025-12-17 10:24:45.473
cmjcs5b960003zic9ndt2buzl	cmj6f045p0000y0egt7i4n8bg	69	2025-12-19 03:00:00	2025-12-19 11:22:25.722
cmjiitppq00174gwms4wrlf0c	cmj6f045p0000y0egt7i4n8bg	69.5	2025-12-23 03:00:00	2025-12-23 11:48:05.102
cmjrr7mg90007pdt3vcf2eita	cmj6f045p0000y0egt7i4n8bg	70	2025-12-29 03:00:00	2025-12-29 22:52:46.57
cmk2j4p890003nv09wculhhfn	cmj6f045p0000y0egt7i4n8bg	70	2026-01-06 03:00:00	2026-01-06 11:52:01.209
cmk4bnnbd000vnv093tu0eshi	cmj6f045p0000y0egt7i4n8bg	70	2026-01-07 03:00:00	2026-01-07 17:58:20.617
cmk6uj82q0001u2iog30lh0si	cmj6f045p0000y0egt7i4n8bg	69.5	2026-01-09 03:00:00	2026-01-09 12:22:19.297
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Exercise Exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY (id);


--
-- Name: FoodEntry FoodEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodEntry"
    ADD CONSTRAINT "FoodEntry_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WeightEntry WeightEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WeightEntry"
    ADD CONSTRAINT "WeightEntry_pkey" PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exercise Exercise_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FoodEntry FoodEntry_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodEntry"
    ADD CONSTRAINT "FoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WeightEntry WeightEntry_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WeightEntry"
    ADD CONSTRAINT "WeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict HHffF7Y0wdFWLJ7c9xyHyR1rM0QQ4Sl54RIzOMkxscUdV34elvLXP9CVaBhqGB3

