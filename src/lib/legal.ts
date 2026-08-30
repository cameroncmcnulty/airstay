export type LegalSection = { id: string; title: string; paragraphs: string[] };

export const LAST_UPDATED = "August 19, 2026";
export const LAST_UPDATED_FR = "19 août 2026";

export const privacyEn: LegalSection[] = [
  {
    id: "who",
    title: "1. Who we are",
    paragraphs: [
      "This Privacy Policy describes how AIRSTAY (“AIRSTAY”, “we”, “us”, “our”) collects, uses, discloses and protects personal information when you use airstay.ca and related pages (the “Site”). AIRSTAY is a Canada-outbound travel metasearch and comparison service. We do not sell travel and we do not process booking payments.",
      "For privacy questions, access or deletion requests, or to reach our Privacy Officer (including the person in charge of the protection of personal information for Quebec Law 25), contact: Privacy Officer, AIRSTAY, email privacy@airstay.ca.",
      "This Policy is designed to align with the Personal Information Protection and Electronic Documents Act (PIPEDA), substantially similar provincial laws (Alberta PIPA, British Columbia PIPA, and Quebec’s Act respecting the protection of personal information in the private sector as amended by Law 25), Canada’s Anti-Spam Legislation (CASL), and applicable consumer-protection and accessibility rules. It is a compliance-oriented template and should be reviewed by a Canadian lawyer before commercial launch.",
    ],
  },
  {
    id: "scope",
    title: "2. Scope and application",
    paragraphs: [
      "This Policy applies to personal information we collect in the course of commercial activity on the Site, including account creation, saved searches, cookie preferences, contact messages and partner click-throughs.",
      "When you leave AIRSTAY and book on a partner website (for example Kayak, Expedia, Booking.com, Airbnb, an airline or a car-rental brand), that partner is a separate organization. Their privacy policy, terms and booking contract apply to that transaction. We are not responsible for partner privacy practices.",
    ],
  },
  {
    id: "collect",
    title: "3. Personal information we collect",
    paragraphs: [
      "Identity and account data: name, email address, password (stored as a salted one-way hash), province or territory of residence, age confirmation, and timestamps for consent.",
      "Travel search data: Canadian origin airport, destination, dates, traveller counts, cabin class, trip type and saved-search labels. We do not need your passport, frequent-flyer number or payment card to run a search.",
      "Communications: messages you send through the contact form, and whether you gave express CASL consent to receive commercial electronic messages about deals.",
      "Technical and consent data: language preference, cookie choices, approximate device type, and pages viewed. If you refuse analytics and marketing cookies, we do not set those cookies.",
      "Approximate location: we read the city or region associated with your IP address (or the equivalent header from our host) only to guess the nearest major Canadian airport for search suggestions. We do not store the IP address and we do not use GPS or precise geolocation.",
      "We do not intentionally collect social insurance numbers, health information, precise geolocation, biometric identifiers, or payment card data. Do not submit that information to us.",
    ],
  },
  {
    id: "purposes",
    title: "4. Why we collect it (identified purposes)",
    paragraphs: [
      "To operate the Site and show Canada-outbound search results and partner deeplinks.",
      "To guess the nearest major Canadian airport from your approximate IP-based location so suggestions start from home. We do not store the IP.",
      "To create and secure your account, remember saved searches, and honour your privacy and marketing choices.",
      "To respond to questions and privacy requests.",
      "With your express consent only, to send commercial electronic messages about travel deals (CASL).",
      "To maintain security, prevent abuse, and meet legal obligations, including breach and confidentiality-incident duties.",
      "To measure Site performance if you opt in to analytics cookies.",
      "We will not use personal information for a new purpose without identifying that purpose and obtaining fresh consent, unless the law allows it.",
    ],
  },
  {
    id: "consent",
    title: "5. Consent (PIPEDA, Law 25 and CASL)",
    paragraphs: [
      "We rely on meaningful, informed consent. Necessary processing to provide a service you request (for example creating an account or running a search you submit) is based on that request. Optional analytics, marketing cookies and promotional email require express opt-in. Boxes are never pre-checked.",
      "Quebec Law 25: consent must be clear, free, informed and given for specific purposes. You may withdraw consent at any time, subject to legal or contractual restrictions and reasonable notice. Withdrawing consent may limit some features (for example deal emails or saved preferences).",
      "CASL: we send commercial electronic messages only if we have express consent (or another CASL exemption that actually applies), we identify AIRSTAY, and we include a working unsubscribe mechanism. A purchase or account alone is not treated as consent for promotional mail unless the law clearly allows it and we disclose that.",
      "You may refuse or withdraw consent by using cookie settings, account communication settings, the unsubscribe link in any email, or by writing to privacy@airstay.ca.",
    ],
  },
  {
    id: "children",
    title: "6. Children and youth",
    paragraphs: [
      "The Site is intended for individuals 16 years of age or older. Under Quebec Law 25, we do not knowingly collect personal information from a minor under 14 without the consent of the person having parental authority. If you believe we have collected information from a child contrary to this rule, contact privacy@airstay.ca and we will delete it.",
    ],
  },
  {
    id: "limits",
    title: "7. Limiting collection, use, disclosure and retention",
    paragraphs: [
      "We collect only what we need for the purposes above. We do not sell personal information.",
      "We retain account data for as long as the account is open and then for a short winding-up period (generally up to 24 months, or longer if the law requires, for example to handle a dispute or a confidentiality incident).",
      "Contact-form messages are kept long enough to respond and document the request. Cookie consent records are kept to show what you chose.",
      "When information is no longer required, we destroy it or de-identify it so that it can no longer identify you in a reasonably foreseeable way.",
    ],
  },
  {
    id: "disclosure",
    title: "8. Who we share information with",
    paragraphs: [
      "Service providers: hosting, content delivery and related infrastructure (the Site is designed to run on providers such as Vercel). They may process data only on our instructions.",
      "Travel partners: when you click a partner offer we send the search parameters needed to open that partner’s booking page (origin, destination, dates, traveller counts). That is a disclosure you initiate. The partner then deals with you under its own policy.",
      "Legal and safety: we may disclose information if required by law, a court, or to protect the Site, our users or the public.",
      "We do not disclose your account to partners for their independent marketing unless you separately consent.",
    ],
  },
  {
    id: "transfers",
    title: "9. Transfers outside Quebec and Canada (Law 25 and PIPEDA)",
    paragraphs: [
      "Personal information may be stored or processed on servers outside Quebec or outside Canada (including the United States) by our hosting provider. In those places, local law may allow courts, national-security agencies or regulators to access information.",
      "Before transferring personal information outside Quebec, Law 25 requires us to assess the sensitivity of the information, the purposes, the protection offered, and the legal framework of the destination, and to conclude a written agreement with appropriate safeguards. We will complete that assessment before any commercial transfer of Quebec residents’ information.",
      "By using the Site you are informed of this possible cross-border processing. If you do not want information stored outside Canada, do not create an account and limit the information you submit.",
    ],
  },
  {
    id: "safeguards",
    title: "10. Safeguards",
    paragraphs: [
      "We use administrative, technical and physical safeguards appropriate to the sensitivity of the information. Passwords are stored as salted hashes (PBKDF2). Sessions are kept in your browser. Transmission should occur over HTTPS in production.",
      "No method of transmission or storage is perfectly secure. Please use a unique password and sign out on shared devices.",
      "Quebec Law 25 confidentiality incidents: if we have cause to believe a confidentiality incident presents a risk of serious injury, we will notify the Commission d’accès à l’information du Québec and the affected persons, and keep the required incident register. Under PIPEDA we will report a breach of security safeguards that poses a real risk of significant harm to the Office of the Privacy Commissioner of Canada and to affected individuals, and keep records of all breaches.",
    ],
  },
  {
    id: "rights",
    title: "11. Your rights",
    paragraphs: [
      "You may request access to the personal information we hold about you, a correction of inaccurate information, and, where the law allows, deletion or de-indexing.",
      "Quebec residents also have rights relating to automated decision-making (we do not currently make legal or similarly significant automated decisions about you), data portability in the circumstances set out in Law 25, and information about technology used to identify, locate or profile you. We do not use profiling to evaluate work performance, economic situation, health, preferences, interests or behaviour except to remember your language, cookie and search preferences with your knowledge.",
      "Alberta and British Columbia residents have access and correction rights under PIPA.",
      "To exercise rights, email privacy@airstay.ca from the address on your account. We will verify your identity and respond within the time the applicable statute requires (generally 30 days under PIPEDA, subject to permitted extensions).",
      "You may complain to the Office of the Privacy Commissioner of Canada (priv.gc.ca), the Commission d’accès à l’information du Québec (cai.gouv.qc.ca) if you are in Quebec, or the provincial privacy commissioner in Alberta or British Columbia.",
    ],
  },
  {
    id: "cookies",
    title: "12. Cookies and similar technologies",
    paragraphs: [
      "Strictly necessary cookies remember your session, language and cookie decision. They do not require opt-in.",
      "Analytics and marketing cookies are off until you opt in through the cookie banner or your account settings. See our Cookie Policy for details.",
    ],
  },
  {
    id: "french",
    title: "13. Language (Quebec Charter of the French Language)",
    paragraphs: [
      "A French version of this Policy and of our Terms of Service is available on the Site. If you are in Quebec, you may deal with us in French. If there is a discrepancy that affects a Quebec consumer contract of adhesion, the French version prevails for that consumer to the extent required by Quebec law.",
    ],
  },
  {
    id: "changes",
    title: "14. Changes",
    paragraphs: [
      `We may update this Policy. The “Last updated” date will change. If we make a material change to purposes or to how we handle sensitive information, we will ask for new consent where the law requires it. Last updated: ${LAST_UPDATED}.`,
    ],
  },
];

