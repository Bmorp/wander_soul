// Photographs for every day (or stop) of every itinerary, hotlinked from Unsplash
// (free licence). Each picture was checked by eye and, where Unsplash records one,
// against its location, so the caption names the place it really shows.
// Ids map to https://images.unsplash.com/<id>. Departure days carry none.

const P = (id, alt, caption) => ({ id, alt, caption });

const delhi = [
  P('photo-1587474260584-136574528ed5', 'India Gate under a pink and violet evening sky', 'India Gate at dusk'),
  P('photo-1685790582503-1b2762d95407', 'The red sandstone walls and domed pavilions of the Red Fort', 'The Red Fort'),
  P('photo-1748500192752-6f3f441c2a51', 'The fluted tower of the Qutub Minar above green lawns', 'Qutub Minar'),
  P('photo-1655867864435-7be2bf5b3f66', 'A narrow lane of shops and signboards in Old Delhi', 'Paranthe Wali Gali, Old Delhi'),
];

const agra = [
  P('photo-1587135941948-670b381f08ce', 'The Taj Mahal under a warm evening sky', 'The Taj Mahal'),
  P('photo-1548013146-72479768bada', 'The Taj Mahal framed by the arch of its great gate', 'Through the great gate'),
  P('photo-1591018653367-9c01498b3320', 'The red sandstone walls and gateway of Agra Fort', 'Agra Fort'),
];

const jaipur = [
  P('photo-1650530777057-3a7dbc24bf6c', 'The pink sandstone façade of Hawa Mahal and its hundreds of windows', 'Hawa Mahal'),
  P('photo-1649073868642-bcbbd06239d8', 'Elephants climbing the ramparts of Amber Fort', 'Amber Fort'),
  P('photo-1716534134003-ba47907e119b', 'A painted peacock doorway in a courtyard of the City Palace', 'The City Palace'),
];

const varanasi = [
  P('photo-1706186839147-0d708602587b', 'Boats on the Ganges below the ghats in morning light', 'The ghats from the river'),
  P('photo-1762930013787-06fa9ee78da7', 'Priests raising brass lamps during the evening aarti', 'The Ganga Aarti'),
  P('photo-1571536802807-30451e3955d8', 'Rowing boats moored on the Ganges at dusk', 'Boats on the Ganges'),
];

const chennai = [
  P('photo-1724992609079-75164f1ba2dd', 'The long sweep of Marina Beach, seen from above', 'Marina Beach'),
  P('photo-1616843413587-9e3a37f7bbd8', 'A temple tower covered in painted sculpture against a blue sky', 'A temple tower in Chennai'),
  P('photo-1639719037999-721565f23c4d', 'A temple tower glimpsed through incense smoke', 'Incense at a Mylapore temple'),
];

const mahabalipuram = [
  P('photo-1676465997765-4e37e9da8cde', 'The twin towers of the Shore Temple beside the sea', 'The Shore Temple'),
  P('photo-1640715751438-7120b3019712', 'Elephants and figures carved into a granite rock face', 'Carvings in the rock'),
];

const pondicherry = [
  P('photo-1787370241526-18b515332c6b', 'A red café with white trim on a French Quarter street', 'The French Quarter'),
  P('photo-1677951221673-09be408d2ddf', 'A red scooter parked against a yellow colonial wall', 'The colours of White Town'),
];

const madurai = [
  P('photo-1692173248120-59547c3d4653', 'A towering gopuram covered in painted figures', 'Meenakshi Amman Temple'),
  P('photo-1572146462570-2129a547e6dd', 'A temple tank and colonnade below a gopuram', 'The temple tank'),
];

const munnar = [
  P('photo-1628918098760-471c0fad230c', 'A road winding through tea estates, seen from above', 'The road through the tea estates'),
  P('photo-1730351111586-1c98c8049f6f', 'Tea pickers working among rows of tea bushes', 'Tea pickers at work'),
  P('photo-1719831738921-972e0ec76337', 'Tea gardens below a cloud-capped hill', 'Lockhart tea estate'),
];

const thekkady = [
  P('photo-1765635311503-c314839cbcdf', 'Bare tree trunks rising from a still lake under forested hills', 'Periyar Lake'),
  P('photo-1719111129504-ad9fc0094e12', 'A cormorant perched on a stump in the lake', 'Birdlife on the lake'),
];

const alleppey = [
  P('photo-1593693411515-c20261bcad6e', 'A thatched houseboat on palm-lined backwaters', 'A houseboat on the backwaters'),
  P('photo-1704365159747-1f7b8913044f', 'Boats on a narrow canal between coconut palms, from above', 'The canals from above'),
  P('photo-1593693401060-9fc28cf9e368', 'A houseboat moored beside green palms', 'Moored for the night'),
];