export const privacyFr: LegalSection[] = [
  {
    id: "who",
    title: "1. Qui nous sommes",
    paragraphs: [
      "La présente politique décrit comment AIRSTAY (« AIRSTAY », « nous ») recueille, utilise, communique et protège les renseignements personnels lorsque vous utilisez airstay.ca (le « Site »). AIRSTAY est un métamoteur de voyages au départ du Canada. Nous ne vendons pas de voyages et n’encaissons aucun paiement de réservation.",
      "Pour toute question, demande d’accès ou de suppression, ou pour joindre notre responsable de la protection des renseignements personnels (Loi 25), écrivez à : Responsable de la protection des renseignements personnels, AIRSTAY, privacy@airstay.ca.",
      "Cette politique vise à s’aligner sur la LPRPDE, les lois provinciales essentiellement similaires (PIPA de l’Alberta et de la Colombie-Britannique, et la Loi sur la protection des renseignements personnels dans le secteur privé du Québec telle que modifiée par la Loi 25), la LCAP et les règles de protection du consommateur et d’accessibilité applicables. Il s’agit d’un modèle à faire réviser par un avocat canadien avant le lancement commercial.",
    ],
  },
  {
    id: "scope",
    title: "2. Portée",
    paragraphs: [
      "La politique s’applique aux renseignements personnels recueillis dans le cadre d’activités commerciales sur le Site, notamment la création de compte, les recherches enregistrées, les choix de témoins, les messages et les clics vers les partenaires.",
      "Lorsque vous quittez AIRSTAY pour réserver chez un partenaire, ce partenaire est une organisation distincte. Sa politique, ses conditions et son contrat de réservation s’appliquent. Nous ne sommes pas responsables de ses pratiques.",
    ],
  },
  {
    id: "collect",
    title: "3. Renseignements que nous recueillons",
    paragraphs: [
      "Identité et compte : nom, courriel, mot de passe (empreinte salée), province ou territoire, confirmation d’âge et horodatage des consentements.",
      "Recherche de voyage : aéroport d’origine canadien, destination, dates, nombre de voyageurs, cabine, type de trajet et libellés de recherches enregistrées. Nous n’avons pas besoin de votre passeport, de votre numéro de fidélisation ni de votre carte de paiement pour lancer une recherche.",
      "Communications : messages du formulaire de contact et consentement exprès LCAP, le cas échéant.",
      "Données techniques et de consentement : langue, choix de témoins, type d’appareil approximatif et pages consultées.",
      "Localisation approximative : nous lisons la ville ou la région liée à votre adresse IP (ou l’en-tête équivalent de notre hébergeur) uniquement pour estimer l’aéroport canadien majeur le plus proche pour les suggestions. Nous ne conservons pas l’IP et n’utilisons pas le GPS.",
      "Nous ne recueillons pas volontairement de NAS, de renseignements de santé, de géolocalisation précise, de données biométriques ni de données de carte de paiement.",
    ],
  },
  {
    id: "purposes",
    title: "4. Fins déterminées",
    paragraphs: [
      "Exploiter le Site et afficher des résultats et des liens profonds vers des partenaires.",
      "Estimer l’aéroport canadien majeur le plus proche à partir de votre localisation IP approximative, pour que les suggestions partent de chez vous. Nous ne conservons pas l’IP.",
      "Créer et sécuriser votre compte, mémoriser vos recherches et respecter vos choix.",
      "Répondre à vos questions et à vos demandes relatives à la vie privée.",
      "Avec votre consentement exprès seulement, vous envoyer des messages électroniques commerciaux sur les aubaines (LCAP).",
      "Assurer la sécurité, prévenir les abus et respecter la loi, y compris les obligations en cas d’incident de confidentialité.",
      "Mesurer le rendement du Site si vous acceptez les témoins d’analyse.",
    ],
  },
  {
    id: "consent",
    title: "5. Consentement (LPRPDE, Loi 25 et LCAP)",
    paragraphs: [
      "Nous nous appuyons sur un consentement valable et éclairé. Le traitement nécessaire pour fournir le service demandé (compte, recherche) repose sur cette demande. L’analyse, le marketing et les courriels promotionnels exigent un opt-in exprès. Aucune case n’est précochée.",
      "Loi 25 : le consentement doit être manifeste, libre, éclairé et donné à des fins spécifiques. Vous pouvez le retirer en tout temps, sous réserve des restrictions légales et d’un préavis raisonnable.",
      "LCAP : nous n’envoyons des MEC qu’avec un consentement exprès (ou une autre exemption réellement applicable), en nous identifiant et en offrant un désabonnement fonctionnel.",
      "Vous pouvez refuser ou retirer votre consentement via les réglages de témoins, votre compte, le lien de désabonnement ou privacy@airstay.ca.",
    ],
  },
  {
    id: "children",
    title: "6. Mineurs",
    paragraphs: [
      "Le Site s’adresse aux personnes de 16 ans ou plus. Au Québec, nous ne recueillons pas sciemment de renseignements auprès d’un mineur de moins de 14 ans sans le consentement du titulaire de l’autorité parentale. Si une collecte contraire a eu lieu, écrivez à privacy@airstay.ca.",
    ],
  },
  {
    id: "limits",
    title: "7. Limitation de la collecte, de l’utilisation, de la communication et de la conservation",
    paragraphs: [
      "Nous ne recueillons que ce qui est nécessaire. Nous ne vendons pas de renseignements personnels.",
      "Les données de compte sont conservées pendant que le compte est ouvert, puis pour une courte période de clôture (généralement jusqu’à 24 mois, ou plus si la loi l’exige).",
      "Lorsque les renseignements ne sont plus requis, nous les détruisons ou les anonymisons de façon à ce qu’ils ne permettent plus de vous identifier de manière raisonnablement prévisible.",
    ],
  },
  {
    id: "disclosure",
    title: "8. Communications à des tiers",
    paragraphs: [
      "Fournisseurs : hébergement et infrastructure (par exemple Vercel), uniquement selon nos instructions.",
      "Partenaires de voyage : lorsque vous cliquez une offre, nous transmettons les paramètres de recherche nécessaires. Le partenaire vous traite ensuite selon sa propre politique.",
      "Loi et sécurité : communication si la loi l’exige ou pour protéger le Site, nos utilisateurs ou le public.",
    ],
  },
  {
    id: "transfers",
    title: "9. Transferts hors du Québec et du Canada",
    paragraphs: [
      "Des renseignements peuvent être hébergés ou traités à l’extérieur du Québec ou du Canada (y compris aux États-Unis). Le droit local peut permettre l’accès par des tribunaux ou autorités.",
      "Avant un transfert hors Québec, la Loi 25 exige une évaluation de la sensibilité, des fins, de la protection et du cadre juridique, ainsi qu’une entente écrite. Cette évaluation sera réalisée avant tout transfert commercial concernant des résidents du Québec.",
    ],
  },
  {
    id: "safeguards",
    title: "10. Mesures de sécurité",
    paragraphs: [
      "Mesures administratives, techniques et physiques adaptées à la sensibilité. Mots de passe hachés et salés (PBKDF2). Transmission en HTTPS en production.",
      "Incidents de confidentialité (Loi 25) : si un incident présente un risque de préjudice sérieux, nous aviserons la CAI et les personnes concernées et tiendrons le registre requis. Aux termes de la LPRPDE, une atteinte présentant un risque réel de préjudice grave est signalée au Commissariat à la protection de la vie privée du Canada et aux personnes touchées.",
    ],
  },
  {
    id: "rights",
    title: "11. Vos droits",
    paragraphs: [
      "Accès, rectification et, lorsque la loi le permet, suppression ou désindexation.",
      "Au Québec : droits relatifs aux décisions automatisées (nous n’en prenons pas actuellement qui aient un effet juridique important), à la portabilité dans les cas prévus, et à l’information sur les technologies d’identification, de localisation ou de profilage.",
      "Pour exercer vos droits : privacy@airstay.ca. Réponse dans les délais légaux (généralement 30 jours).",
      "Plainte possible auprès du Commissariat à la protection de la vie privée du Canada, de la CAI (Québec) ou du commissaire provincial en Alberta ou en Colombie-Britannique.",
    ],
  },
  {
    id: "cookies",
    title: "12. Témoins",
    paragraphs: [
      "Les témoins strictement nécessaires mémorisent la session, la langue et votre décision. Les témoins d’analyse et de marketing restent désactivés jusqu’à votre consentement. Voir la Politique de témoins.",
    ],
  },
  {
    id: "french",
    title: "13. Langue (Charte de la langue française)",
    paragraphs: [
      "Une version française de cette politique et des Conditions est disponible. Au Québec, vous pouvez traiter avec nous en français. En cas de divergence touchant un contrat d’adhésion conclu avec un consommateur québécois, la version française prévaut dans la mesure exigée par le droit québécois.",
    ],
  },
  {
    id: "changes",
    title: "14. Modifications",
    paragraphs: [
      `Nous pouvons mettre à jour cette politique. La date de mise à jour changera. Une nouvelle fin ou un traitement plus sensible peut exiger un nouveau consentement. Dernière mise à jour : ${LAST_UPDATED_FR}.`,
    ],
  },
];

export const termsEn: LegalSection[] = [
  {
    id: "agree",
    title: "1. Agreement",
    paragraphs: [
      "These Terms of Service (the “Terms”) are a contract between you and AIRSTAY for use of the Site. By using the Site or creating an account you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Site.",
      "If you are a consumer in Quebec, nothing in these Terms limits the public-order protections of the Civil Code of Quebec or the Consumer Protection Act (Quebec). If you are a consumer elsewhere in Canada, nothing here waives rights you cannot legally waive under your province or territory’s consumer-protection statute.",
      "These Terms should be reviewed by a Canadian lawyer before commercial launch. They describe a deeplink / metasearch model, not a travel-retail business.",
    ],
  },
  {
    id: "service",
    title: "2. What AIRSTAY is — and is not",
    paragraphs: [
      "AIRSTAY is a travel comparison and deeplink service focused on travel leaving Canada. We show estimates and send you to third-party providers (“Partners”) to complete a booking.",
      "AIRSTAY is not a travel agency, travel wholesaler or travel retailer. We are not registered under Ontario’s Travel Industry Act, 2002 (TICO), Quebec’s Travel Agents Act, British Columbia’s Business Practices and Consumer Protection Act travel-services rules, or similar provincial travel-seller statutes, because we do not sell travel services and we do not receive money for bookings.",
      "We do not issue tickets, confirm hotel rooms, rent cars or operate packages. We do not collect fares, deposits or taxes. Your contract for any trip is solely with the Partner you choose.",
    ],
  },
  {
    id: "canada",
    title: "3. Canada-outbound focus",
    paragraphs: [
      "Flight and package searches on AIRSTAY originate only from Canadian airports that we list. We may refuse or ignore origin airports outside Canada. Destination, stay and car searches may be worldwide.",
    ],
  },
  {
    id: "deeplink",
    title: "4. Deeplinks, estimates and affiliate commissions",
    paragraphs: [
      "Prices on AIRSTAY are estimates advertised for comparison, in Canadian dollars unless we say otherwise. Taxes, fees, seat selection, baggage, resort fees, insurance, fuel surcharges and foreign-exchange differences may change the amount you pay on the Partner site. The Partner’s displayed price at checkout is the price that matters.",
      "AIRSTAY may earn a commission or other advertising revenue if you click a Partner link and complete a booking or take another valuable action. That commercial relationship is a material connection under the Competition Act. We disclose it on the Site, on result cards and in these Terms. Commission does not increase the price the Partner charges you solely because you came from AIRSTAY.",
      "Partner buttons are advertising / sponsored placements. Ranking may consider commission, completeness of the deeplink, and estimated price. We do not claim to show every possible fare.",
      "The Competition Act prohibits false or misleading representations, including drip pricing (a price that is unattainable because of mandatory fees omitted from the advertised price). Because final prices live on Partner sites, you must verify the all-in price before you pay. If an estimate on AIRSTAY appears wrong, tell us at support@airstay.ca.",
    ],
  },
  {
    id: "partners",
    title: "5. Partner sites",
    paragraphs: [
      "When you continue to a Partner you leave AIRSTAY. The Partner’s terms, privacy policy, cancellation rules, loyalty program and customer service apply. We do not control Partner inventory, overbooking, schedule changes, entry rules or refunds.",
      "You are responsible for passports, visas, Electronic Travel Authorizations, vaccination or health rules, and Canada Border Services Agency or destination-country requirements. We do not give immigration or tax advice.",
    ],
  },
  {
    id: "accounts",
    title: "6. Accounts",
    paragraphs: [
      "You must provide accurate information and keep your password confidential. You must meet the age rule in the Privacy Policy. We may suspend an account that is abusive, fraudulent or unlawful.",
      "Account data is stored in your browser in this version of the product (a local account). Clearing site data signs you out and may delete the local account. A later hosted account would be described in an updated Privacy Policy.",
    ],
  },
  {
    id: "casl",
    title: "7. Electronic messages (CASL)",
    paragraphs: [
      "If you opt in, we may send you commercial electronic messages about deals. Every such message will identify AIRSTAY and include an unsubscribe mechanism. We will honour an unsubscribe without delay and in any event within 10 business days, as CASL requires.",
    ],
  },
  {
    id: "use",
    title: "8. Acceptable use",
    paragraphs: [
      "You will not scrape the Site in a way that overloads it, attempt to break security, submit unlawful content, impersonate others, or use AIRSTAY to mislead consumers. You will not use the Site if applicable law forbids it.",
    ],
  },
  {
    id: "ip",
    title: "9. Intellectual property",
    paragraphs: [
      "The AIRSTAY name, suitcase mark, wordmark, and Site design are our intellectual property or used under licence. Partners remain owners of their names and logos, which appear for identification and comparison. You may not copy the Site or our marks without permission.",
    ],
  },
  {
    id: "disclaimer",
    title: "10. Disclaimers",
    paragraphs: [
      "The Site is provided “as is” and “as available.” We do not warrant that estimates are complete, that a Partner will honour a displayed price, or that the Site will be uninterrupted. To the maximum extent permitted by Canadian consumer law, we disclaim implied warranties that can legally be disclaimed.",
      "Quebec consumers retain the legal warranty of quality and the protections of the Consumer Protection Act that cannot be waived.",
    ],
  },
  {
    id: "liability",
    title: "11. Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, AIRSTAY and its directors, officers and suppliers are not liable for indirect, incidental, special, consequential, punitive or exemplary damages, or for lost trips, lost points, denied boarding, Partner acts or omissions, or destination events.",
      "If we are found liable despite the above, our aggregate liability for a claim relating to the Site is limited to CAD $100 or the amount you paid AIRSTAY in the previous 12 months (which is typically $0, because we do not charge booking fees), whichever is greater.",
      "These limits do not apply to fraud, fraudulent misrepresentation, or death or personal injury caused by our negligence where the law forbids a limit, and they do not limit Quebec consumers’ non-waivable rights.",
    ],
  },
  {
    id: "indemnity",
    title: "12. Indemnity",
    paragraphs: [
      "You will indemnify AIRSTAY against claims arising from your misuse of the Site or your breach of these Terms, except to the extent a court finds we caused the harm, and except where a consumer-protection statute forbids this indemnity.",
    ],
  },
  {
    id: "law",
    title: "13. Governing law and disputes",
    paragraphs: [
      "These Terms are governed by the laws of Canada and of the province or territory in which you reside. Consumers may bring claims in the courts of their home province or territory.",
      "If you do not reside in Canada, the laws of Alberta and the federal laws of Canada apply, and the courts of Alberta have jurisdiction, except where a mandatory law says otherwise.",
      "Quebec consumers: the Civil Code of Quebec and the Consumer Protection Act apply, and you may sue in Quebec.",
    ],
  },
  {
    id: "changes-term",
    title: "14. Changes, assignment and general",
    paragraphs: [
      "We may update these Terms by posting a new version. Continued use after the effective date is acceptance, except where the law requires a new agreement. We may assign the Site to an affiliate or purchaser. If a clause is invalid, the rest stays in force. These Terms and the Privacy Policy are the entire agreement about the Site.",
      `Last updated: ${LAST_UPDATED}.`,
    ],
  },
];