const kochi = [
  P('photo-1714931862306-7abe321b6b5f', 'Chinese fishing nets silhouetted against the sunset', 'The Chinese fishing nets'),
  P('photo-1731436137440-ac26f58b0c47', 'A painted mural across the front of an old house', 'Street art in Fort Kochi'),
];

const srinagar = [
  P('photo-1564329494258-3f72215ba175', 'A shikara crossing still, blue Dal Lake below the mountains', 'Dal Lake'),
  P('photo-1685716271205-83a5ac2ba63b', 'Brightly painted shikaras moored on the lake', 'Shikaras on Dal Lake'),
  P('photo-1662887815741-13c6f5d45450', 'A boatman paddling across a lake at sunset', 'Evening on the lake'),
];

const gulmarg = [
  P('photo-1568889753852-196c487a536e', 'A red Gondola cabin above snowy slopes', 'The Gulmarg Gondola'),
  P('photo-1721471845986-22e684c1202a', 'A skier coming down a snow slope below the peaks', 'On the snow at Gulmarg'),
  P('photo-1620293967466-36d1a62e353d', 'Snowfields and pine trees in winter', 'Gulmarg in winter'),
];

const pahalgam = [
  P('photo-1646204892016-711ed35535ec', 'A green meadow with a wooden house below forested mountains', 'Aru Valley'),
  P('photo-1695105824282-ad667547fea9', 'A clear river running through a pine forest', 'The Lidder River'),
];

const goaArrival = [
  P('photo-1597820334272-af87b2d917c1', 'Beach shacks and umbrellas along a busy beach', 'Calangute Beach'),
  P('photo-1757702244726-00198554c4a0', 'Golden sand, blue sea and a green headland', 'Baga Beach'),
];

const southGoa = [
  P('photo-1702799464761-29b1200c9549', 'The carved laterite façade of the Basilica of Bom Jesus', 'Basilica of Bom Jesus'),
  P('photo-1702799464758-4ca776eb0d7f', 'The white façade and bell tower of Se Cathedral', 'Se Cathedral'),
  P('photo-1641874308359-4fd2482395d9', 'A viewing pavilion on a rocky headland above the sea', 'Dona Paula View Point'),
];

const northGoa = [
  P('photo-1605591514039-5f8cdda13287', 'The old lighthouse on the ramparts of Fort Aguada', 'Fort Aguada'),
  P('photo-1775126679575-062c292dfb13', 'Cliffs and beach in the evening light', 'Vagator at sunset'),
  P('photo-1583727638625-8ab3ee2b8a25', 'Wooden loungers under thatched shacks on the sand', 'Little Vagator Beach'),
];

const shimla = [
  P('photo-1652448987705-8259d6b73dca', 'Christ Church lit up in the evening above the crowds on the Ridge', 'Christ Church on the Ridge'),
  P('photo-1610178008162-a08e088e8e4d', 'The open square of the Ridge with the national flag flying', 'The Ridge'),
  P('photo-1597074866923-dc0589150358', 'Shimla spread across a hillside under a blue sky', 'Shimla across the hills'),
];

const kufri = [
  P('photo-1585237758175-d4ce9cc8ca97', 'Snow-dusted pine forest on a mountain slope', 'Snow in the pines'),
  P('photo-1627880556981-e088653665ca', 'Rolling hills with patches of snow under a pale sky', 'The hills at Kufri'),
];

const manali = [
  P('photo-1590265788376-5d99eb11976e', 'The wooden, pagoda-roofed Hadimba Temple among tall cedars', 'Hadimba Temple'),
  P('photo-1571677465484-2dd540924245', 'Wooden cafés lit up along a lane at dusk', 'Manali at dusk'),
  P('photo-1606667544139-81e47935d769', 'A valley town below snow-covered peaks', 'Snow peaks above the valley'),
];

const solang = [
  P('photo-1677820915325-d8ce3184c2a4', 'A paraglider over snowy, forested slopes', 'Paragliding at Solang'),
  P('photo-1713063968789-adf139c4a1eb', 'Paragliders over a green meadow with snow peaks behind', 'Solang Valley in summer'),
  P('photo-1679407985687-08a86c5c53ba', 'Snow peaks rising above a pine forest', 'Snow above Palchan'),
];

const rohtang = [P('photo-1663071099100-12051c368f23', 'A snow-covered peak above a meltwater pool', 'Rohtang Pass')];