export const termsFr: LegalSection[] = [
  {
    id: "agree",
    title: "1. Entente",
    paragraphs: [
      "Les présentes Conditions d’utilisation (les « Conditions ») forment un contrat entre vous et AIRSTAY. En utilisant le Site ou en créant un compte, vous les acceptez ainsi que la Politique de confidentialité.",
      "Si vous êtes consommateur au Québec, rien ici ne limite les protections d’ordre public du Code civil du Québec ou de la Loi sur la protection du consommateur. Ailleurs au Canada, rien n’écarte les droits auxquels vous ne pouvez pas renoncer.",
      "Ces Conditions décrivent un modèle de métarecherche et de liens profonds, et non une agence de voyages. Faites-les réviser par un avocat canadien avant le lancement commercial.",
    ],
  },
  {
    id: "service",
    title: "2. Ce qu’est AIRSTAY — et ce qu’il n’est pas",
    paragraphs: [
      "AIRSTAY est un service de comparaison et de liens profonds axé sur les départs du Canada. Les estimations s’affichent chez nous ; la réservation se termine chez un tiers (« Partenaire »).",
      "AIRSTAY n’est pas une agence, un grossiste ni un détaillant en voyages. Nous ne sommes pas inscrits sous la Loi de 2002 sur le secteur du voyage de l’Ontario (TICO), la Loi sur les agents de voyages du Québec ou les règles équivalentes, parce que nous ne vendons pas de services de voyage et n’encaissons aucun paiement de réservation.",
      "Nous n’émettons pas de billets, ne confirmons pas de chambres, ne louons pas d’autos et n’exploitons pas de forfaits. Votre contrat de voyage est uniquement avec le Partenaire choisi.",
    ],
  },
  {
    id: "canada",
    title: "3. Départs du Canada",
    paragraphs: [
      "Les recherches de vols et de forfaits partent uniquement des aéroports canadiens que nous listons. Les séjours et les autos peuvent être mondiaux.",
    ],
  },
  {
    id: "deeplink",
    title: "4. Liens profonds, estimations et commissions",
    paragraphs: [
      "Les prix sur AIRSTAY sont des estimations en dollars canadiens, sauf indication contraire. Taxes, frais, bagages, assurance et écarts de change peuvent modifier le montant chez le Partenaire. Le prix affiché chez le Partenaire au paiement est le prix qui compte.",
      "AIRSTAY peut recevoir une commission ou un revenu publicitaire si vous cliquez un lien et réservez. Ce lien commercial est une relation importante au sens de la Loi sur la concurrence. Nous le divulguons. La commission n’augmente pas à elle seule le prix que le Partenaire vous facture.",
      "Les boutons partenaires sont des placements commandités. Le classement peut tenir compte de la commission, du lien et du prix estimé. Nous ne prétendons pas afficher tous les tarifs possibles.",
      "La Loi sur la concurrence interdit les indications fausses ou trompeuses, y compris l’affichage d’un prix inatteignable en raison de frais obligatoires omis. Vérifiez le prix tout compris avant de payer.",
    ],
  },
  {
    id: "partners",
    title: "5. Sites partenaires",
    paragraphs: [
      "En continuant vers un Partenaire, vous quittez AIRSTAY. Ses conditions, sa politique de confidentialité et son service à la clientèle s’appliquent.",
      "Vous êtes responsable des passeports, visas, AVE, règles sanitaires et exigences de l’ASFC ou du pays de destination. Nous ne donnons pas de conseils en immigration.",
    ],
  },
  {
    id: "accounts",
    title: "6. Comptes",
    paragraphs: [
      "Fournissez des renseignements exacts et protégez votre mot de passe. Respectez la règle d’âge de la Politique de confidentialité.",
      "Dans cette version, le compte est local au navigateur. Effacer les données du Site peut supprimer le compte local.",
    ],
  },
  {
    id: "casl",
    title: "7. Messages électroniques (LCAP)",
    paragraphs: [
      "Si vous y consentez, nous pouvons vous envoyer des MEC sur les aubaines, en nous identifiant et avec un désabonnement. Nous honorerons un désabonnement sans délai et au plus tard dans les 10 jours ouvrables.",
    ],
  },
  {
    id: "use",
    title: "8. Utilisation acceptable",
    paragraphs: [
      "Vous n’utiliserez pas le Site pour le surcharger, contourner la sécurité, publier du contenu illicite, usurper une identité ou tromper des consommateurs.",
    ],
  },
  {
    id: "ip",
    title: "9. Propriété intellectuelle",
    paragraphs: [
      "Le nom AIRSTAY, le pictogramme de valise, le mot-symbole et le design du Site sont notre propriété ou utilisés sous licence. Les marques des partenaires restent les leurs.",
    ],
  },
  {
    id: "disclaimer",
    title: "10. Avis de non-responsabilité",
    paragraphs: [
      "Le Site est fourni « tel quel ». Nous ne garantissons pas que les estimations soient complètes ni qu’un Partenaire honorera un prix affiché. Les consommateurs québécois conservent la garantie légale de qualité et les protections auxquelles ils ne peuvent pas renoncer.",
    ],
  },
  {
    id: "liability",
    title: "11. Limitation de responsabilité",
    paragraphs: [
      "Dans la mesure permise par la loi, AIRSTAY n’est pas responsable des dommages indirects, particuliers, punitifs, des voyages perdus, des actes d’un Partenaire ou des événements à destination.",
      "Si une responsabilité est retenue, elle est limitée au plus élevé de 100 $ CA ou des montants que vous nous avez payés au cours des 12 mois précédents (généralement 0 $).",
      "Ces limites ne s’appliquent pas à la fraude ni lorsque la loi l’interdit, et elles ne restreignent pas les droits irrévocables des consommateurs québécois.",
    ],
  },
  {
    id: "indemnity",
    title: "12. Indemnisation",
    paragraphs: [
      "Vous indemniserez AIRSTAY contre les réclamations découlant de votre mauvaise utilisation du Site ou d’une violation des présentes, sauf dans la mesure où nous avons causé le préjudice ou lorsqu’une loi sur la protection du consommateur l’interdit.",
    ],
  },
  {
    id: "law",
    title: "13. Droit applicable",
    paragraphs: [
      "Les lois du Canada et de votre province ou territoire de résidence s’appliquent. Les consommateurs peuvent s’adresser aux tribunaux de leur province ou territoire.",
      "Si vous ne résidez pas au Canada, les lois de l’Alberta et les lois fédérales du Canada s’appliquent, sous réserve d’une loi impérative contraire.",
      "Consommateurs québécois : le Code civil du Québec et la Loi sur la protection du consommateur s’appliquent.",
    ],
  },
  {
    id: "changes-term",
    title: "14. Modifications et dispositions générales",
    paragraphs: [
      "Nous pouvons mettre à jour ces Conditions en publiant une nouvelle version. Si une clause est invalide, le reste demeure. Les Conditions et la Politique de confidentialité constituent l’entente intégrale relative au Site.",
      `Dernière mise à jour : ${LAST_UPDATED_FR}.`,
    ],
  },
];

export const cookiesEn: LegalSection[] = [
  {
    id: "what",
    title: "1. What cookies we use",
    paragraphs: [
      "Necessary: language (airstay.locale), session (airstay.session.v1), accounts stored locally (airstay.users.v1), and your cookie decision (airstay.consent.v1). These are required to run the Site you asked for.",
      "Analytics (opt-in): measurement of page views to improve the Site. Off until you agree.",
      "Marketing (opt-in): used only if we later add advertising pixels. Off until you agree. We do not load third-party ad pixels without this consent.",
    ],
  },
  {
    id: "law",
    title: "2. Canadian rules we follow",
    paragraphs: [
      "PIPEDA requires meaningful consent for non-essential collection. Quebec Law 25 requires clear, granular consent for cookies that are not strictly necessary. CASL applies to commercial electronic messages, not to the cookie banner itself.",
      "You can change your mind at any time with the cookie banner controls or by emailing privacy@airstay.ca.",
    ],
  },
];

export const cookiesFr: LegalSection[] = [
  {
    id: "what",
    title: "1. Témoins utilisés",
    paragraphs: [
      "Nécessaires : langue, session, comptes locaux et décision relative aux témoins. Ils sont requis pour fournir le Site demandé.",
      "Analyse (opt-in) : mesure des pages pour améliorer le Site. Désactivé tant que vous n’acceptez pas.",
      "Marketing (opt-in) : uniquement si nous ajoutons plus tard des pixels publicitaires. Désactivé tant que vous n’acceptez pas.",
    ],
  },
  {
    id: "law",
    title: "2. Règles canadiennes",
    paragraphs: [
      "La LPRPDE exige un consentement valable pour toute collecte non essentielle. La Loi 25 exige un consentement clair et granulaire pour les témoins non strictement nécessaires.",
      "Vous pouvez changer d’avis en tout temps via le bandeau ou privacy@airstay.ca.",
    ],
  },
];