const tsomgo = [
  P('photo-1631643171709-626f69ca8be0', 'A high mountain lake ringed by snowy slopes', 'Tsomgo Lake'),
  P('photo-1632726823875-43dd9adad495', 'Yaks in bright saddle cloths beside the lake', 'Yaks at Tsomgo'),
  P('photo-1675969302917-922fef2f5885', 'Prayer flags strung above the lake', 'Prayer flags at Tsomgo'),
];

const nathula = [
  P('photo-1551155311-88cda3ebe650', 'A frozen lake below snow-covered ridges', 'On the road to Nathula'),
  P('photo-1552545643-b1ef0037bc10', 'Snow-capped ridges under a deep blue sky', 'High on the Nathula road'),
];

const gangtok = [
  P('photo-1707202320239-d543e2661c7c', 'People with umbrellas on a rainy shopping street', 'Gangtok in the rain'),
  P('photo-1641233122088-9562e3ef0105', 'A brightly painted monastery building with many windows', 'A monastery in Sikkim'),
  P('photo-1707202319657-0d2f0e54cf2d', 'The lights of a hill town at night', 'Gangtok at night'),
];

const namchi = [
  P('photo-1724600460105-c9103ed8e05e', 'A tall, brightly painted temple tower', 'Char Dham, Namchi'),
  P('photo-1754616251362-f5c8f04721ab', 'A giant golden Buddha above gardens and forested hills', 'Buddha Park, Ravangla'),
];

const pelling = [
  P('photo-1724600458551-7144f78ec0c0', 'A statue and skywalk on a forested hilltop, from above', 'The Skywalk, Pelling'),
  P('photo-1718696070605-db38369c5629', 'Snow peaks rising above the clouds', 'Kanchenjunga, seen from Sikkim'),
  P('photo-1624725412168-a8e69d4f7b36', 'Snow-covered peaks under a clear blue sky', 'Snow peaks in Sikkim'),
];

const gangtokArrival = [
  P('photo-1707202319657-0d2f0e54cf2d', 'The lights of a hill town at night', 'Gangtok at night'),
  P('photo-1615966192539-f1731963b19a', 'Houses stacked on a green hillside under a blue sky', 'The hill towns of Sikkim'),
];

const toDarjeeling = [
  P('photo-1709116140564-e4b00b3dba05', 'Tea terraces falling away down a steep hillside', 'Into the tea country'),
  P('photo-1671711847762-b8308b444a42', 'A steam train puffing through green hills', 'The toy train'),
];

const darjeeling = [
  P('photo-1590256518627-c9f8a6855185', 'Snowy Himalayan peaks glowing gold in early light', 'First light on the Himalayas'),
  P('photo-1768922078515-a44aa4cb14c2', 'The war memorial obelisk and flag at Batasia Loop', 'Batasia Loop'),
  P('photo-1754737524646-d5159e91cbe7', 'A blue steam engine of the toy train in a hill town', 'The toy train'),
  P('photo-1709116468266-031ce068e468', 'Rows of tea bushes on a rounded green hill', 'Darjeeling tea gardens'),
];

const nainiLake = [
  P('photo-1667029838861-2fe3a590a1d2', 'Rowing boats on a green lake ringed by forested hills', 'Boating on Naini Lake'),
  P('photo-1706468630747-ec709652917c', 'The lake at sunset between dark hills', 'Sunset over the lake'),
];

const nainital = [
  P('photo-1706468630738-b0ded0c5fc25', 'The town wrapped around its lake, from above', 'Nainital from above'),
  P('photo-1645973869885-62d97dc081da', 'Small boats gathered at the lakeshore below the town', 'The lakeshore'),
];

const kumaonLakes = [
  P('photo-1683973200791-47539048cf63', 'A wide lake below green hills', 'Bhimtal'),
  P('photo-1663128687086-995ac1a9cea6', 'Colourful boats tied up at the lake', 'Boats at Bhimtal'),
];

const corbett = [
  P('photo-1669021071482-b15167dfae8d', 'A tiger crossing a forest track in front of safari jeeps', 'A tiger crossing, Corbett'),
  P('photo-1643269478488-e95ccb92a5ce', 'Two spotted deer in tall grass', 'Spotted deer, Bijrani'),
  P('photo-1656828059237-add66db82a2b', 'A safari jeep on a grassland track', 'On safari'),
];

const genting = [
  P('photo-1639676605927-687c42418c28', 'The giant golden statue at the foot of the Batu Caves', 'The Batu Caves'),
  P('photo-1588030322267-24bcfd19a298', 'A many-tiered pagoda against the sky', 'Chin Swee Temple, Genting'),
  P('photo-1561568005-90b6540edc29', 'A cable car rising past a pagoda on a green hillside', 'The cable car to Genting'),
];