export const accessEn: LegalSection[] = [
  {
    id: "commit",
    title: "1. Commitment",
    paragraphs: [
      "AIRSTAY aims to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We also designed the Site with Ontario’s AODA customer-service and integrated-accessibility standards in mind, and with the Accessible Canada Act’s principle of an accessible digital public square.",
      "The interface supports keyboard use, visible focus, skip-to-content, labelled form fields, colour contrast on brand navy and sky blue, and a language toggle. Motion is modest; your operating system’s reduced-motion setting is respected where implemented.",
    ],
  },
  {
    id: "feedback",
    title: "2. Feedback and accessible formats",
    paragraphs: [
      "If you have trouble using any part of the Site, email support@airstay.ca or privacy@airstay.ca. We will work to provide the information in an accessible format and to fix barriers.",
      "This statement does not replace a formal multi-year accessibility plan if AIRSTAY later becomes an obligated organization under AODA or the Accessible Canada Act. We will publish that plan when the threshold applies.",
    ],
  },
];

export const accessFr: LegalSection[] = [
  {
    id: "commit",
    title: "1. Engagement",
    paragraphs: [
      "AIRSTAY vise les règles pour l’accessibilité des contenus Web (WCAG) 2.1 niveau AA, en tenant compte des normes de l’AODA de l’Ontario et des principes de la Loi canadienne sur l’accessibilité.",
      "L’interface prend en charge le clavier, un focus visible, un lien d’évitement, des champs étiquetés, un contraste suffisant et un basculeur de langue.",
    ],
  },
  {
    id: "feedback",
    title: "2. Commentaires et formats accessibles",
    paragraphs: [
      "Si une partie du Site vous est inaccessible, écrivez à support@airstay.ca. Nous fournirons l’information dans un format accessible et corrigerons les obstacles lorsque c’est possible.",
    ],
  },
];