const kualaLumpur = [
  P('photo-1597148543182-830ef7bbb904', 'The Petronas Twin Towers lit up at night', 'The Petronas Towers'),
  P('photo-1546273300-70f00c0fc1a0', 'The skybridge between the two towers, from below', 'The skybridge'),
  P('photo-1574218732130-6b19257fd9db', 'The city skyline at sunset', 'Kuala Lumpur at sunset'),
];

const phiPhi = [
  P('photo-1534008897995-27a23e859048', 'Boats on turquoise water between limestone cliffs', 'Maya Bay'),
  P('photo-1596879857570-7b6b9018bcb6', 'Longtail boats pulled up on a white-sand beach', 'Longtail boats, Phi Phi'),
  P('photo-1706629340089-841a74251fbd', 'Travellers on the bow of a boat at golden hour', 'Out on the water at Phi Phi'),
];

const sanctuary = [
  P('photo-1468082547792-d37c6c74003e', 'A limestone island rising from a calm blue sea', 'The islands off Krabi'),
  P('photo-1588504633950-9dc518941e93', 'An infinity pool reflecting the sky and the distant hills', 'An infinity pool in Phuket'),
];

const beachDinner = [P('photo-1741231953820-e270cd4fe6e3', 'Seafood and drinks laid out on a table on the sand', 'Dinner on the sand')];

const wellness = [P('photo-1543134968-8752069dbf58', 'White and purple flowers floating in a stone bowl', 'Flowers for a spa ritual')];

const heritageEstate = [
  P('photo-1656496355565-4bbbf6cc179e', 'A long colonial verandah looking out over the hills', 'An old verandah in Kandy'),
  P('photo-1695702228130-8eb6d2026041', 'A white colonial house among palms', 'A colonial-era house in Kandy'),
];

const spiceTrail = [
  P('photo-1681307606104-f4581ced31bd', 'Green hills rolling away under clouds', 'The hills of Matale'),
  P('photo-1743670476809-1a1422f7c2a1', 'A young pepper plant with a small bud', 'Pepper on the vine, Peradeniya'),
];

const yala = [P('photo-1566708627877-859df13ae63e', 'A leopard walking across dry red earth', 'A leopard in Yala')];

const hillCountry = [
  P('photo-1585171328560-947fbd92d6f0', 'A path winding between tea bushes on a hillside', 'Tea country, Nuwara Eliya'),
  P('photo-1578517929167-db9ed31cd5c6', 'A blue train passing hillside houses', 'The hill-country railway, Nanu Oya'),
  P('photo-1559038298-ef4eecdfdbb3', 'Tea estates rolling across the hills', 'The tea hills'),
];

// One list per itinerary entry, in order.
const BY_TRIP = {
  'golden-triangle': [delhi, agra, jaipur],
  'south-india': [chennai, mahabalipuram, pondicherry, madurai, munnar, thekkady, alleppey, kochi],
  'classic-india-varanasi': [delhi, agra, jaipur, varanasi],
  kashmir: [srinagar, gulmarg, pahalgam, []],
  goa: [goaArrival, southGoa, northGoa, []],
  kerala: [munnar, thekkady, alleppey],
  'shimla-manali': [shimla, kufri, manali, solang, rohtang],
  sikkim: [tsomgo, nathula, gangtok, namchi, pelling],
  darjeeling: [gangtokArrival, [...tsomgo, nathula[0]], namchi, pelling, toDarjeeling, darjeeling, []],
  'nainital-corbett': [nainiLake, nainital, kumaonLakes, corbett],
  malaysia: [genting, kualaLumpur],
  thailand: [phiPhi, sanctuary, beachDinner, wellness],
  'sri-lanka': [heritageEstate, spiceTrail, yala, hillCountry],
};

// The itinerary with its pictures: [{ title, body, photos }].
export const daysOf = (trip) => trip.itinerary.map((d, i) => ({ ...d, photos: BY_TRIP[trip.slug]?.[i] || [] }));

// Destination names in Devanagari, written over the trip openings for India.
export const HINDI_NAMES = {
  'golden-triangle': 'दिल्ली · आगरा · जयपुर',
  'south-india': 'दक्षिण भारत',
  'classic-india-varanasi': 'वाराणसी',
  kashmir: 'कश्मीर',
  goa: 'गोवा',
  kerala: 'केरल',
  'shimla-manali': 'शिमला · मनाली',
  sikkim: 'सिक्किम',
  darjeeling: 'दार्जिलिंग',
  'nainital-corbett': 'नैनीताल',
};