export const disclosureEn: LegalSection[] = [
  {
    id: "aff",
    title: "Affiliate and advertising disclosure",
    paragraphs: [
      "AIRSTAY is a comparison website that uses deeplinks. If you click a Partner offer and book, AIRSTAY may receive a commission or other advertising payment. This is a material connection that we disclose under the Competition Act and the Competition Bureau’s influencer / affiliate guidance.",
      "Sponsored or partner labels appear on result cards. Commission does not mean the Partner charges you more because you started on AIRSTAY. Always confirm the all-in CAD price, cancellation rules and privacy policy on the Partner site before you pay.",
      "We are not a travel agency and we do not take booking payments.",
    ],
  },
];

export const disclosureFr: LegalSection[] = [
  {
    id: "aff",
    title: "Divulgation d’affiliation et de publicité",
    paragraphs: [
      "AIRSTAY est un site de comparaison qui utilise des liens profonds. Si vous cliquez une offre et réservez, AIRSTAY peut recevoir une commission. Il s’agit d’un lien important au sens de la Loi sur la concurrence.",
      "Les cartes de résultats portent une mention partenaire ou commanditée. La commission ne signifie pas que le Partenaire vous facture davantage parce que vous êtes passé par AIRSTAY. Vérifiez toujours le prix tout compris en $ CA chez le Partenaire.",
      "Nous ne sommes pas une agence de voyages et n’encaissons aucun paiement de réservation.",
    ],
  },
];
