/* CompareMalta.ai: static front-end (EN / MT / IT). Reads JSON produced daily by /feeds into /data.
   Design language: "CompareMalta.ai.pdf" (Space Grotesk, navy / royal blue / stone). Mascot: Blue, the blue rock thrush (il-merill in Maltese). */
(() => {
"use strict";
const V = window.CMV;

/* ---------- strings ---------- */
const T = {
 en:{mMorning:"Malta this morning",mAfternoon:"Malta this afternoon",mEvening:"Malta this evening",newsAt:"News updated at",nlEyebrow:"Weekly newsletter",nlTitle:"Blue's weekly: Malta's best rates every Monday",nlSub:"The best picks, rate changes, markets and the week's news in one short email. Free, and you can unsubscribe at any time.",nlPh:"Your email",nlBtn:"Subscribe",nlConsent:"I agree to receive the weekly CompareMalta.ai newsletter. I can unsubscribe at any time.",nlOk:"Almost done. Check your inbox and confirm your subscription.",nlOkDirect:"You're subscribed. See you on Monday.",nlErr:"We could not subscribe you right now. Please try again later.",nlBad:"Please enter a valid email and tick the box.",nlLatest:"This week's issue",nlNav:"Newsletter",pTitle:"Partner with CompareMalta.ai",pEyebrow:"Partnerships",pLead:"Banks, fintechs, telcos, insurers, brokers and restaurants: list your products, send us rate updates, or talk to us about referral, advertising and data partnerships. Rankings stay independent and are never for sale.",pName:"Your name",pCompany:"Company",pEmail:"Work email",pType:"What is it about?",pTypes:["List or update our products","Referral or affiliate partnership","Advertising","Data and API","Press","Other"],pMsg:"Message",pConsent:"I agree that CompareMalta.ai may contact me about this request.",pSend:"Send message",pOk:"Thank you. Your message is with us and we will get back to you soon.",pErr:"We could not send your message right now. Please try again later.",pBand:"Are you a bank, fintech, telco or restaurant in Malta?",pBandSub:"Get your products listed and kept up to date, or talk to us about partnerships.",pCta:"Partner with us",pWhy:["Listed for free, ranked on merit","Daily refreshed rates and plans","Reach people comparing in English, Malti and Italiano"],fPartner:"Partner with us",ctaOpen:"Open account",ctaApply:"Apply now",ctaPlan:"Get this plan",ctaQuote:"Get a quote",ctaSend:"Send money",ctaBook:"Book a table",ctaPos:"Start taking cards",featured:"Featured",visit:"Visit site",dirs:"Directions",onSite:"on the provider's site",thinking:"Blue is checking every provider…",aiNote:"AI answer from today's data. Always confirm details with the provider.",followPh:"Ask a follow-up…",sample:"Sample data",
  nBanking:"Banking",nLoans:"Loans & Mortgages",nCards:"Cards",nBusiness:"Business",nPos:"POS",nFx:"FX",nTelco:"Telco",nEat:"Eat",nMarkets:"Markets",nNews:"News",
  ask:"Ask Blue",live:"Live · updated daily",mseIdx:"MSE Index",ecb:"ECB deposit rate",brent:"Brent",
  eyebrow:"Malta's comparison engine",h1a:"Every Maltese rate, plan and table,",h1b:"side by side.",
  lead:"Accounts, loans, mortgages, cards, mobile plans and where to eat. Refreshed every morning in English, Malti and Italiano.",
  ph:"e.g. best savings account for €20k",compare:"Compare",chips:["Mortgage rates","5G plans","Business accounts","Lunch in Valletta"],
  says:"Blue says",quote:"Tell me what you need. I'll fly through every provider and bring back the best three.",
  whatCmp:"What are you comparing?",allCats:"All categories →",
  c:{banking:["Banking","Current & savings accounts"],loans:["Loans & Mortgages","Home, personal, car"],cards:["Credit cards","Cashback, travel, low APR"],business:["Business & fintech","SME accounts, POS, FX"],telco:["Telco","Mobile, fibre, TV bundles"],eat:["Restaurants","Where Malta eats this week"],markets:["Markets & FX","MSE, global indices, currencies"],today:["Malta today","Daily news digest"]},
  topEyebrow:"Today's top table",topT:{savings:"Savings accounts in Malta",mortgages:"Mortgage rates in Malta",mobile:"Mobile plans in Malta"},tabs:{savings:"Savings",mortgages:"Mortgages",mobile:"Mobile"},
  thrush:"Blue score",bestPick:"Best pick",viewDeal:"View deal",
  refreshed:"Rates refreshed daily at {t} from provider sites. CompareMalta.ai may earn a commission, but rankings are never paid for.",
  morning:"Malta this morning",readSum:"Read summary →",fullMk:"Full markets page →",mkt:"Markets",
  footTag:"Independent comparisons for life and business in Malta. Updated daily. English · Malti · Italiano.",fCompare:"Compare",fDaily:"Daily",fAbout:"About",fNews:"News",fMarkets:"Markets",fFx:"FX",fLoans:"Loans",fHow:"How we rank",fContact:"Contact",
  filter:"Filter…",sortBy:"Sort by",updated:"Updated",checked:"Checked",notChecked:"Catalogue data",stale:"Last known",affiliated:"Related party",
  all:"All",sources:"Sources",mse:"Malta Stock Exchange",global:"Global indices & commodities",crypto:"Crypto (EUR)",fx:"FX rates (ECB)",
  loanCalc:"Loan calculator",mortCalc:"Mortgage calculator",fxCalc:"Currency converter",amount:"Amount (€)",amt:"Amount",rate:"Interest rate (% p.a.)",years:"Term (years)",fee:"Upfront fees (€)",
  monthly:"Monthly payment",totalPay:"Total repayment",totalInt:"Total interest",aprc:"Est. APRC",price:"Property price (€)",deposit:"Deposit (€)",from:"From",to:"To",
  area:"Area",cuisine:"Cuisine",priceL:"Price",openMaps:"Open",diningLead:"Filter by area, cuisine and budget.",todayDining:"Today's picks",calc:"Tools",
  demo:"Preview mode: figures are sample data. Live values replace them on the first daily feed run.",
  disclaimer:"Not financial advice. Always confirm rates with the provider before applying.",
  feeds:"Feeds",low:"lower is better",high:"higher is better",free:"Free",unlimited:"Unlimited",results:"results",noRes:"No results.",
  tip:"Blue's tip",tipTxt:"Look at the total cost, not just the headline rate. Fees and terms can change the ranking.",mNo:"Blue looked everywhere but found nothing. Try another word.",
  howTitle:"How we rank",howTxt:"Every table is ranked by the Blue score (0 to 10). For each category we pick the metrics that matter most to you (rate, fees, speed, data), normalise each across all providers (best = 1, worst = 0), weight them and scale to 10. Providers cannot pay to change their position.",weights:"Weights",
  contactTxt:"Contact details will be published here at launch.",
  askSub:"Ask in plain words and I'll find the best three.",askHint:"Try:",askChips:["Best savings for €20k","Cheapest unlimited mobile","Business account with multi-currency","Seafood in Marsaxlokk"],
  askNone:"I couldn't tell what to compare. Try one of the examples, or pick a category.",askHere:"Here are the best three I found in",seeTable:"See the full table →",allCatsTitle:"All categories"},
 mt:{mMorning:"Malta dalgħodu",mAfternoon:"Malta llum waranofsinhar",mEvening:"Malta llejla",newsAt:"Aħbarijiet aġġornati fil-",nlEyebrow:"Newsletter ta' kull ġimgħa",nlTitle:"Blue kull ġimgħa: l-aħjar rati ta' Malta kull nhar ta' Tnejn",nlSub:"L-aħjar għażliet, bidliet fir-rati, is-swieq u l-aħbarijiet tal-ġimgħa f'email qasira waħda. B'xejn, u tista' tneħħi s-sottoskrizzjoni meta trid.",nlPh:"L-email tiegħek",nlBtn:"Issottoskrivi",nlConsent:"Naqbel li nirċievi n-newsletter ta' kull ġimgħa ta' CompareMalta.ai. Nista' nneħħi s-sottoskrizzjoni meta rrid.",nlOk:"Kważi lest. Iċċekkja l-inbox tiegħek u kkonferma s-sottoskrizzjoni.",nlOkDirect:"Issa int sottoskritt. Narawk nhar it-Tnejn.",nlErr:"Ma stajniex nissottoskrivuk issa. Erġa' pprova aktar tard.",nlBad:"Daħħal email valida u immarka l-kaxxa.",nlLatest:"Il-ħarġa ta' din il-ġimgħa",nlNav:"Newsletter",pTitle:"Sieħeb ma' CompareMalta.ai",pEyebrow:"Sħubijiet",pLead:"Banek, fintechs, kumpaniji tat-telekomunikazzjoni, assiguraturi, brokers u restoranti: niżżlu l-prodotti tagħkom, ibagħtulna aġġornamenti tar-rati, jew kellmuna dwar sħubijiet ta' referenza, reklamar u data. Il-klassifiki jibqgħu indipendenti u qatt ma jinbiegħu.",pName:"Ismek",pCompany:"Kumpanija",pEmail:"Email tax-xogħol",pType:"Dwar xiex hu?",pTypes:["Niżżlu jew naġġornaw il-prodotti tagħna","Sħubija ta' referenza jew affiljazzjoni","Reklamar","Data u API","Stampa","Oħrajn"],pMsg:"Messaġġ",pConsent:"Naqbel li CompareMalta.ai jikkuntattjani dwar din it-talba.",pSend:"Ibgħat messaġġ",pOk:"Grazzi. Il-messaġġ tiegħek wasal u nirrispondu dalwaqt.",pErr:"Ma stajniex nibagħtu l-messaġġ issa. Erġa' pprova aktar tard.",pBand:"Bank, fintech, telco jew restorant f'Malta?",pBandSub:"Niżżlu l-prodotti tagħkom u żommuhom aġġornati, jew kellmuna dwar sħubijiet.",pCta:"Sieħeb magħna",pWhy:["Imniżżlin b'xejn, ikklassifikati fuq il-mertu","Rati u pjanijiet aġġornati kuljum","Laħħqu nies li qed iqabblu bl-Ingliż, bil-Malti u bit-Taljan"],fPartner:"Sieħeb magħna",ctaOpen:"Iftaħ kont",ctaApply:"Applika issa",ctaPlan:"Ħu dan il-pjan",ctaQuote:"Ikseb kwotazzjoni",ctaSend:"Ibgħat flus",ctaBook:"Irriserva mejda",ctaPos:"Ibda ħu l-karti",featured:"Rakkomandat",visit:"Żur is-sit",dirs:"Direzzjonijiet",onSite:"fuq is-sit tal-fornitur",thinking:"Blue qed jiċċekkja kull fornitur…",aiNote:"Tweġiba AI mid-data tal-lum. Dejjem ikkonferma d-dettalji mal-fornitur.",followPh:"Staqsi mistoqsija oħra…",sample:"Data ta' kampjun",
  nBanking:"Bankar",nLoans:"Self u Self għad-Dar",nCards:"Karti",nBusiness:"Negozju",nPos:"POS",nFx:"Kambju",nTelco:"Telco",nEat:"Ikel",nMarkets:"Swieq",nNews:"Aħbarijiet",
  ask:"Staqsi lil Blue",live:"Live · aġġornat kuljum",mseIdx:"Indiċi MSE",ecb:"Rata tad-depożitu ECB",brent:"Brent",
  eyebrow:"Il-magna tal-paragun ta' Malta",h1a:"Kull rata, pjan u tabella Maltija,",h1b:"wieħed ħdejn l-ieħor.",
  lead:"Kontijiet, self, self għad-dar, karti, pjanijiet tal-mobile u fejn tiekol. Aġġornati kull filgħodu bl-Ingliż, bil-Malti u bit-Taljan.",
  ph:"eż. l-aħjar kont tat-tfaddil għal €20k",compare:"Qabbel",chips:["Rati tas-self għad-dar","Pjanijiet 5G","Kontijiet tan-negozju","Ikla f'Valletta"],
  says:"Blue jgħid",quote:"Għidli x'għandek bżonn. Intir minn fornitur għall-ieħor u nġiblek l-aqwa tlieta.",
  whatCmp:"X'qed tqabbel?",allCats:"Il-kategoriji kollha →",
  c:{banking:["Bankar","Kontijiet kurrenti u tat-tfaddil"],loans:["Self u Self għad-Dar","Dar, personali, karozza"],cards:["Karti tal-kreditu","Cashback, safar, APR baxx"],business:["Negozju u fintech","Kontijiet SME, POS, kambju"],telco:["Telco","Mobile, fibra, pakketti tat-TV"],eat:["Restoranti","Fejn qed tiekol Malta din il-ġimgħa"],markets:["Swieq u Kambju","MSE, indiċijiet globali, muniti"],today:["Malta llum","Sommarju tal-aħbarijiet ta' kuljum"]},
  topEyebrow:"It-tabella ewlenija tal-lum",topT:{savings:"Kontijiet tat-tfaddil f'Malta",mortgages:"Rati tas-self għad-dar f'Malta",mobile:"Pjanijiet tal-mobile f'Malta"},tabs:{savings:"Tfaddil",mortgages:"Self għad-dar",mobile:"Mobile"},
  thrush:"Punteġġ ta' Blue",bestPick:"L-aħjar għażla",viewDeal:"Ara l-offerta",
  refreshed:"Ir-rati jiġu aġġornati kuljum fil-{t} mis-siti tal-fornituri. CompareMalta.ai jista' jaqla' kummissjoni, iżda l-klassifiki qatt ma jitħallsu.",
  morning:"Malta dalgħodu",readSum:"Aqra s-sommarju →",fullMk:"Paġna sħiħa tas-swieq →",mkt:"Swieq",
  footTag:"Paraguni indipendenti għall-ħajja u n-negozju f'Malta. Aġġornati kuljum. English · Malti · Italiano.",fCompare:"Qabbel",fDaily:"Kuljum",fAbout:"Dwarna",fNews:"Aħbarijiet",fMarkets:"Swieq",fFx:"Kambju",fLoans:"Self",fHow:"Kif nikklassifikaw",fContact:"Kuntatt",
  filter:"Iffiltra…",sortBy:"Ordna skont",updated:"Aġġornat",checked:"Iċċekkjat",notChecked:"Data tal-katalgu",stale:"L-aħħar magħruf",affiliated:"Parti relatata",
  all:"Kollha",sources:"Sorsi",mse:"Borża ta' Malta",global:"Indiċijiet globali u komoditajiet",crypto:"Kripto (EUR)",fx:"Rati tal-kambju (ECB)",
  loanCalc:"Kalkulatur tas-self",mortCalc:"Kalkulatur tas-self għad-dar",fxCalc:"Konvertitur tal-munita",amount:"Ammont (€)",amt:"Ammont",rate:"Rata tal-imgħax (% fis-sena)",years:"Terminu (snin)",fee:"Miżati bil-quddiem (€)",
  monthly:"Ħlas fix-xahar",totalPay:"Ħlas totali lura",totalInt:"Imgħax totali",aprc:"APRC stmat",price:"Prezz tal-propjetà (€)",deposit:"Depożitu (€)",from:"Minn",to:"Għal",
  area:"Żona",cuisine:"Kċina",priceL:"Prezz",openMaps:"Iftaħ",diningLead:"Iffiltra skont iż-żona, il-kċina u l-baġit.",todayDining:"L-għażliet tal-lum",calc:"Għodod",
  demo:"Modalità ta' preview: iċ-ċifri huma data ta' kampjun. Il-valuri live jissostitwuhom fl-ewwel aġġornament ta' kuljum.",
  disclaimer:"Mhux parir finanzjarju. Dejjem ikkonferma r-rati mal-fornitur qabel tapplika.",
  feeds:"Feeds",low:"inqas huwa aħjar",high:"aktar huwa aħjar",free:"B'xejn",unlimited:"Bla limitu",results:"riżultati",noRes:"L-ebda riżultat.",
  tip:"Il-parir ta' Blue",tipTxt:"Ħares lejn l-ispiża totali, mhux biss lejn ir-rata. Il-miżati u t-termini jistgħu jbiddlu l-klassifika.",mNo:"Blue fittex kullimkien iżda ma sab xejn. Ipprova kelma oħra.",
  howTitle:"Kif nikklassifikaw",howTxt:"Kull tabella hija kklassifikata bil-Punteġġ ta' Blue (0 sa 10). Għal kull kategorija nagħżlu l-metriċi li jgħoddu l-aktar (rata, miżati, ħeffa, data), ninnormalizzaw kull waħda fost il-fornituri kollha (l-aħjar = 1, l-agħar = 0), nagħtuhom piż u nskalawhom għal 10. Il-fornituri ma jistgħux iħallsu biex jibdlu l-pożizzjoni tagħhom.",weights:"Piżijiet",
  contactTxt:"Id-dettalji tal-kuntatt jiġu ppubblikati hawn mal-varar.",
  askSub:"Staqsi bi kliem sempliċi u nsiblek l-aqwa tlieta.",askHint:"Ipprova:",askChips:["L-aħjar tfaddil għal €20k","L-irħas mobile bla limitu","Kont tan-negozju b'ħafna muniti","Ħut f'Marsaxlokk"],
  askNone:"Ma fhimtx x'għandi nqabbel. Ipprova wieħed mill-eżempji, jew agħżel kategorija.",askHere:"Dawn huma l-aqwa tlieta li sibt f'",seeTable:"Ara t-tabella sħiħa →",allCatsTitle:"Il-kategoriji kollha"},
 it:{mMorning:"Malta stamattina",mAfternoon:"Malta oggi pomeriggio",mEvening:"Malta stasera",newsAt:"Notizie aggiornate alle",nlEyebrow:"Newsletter settimanale",nlTitle:"Blue ogni settimana: i migliori tassi di Malta ogni lunedì",nlSub:"Le migliori scelte, le variazioni dei tassi, i mercati e le notizie della settimana in una breve email. Gratis, e puoi annullare l'iscrizione quando vuoi.",nlPh:"La tua email",nlBtn:"Iscriviti",nlConsent:"Accetto di ricevere la newsletter settimanale di CompareMalta.ai. Posso annullare l'iscrizione in qualsiasi momento.",nlOk:"Quasi fatto. Controlla la tua casella e conferma l'iscrizione.",nlOkDirect:"Iscrizione completata. A lunedì.",nlErr:"Non siamo riusciti a iscriverti ora. Riprova più tardi.",nlBad:"Inserisci un'email valida e spunta la casella.",nlLatest:"Il numero di questa settimana",nlNav:"Newsletter",pTitle:"Diventa partner di CompareMalta.ai",pEyebrow:"Partnership",pLead:"Banche, fintech, operatori telefonici, assicurazioni, broker e ristoranti: inserite i vostri prodotti, inviateci aggiornamenti sui tassi o parlateci di partnership di referral, pubblicità e dati. Le classifiche restano indipendenti e non sono mai in vendita.",pName:"Nome",pCompany:"Azienda",pEmail:"Email di lavoro",pType:"Di cosa si tratta?",pTypes:["Inserire o aggiornare i nostri prodotti","Partnership di referral o affiliazione","Pubblicità","Dati e API","Stampa","Altro"],pMsg:"Messaggio",pConsent:"Accetto che CompareMalta.ai mi contatti in merito a questa richiesta.",pSend:"Invia messaggio",pOk:"Grazie. Abbiamo ricevuto il tuo messaggio e ti risponderemo presto.",pErr:"Non siamo riusciti a inviare il messaggio. Riprova più tardi.",pBand:"Sei una banca, una fintech, un operatore o un ristorante a Malta?",pBandSub:"Fai inserire i tuoi prodotti e tienili aggiornati, oppure parlaci di partnership.",pCta:"Diventa partner",pWhy:["Inserimento gratuito, classifica per merito","Tassi e piani aggiornati ogni giorno","Raggiungi chi confronta in inglese, maltese e italiano"],fPartner:"Diventa partner",ctaOpen:"Apri un conto",ctaApply:"Richiedi ora",ctaPlan:"Attiva l'offerta",ctaQuote:"Fai un preventivo",ctaSend:"Invia denaro",ctaBook:"Prenota un tavolo",ctaPos:"Inizia ad accettare carte",featured:"In evidenza",visit:"Visita il sito",dirs:"Indicazioni",onSite:"sul sito del fornitore",thinking:"Blue sta controllando ogni fornitore…",aiNote:"Risposta AI dai dati di oggi. Verifica sempre i dettagli con il fornitore.",followPh:"Fai un'altra domanda…",sample:"Dati di esempio",
  nBanking:"Banca",nLoans:"Prestiti e Mutui",nCards:"Carte",nBusiness:"Business",nPos:"POS",nFx:"Cambio",nTelco:"Telco",nEat:"Mangiare",nMarkets:"Mercati",nNews:"Notizie",
  ask:"Chiedi a Blue",live:"Live · aggiornato ogni giorno",mseIdx:"Indice MSE",ecb:"Tasso depositi BCE",brent:"Brent",
  eyebrow:"Il motore di confronto di Malta",h1a:"Ogni tasso, piano e tabella di Malta,",h1b:"fianco a fianco.",
  lead:"Conti, prestiti, mutui, carte, piani mobile e dove mangiare. Aggiornati ogni mattina in inglese, maltese e italiano.",
  ph:"es. miglior conto risparmio per €20k",compare:"Confronta",chips:["Tassi mutuo","Piani 5G","Conti business","Pranzo a La Valletta"],
  says:"Blue dice",quote:"Dimmi di cosa hai bisogno. Volo tra tutti i fornitori e ti riporto i tre migliori.",
  whatCmp:"Cosa stai confrontando?",allCats:"Tutte le categorie →",
  c:{banking:["Banca","Conti correnti e risparmio"],loans:["Prestiti e Mutui","Casa, personali, auto"],cards:["Carte di credito","Cashback, viaggi, TAEG basso"],business:["Business e fintech","Conti PMI, POS, cambio"],telco:["Telco","Mobile, fibra, pacchetti TV"],eat:["Ristoranti","Dove mangia Malta questa settimana"],markets:["Mercati e cambi","MSE, indici globali, valute"],today:["Malta oggi","Rassegna quotidiana"]},
  topEyebrow:"La tabella di oggi",topT:{savings:"Conti risparmio a Malta",mortgages:"Tassi dei mutui a Malta",mobile:"Piani mobile a Malta"},tabs:{savings:"Risparmio",mortgages:"Mutui",mobile:"Mobile"},
  thrush:"Punteggio Blue",bestPick:"Scelta migliore",viewDeal:"Vedi offerta",
  refreshed:"Tassi aggiornati ogni giorno alle {t} dai siti dei fornitori. CompareMalta.ai può ricevere una commissione, ma le classifiche non sono mai a pagamento.",
  morning:"Malta stamattina",readSum:"Leggi il riassunto →",fullMk:"Pagina completa dei mercati →",mkt:"Mercati",
  footTag:"Confronti indipendenti per la vita e il business a Malta. Aggiornati ogni giorno. English · Malti · Italiano.",fCompare:"Confronta",fDaily:"Ogni giorno",fAbout:"Chi siamo",fNews:"Notizie",fMarkets:"Mercati",fFx:"Cambi",fLoans:"Prestiti",fHow:"Come classifichiamo",fContact:"Contatti",
  filter:"Filtra…",sortBy:"Ordina per",updated:"Aggiornato",checked:"Verificato",notChecked:"Dati di catalogo",stale:"Ultimo valore noto",affiliated:"Parte correlata",
  all:"Tutti",sources:"Fonti",mse:"Borsa di Malta",global:"Indici globali e materie prime",crypto:"Cripto (EUR)",fx:"Tassi di cambio (BCE)",
  loanCalc:"Calcolatore prestito",mortCalc:"Calcolatore mutuo",fxCalc:"Convertitore di valuta",amount:"Importo (€)",amt:"Importo",rate:"Tasso d'interesse (% annuo)",years:"Durata (anni)",fee:"Spese iniziali (€)",
  monthly:"Rata mensile",totalPay:"Totale da rimborsare",totalInt:"Interessi totali",aprc:"TAEG stimato",price:"Prezzo dell'immobile (€)",deposit:"Anticipo (€)",from:"Da",to:"A",
  area:"Zona",cuisine:"Cucina",priceL:"Prezzo",openMaps:"Apri",diningLead:"Filtra per zona, cucina e budget.",todayDining:"I consigli di oggi",calc:"Strumenti",
  demo:"Modalità anteprima: i dati sono di esempio. I valori reali li sostituiscono al primo aggiornamento giornaliero.",
  disclaimer:"Non è consulenza finanziaria. Verifica sempre i tassi con il fornitore prima di aderire.",
  feeds:"Feed",low:"più basso è meglio",high:"più alto è meglio",free:"Gratis",unlimited:"Illimitati",results:"risultati",noRes:"Nessun risultato.",
  tip:"Il consiglio di Blue",tipTxt:"Guarda il costo totale, non solo il tasso: commissioni e condizioni possono cambiare la classifica.",mNo:"Blue ha cercato ovunque ma non ha trovato nulla. Prova un'altra parola.",
  howTitle:"Come classifichiamo",howTxt:"Ogni tabella è ordinata con il Punteggio Blue (da 0 a 10). Per ogni categoria scegliamo le metriche che contano di più (tasso, commissioni, velocità, dati), le normalizziamo tra tutti i fornitori (migliore = 1, peggiore = 0), le ponderiamo e le riportiamo su 10. I fornitori non possono pagare per cambiare posizione.",weights:"Pesi",
  contactTxt:"I contatti saranno pubblicati qui al lancio.",
  askSub:"Chiedi con parole semplici e trovo i tre migliori.",askHint:"Prova:",askChips:["Miglior risparmio per €20k","Mobile illimitato più economico","Conto business multivaluta","Pesce a Marsaxlokk"],
  askNone:"Non ho capito cosa confrontare. Prova un esempio o scegli una categoria.",askHere:"Ecco i tre migliori che ho trovato in",seeTable:"Vedi la tabella completa →",allCatsTitle:"Tutte le categorie"}
};
const COLS = {
 en:{provider:"Provider",product:"Product",monthly_fee:"Monthly fee",sepa_fee:"SEPA transfer",multi_currency:"Multi-currency",onboarding_days:"Onboarding (days)",licence:"Licence",card_fee:"Card fee / yr",atm_abroad_pct:"ATM abroad",app:"Mobile app",rate:"Rate",rate_aer:"Rate (AER)",access:"Access",term_months:"Term (months)",min_deposit:"Min. deposit",apr:"Interest",aprc:"APRC",max_amount:"Max amount",max_term_years:"Max term (yrs)",fees:"Fees",rate_type:"Type",ltv:"Max LTV",max_term:"Max term",first_time:"First-time buyer",annual_fee:"Annual fee",fx_fee:"FX fee",rewards:"Rewards",fx_markup:"FX markup",iban:"IBAN",corridor:"Corridor",fee:"Fee",fx_margin:"FX margin",speed:"Speed",price:"Per month",data_gb:"Data (GB)",eu_roaming_gb:"EU roaming (GB)",contract:"Contract",speed_mbps:"Speed (Mbps)",tv:"TV",type:"Type",from_price:"From / yr",online_quote:"Online quote",trade_fee:"Trade fee",custody_pct:"Custody / yr",mse_access:"MSE access",area:"Area",cuisine:"Cuisine",price_level:"Price",rating:"Rating",highlight:"Highlight",fee_pct:"Card fee",fee_fixed:"Per sale",reader_price:"Device from",tap_to_pay:"Tap to Pay on phone",free_allowance:"Fee-free sales / month",you_get:"You get for €1,000",fx_rate:"Exchange rate",total_cost_pct:"Total cost",markup:"FX markup",speed:"Speed",cost_5k:"Cost at €5k sales",cost_20k:"Cost at €20k sales",payout:"Payout",note:"Note"},
 mt:{provider:"Fornitur",product:"Prodott",monthly_fee:"Miżata fix-xahar",sepa_fee:"Trasferiment SEPA",multi_currency:"Multi-munita",onboarding_days:"Ftuħ (jiem)",licence:"Liċenzja",card_fee:"Miżata tal-karta/sena",atm_abroad_pct:"ATM barra",app:"App mobbli",rate:"Rata",rate_aer:"Rata (AER)",access:"Aċċess",term_months:"Terminu (xhur)",min_deposit:"Depożitu minimu",apr:"Imgħax",aprc:"APRC",max_amount:"Ammont massimu",max_term_years:"Terminu massimu (snin)",fees:"Miżati",rate_type:"Tip",ltv:"LTV massimu",max_term:"Terminu massimu",first_time:"L-ewwel dar",annual_fee:"Miżata annwali",fx_fee:"Miżata tal-kambju",rewards:"Premjijiet",fx_markup:"Markup tal-kambju",iban:"IBAN",corridor:"Rotta",fee:"Miżata",fx_margin:"Marġni tal-kambju",speed:"Ħeffa",price:"Fix-xahar",data_gb:"Data (GB)",eu_roaming_gb:"Roaming UE (GB)",contract:"Kuntratt",speed_mbps:"Veloċità (Mbps)",tv:"TV",type:"Tip",from_price:"Minn/sena",online_quote:"Kwotazzjoni online",trade_fee:"Miżata tat-trade",custody_pct:"Kustodja/sena",mse_access:"Aċċess għall-MSE",area:"Żona",cuisine:"Kċina",price_level:"Prezz",rating:"Klassifikazzjoni",highlight:"Speċjalità",fee_pct:"Miżata tal-karta",fee_fixed:"Għal kull bejgħ",reader_price:"Apparat minn",tap_to_pay:"Tap to Pay fuq it-telefon",free_allowance:"Bejgħ mingħajr miżata / xahar",you_get:"Tirċievi għal €1,000",fx_rate:"Rata tal-kambju",total_cost_pct:"Spiża totali",markup:"Marġni tal-kambju",speed:"Ħeffa",cost_5k:"Spiża b'€5k bejgħ",cost_20k:"Spiża b'€20k bejgħ",payout:"Ħlas lilek",note:"Nota"},
 it:{provider:"Fornitore",product:"Prodotto",monthly_fee:"Canone mensile",sepa_fee:"Bonifico SEPA",multi_currency:"Multivaluta",onboarding_days:"Apertura (giorni)",licence:"Licenza",card_fee:"Costo carta/anno",atm_abroad_pct:"Prelievo estero",app:"App mobile",rate:"Tasso",rate_aer:"Tasso (AER)",access:"Accesso",term_months:"Durata (mesi)",min_deposit:"Deposito minimo",apr:"Interesse",aprc:"TAEG",max_amount:"Importo massimo",max_term_years:"Durata max (anni)",fees:"Spese",rate_type:"Tipo",ltv:"LTV massimo",max_term:"Durata massima",first_time:"Prima casa",annual_fee:"Canone annuo",fx_fee:"Commissione cambio",rewards:"Premi",fx_markup:"Ricarico cambio",iban:"IBAN",corridor:"Tratta",fee:"Commissione",fx_margin:"Margine cambio",speed:"Velocità",price:"Al mese",data_gb:"Dati (GB)",eu_roaming_gb:"Roaming UE (GB)",contract:"Contratto",speed_mbps:"Velocità (Mbps)",tv:"TV",type:"Tipo",from_price:"Da/anno",online_quote:"Preventivo online",trade_fee:"Commissione trade",custody_pct:"Custodia/anno",mse_access:"Accesso MSE",area:"Zona",cuisine:"Cucina",price_level:"Prezzo",rating:"Valutazione",highlight:"Punto forte",fee_pct:"Commissione carta",fee_fixed:"Per vendita",reader_price:"Dispositivo da",tap_to_pay:"Tap to Pay su smartphone",free_allowance:"Vendite senza commissioni / mese",you_get:"Ricevi per €1.000",fx_rate:"Tasso di cambio",total_cost_pct:"Costo totale",markup:"Ricarico sul cambio",speed:"Velocità",cost_5k:"Costo con €5k di vendite",cost_20k:"Costo con €20k di vendite",payout:"Accredito",note:"Nota"}
};
const LOCALE = {en: "en-GB", mt: "mt-MT", it: "it-IT"};

/* nav sections → their categories (first = landing page) */
const SECTIONS = [
  ["banking", "nBanking", ["bank-accounts", "savings"]],
  ["loans", "nLoans", ["mortgages", "personal-loans"]],
  ["cards", "nCards", ["credit-cards"]],
  ["business", "nBusiness", ["business-accounts", "fintech"]],
  ["pos", "nPos", ["pos"]],
  ["fx", "nFx", ["fx", "money-transfer"]],
  ["telco", "nTelco", ["telco-mobile", "telco-broadband"]],
  ["eat", "nEat", ["dining", "restaurants"]],
  ["markets", "nMarkets", ["markets", "investing", "calculators"]],
];
const HOME_CARDS = [["banking","bank-accounts","bank-accounts"],["loans","mortgages","mortgages"],["cards","credit-cards","credit-cards"],["business","business-accounts","business-accounts"],
  ["telco","telco-mobile","telco-mobile"],["eat","dining","restaurants"],["markets","markets","investing"],["today","news","news"]];
const TOP = {savings:{cat:"savings",cols:[["rate","pct","rate_aer"],["min_deposit","eur0"],["access"]]},
             mortgages:{cat:"mortgages",cols:[["rate","pct"],["rate_type"],["ltv","pct0"]]},
             mobile:{cat:"telco-mobile",cols:[["price","eur"],["data_gb","num"],["contract"]]}};

/* ---------- state + helpers ---------- */
let lang = "en";
try { lang = localStorage.getItem("cm_lang") || ({mt: "mt", it: "it"}[(navigator.language || "en").slice(0, 2)] || "en"); } catch (e) {}
const QS = new URLSearchParams(location.search);  // links from the static pages: ?lang=mt, ?q=question, #ask
if (["en", "mt", "it"].includes(QS.get("lang"))) { lang = QS.get("lang"); try { localStorage.setItem("cm_lang", lang); } catch (e) {} }
if (!T[lang]) lang = "en";
let topTab = "savings";
const t = k => T[lang][k] ?? T.en[k] ?? k;
const D = {};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nf = (v, d = 2) => Number(v).toLocaleString(LOCALE[lang], {minimumFractionDigits: d, maximumFractionDigits: d});
const chg = v => `<span class="chg ${v >= 0 ? "up" : "down"}">${v >= 0 ? "▲" : "▼"} ${nf(Math.abs(v))}%</span>`;
const ago = iso => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleString(LOCALE[lang], {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}); };
const hhmm = iso => { const d = new Date(iso || Date.now()); return isNaN(d) ? "07:00" : d.toLocaleTimeString(LOCALE[lang], {hour: "2-digit", minute: "2-digit"}); };
const loc = (c, f) => c[`${f}_${lang}`] || c[`${f}_en`] || c[f];
const catTitle = c => loc(c, "title");
const colLabel = key => COLS[lang][key] || COLS.en[key] || key;
async function get(name) {
  if (name in D) return D[name];
  try { const r = await fetch(`data/${name}.json`, {cache: "no-cache"}); D[name] = await r.json(); } catch (e) { D[name] = null; }
  return D[name];
}
function fmt(v, f) {
  if (v === null || v === undefined || v === "") return '<span class="muted">-</span>';
  switch (f) {
    case "eur": return v === 0 ? `<span class="free">${t("free")}</span>` : "€" + nf(v);
    case "eur0": return "€" + nf(v, 0);
    case "pct": return nf(v) + "%";
    case "pct0": return nf(v, 0) + "%";
    case "num": return v >= 999 ? t("unlimited") : nf(v, 0);
    case "bool": return v ? '<span class="yes">✓</span>' : '<span class="no">✕</span>';
    case "price": return '<span class="price">' + "€".repeat(v) + "</span>";
    case "rating": return "★ " + nf(v, 1);
    case "amt": return nf(v, 2);
    case "rate": return nf(v, 4);
    default: return esc(v);
  }
}
const scoreCell = (r, best) => r.score === best ? `<span class="pick">${t("bestPick")}</span>` : `<span class="score">${nf(r.score || 0, 1)}<small> /10</small></span>`;
function spark(vals, w = 90, h = 26) {
  if (!vals || vals.length < 2) return "";
  const lo = Math.min(...vals), hi = Math.max(...vals), rng = hi - lo || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1) * w).toFixed(1)},${(h - 2 - (v - lo) / rng * (h - 4)).toFixed(1)}`).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}"><polyline fill="none" stroke="${vals[vals.length - 1] >= vals[0] ? "#18805b" : "#c03a2b"}" stroke-width="1.6" points="${pts}"/></svg>`;
}
/* "Malta this morning / afternoon / evening" follows the time in Malta (05-12, 12-18, 18-05) */
const maltaHour = () => +new Intl.DateTimeFormat("en-GB", {hour: "numeric", hourCycle: "h23", timeZone: "Europe/Malta"}).format(new Date());
const dayPart = () => { const h = maltaHour(); return h >= 5 && h < 12 ? "mMorning" : h >= 12 && h < 18 ? "mAfternoon" : "mEvening"; };
const maltaTime = iso => { const d = new Date(iso || Date.now()); return isNaN(d) ? "" : d.toLocaleTimeString(LOCALE[lang], {hour: "2-digit", minute: "2-digit", timeZone: "Europe/Malta"}); };
const sectionOf = route => (SECTIONS.find(s => s[2].includes(route)) || [])[0];

/* ---------- chrome ---------- */
function renderNav(route) {
  const active = sectionOf(route);
  $("#nav").innerHTML = SECTIONS.map(([k, label, cats]) => `<a href="#${cats[0]}" class="${k === active ? "on" : ""}">${t(label)}</a>`).join("");
  document.querySelectorAll("#langSeg button").forEach(b => b.classList.toggle("on", b.dataset.l === lang));
  $("#askBtn").textContent = t("ask");
  document.documentElement.lang = lang;
}
async function renderChrome() {
  const [fx, mk, st, news] = await Promise.all([get("fx"), get("markets"), get("status"), get("news")]);
  const r = c => (fx?.rates || []).find(x => x.ccy === c);
  const g = rx => (mk?.global || []).find(x => rx.test(x.name));
  const tick = (label, value, pct) => {
    const dir = pct == null || Math.abs(pct) < 0.005 ? "flat" : pct > 0 ? "up" : "down";
    const ind = dir === "flat" ? `<i class="ti flat">●</i>` : `<i class="ti ${dir}">${dir === "up" ? "▲" : "▼"} ${nf(Math.abs(pct))}%</i>`;
    return `<span class="tk ${dir}"><em>${esc(label)}</em><b>${value}</b>${ind}</span>`;
  };
  const items = [];
  for (const c of ["USD", "GBP", "CHF", "TRY"]) if (r(c)) items.push(tick(`EUR/${c}`, nf(r(c).rate, 4), r(c).change_pct));
  if (mk?.mse_index) items.push(tick(t("mseIdx"), nf(mk.mse_index.value, 2), mk.mse_index.change_pct));
  if (fx?.policy) items.push(tick(t("ecb"), nf(fx.policy.rate) + "%", null));
  for (const [rx, label, pre] of [[/brent/i, t("brent"), "$"], [/gold/i, "Gold", "$"], [/s&p/i, "S&P 500", ""], [/stoxx/i, "Euro Stoxx 50", ""], [/dax/i, "DAX", ""], [/ftse/i, "FTSE 100", ""]]) {
    const x = g(rx); if (x) items.push(tick(label, pre + nf(x.price), x.change_pct));
  }
  for (const s of (mk?.mse || []).filter(x => ["BOV", "HSB", "APS", "GO", "MIA", "RS2", "LOM", "SFC"].includes(x.symbol))) items.push(tick(`MSE: ${s.symbol}`, "€" + nf(s.price, 3), s.change_pct));
  for (const c of (mk?.crypto || []).slice(0, 2)) items.push(tick(c.name, "€" + nf(c.price, 0), c.change_pct));
  const run = items.join("");
  $("#strip").innerHTML = `<span class="live"><i class="pulse"></i>${t("live").toUpperCase()}</span>
    <div class="tick-view"><div class="tick-track" id="tickTrack"><div class="tick-set">${run}</div><div class="tick-set" aria-hidden="true">${run}</div></div></div>`;
  requestAnimationFrame(() => { const set = document.querySelector(".tick-set"); const tr = $("#tickTrack");
    if (set && tr) tr.style.animationDuration = Math.max(25, set.scrollWidth / 55) + "s"; });
  const b = $("#demoBanner"); b.hidden = !(fx?.demo || mk?.demo || news?.demo); b.textContent = t("demo");
  $("#footIn").innerHTML = `
    <div><a href="#home" class="logo"><span class="logo-mark">${V.logo(30)}</span><span>CompareMalta<span class="ai">.ai</span></span></a><p>${t("footTag")}</p></div>
    <div><h4>${t("fCompare")}</h4><ul><li><a href="#bank-accounts">${t("nBanking")}</a></li><li><a href="#mortgages">${t("fLoans")}</a></li><li><a href="#telco-mobile">${t("nTelco")}</a></li><li><a href="#categories">${t("allCatsTitle")}</a></li></ul></div>
    <div><h4>${t("fDaily")}</h4><ul><li><a href="#news">${t("fNews")}</a></li><li><a href="#markets">${t("fMarkets")}</a></li><li><a href="#markets">${t("fFx")}</a></li><li><a href="#newsletter">${t("nlNav")}</a></li></ul></div>
    <div><h4>${t("fAbout")}</h4><ul><li><a href="#how-we-rank">${t("fHow")}</a></li><li><a href="#partners">${t("fPartner")}</a></li><li><a href="#contact">${t("fContact")}</a></li></ul></div>`;
  $("#footDisclaimer").textContent = t("disclaimer");
  if (st) $("#footStatus").innerHTML = `<span class="dot ${st.total && st.ok / st.total > .8 ? "" : "warn"}"></span>${t("feeds")} ${st.ok}/${st.total} · ${t("updated")} ${ago(st.generated)}`;
  document.querySelectorAll("header .logo-mark").forEach(e => e.innerHTML = V.logo(32));
  $("#askBird").innerHTML = V.mascot(64, "wink");
  $("#askTitle").textContent = t("ask"); $("#askSub").textContent = t("askSub");
  $("#askQ").placeholder = t("ph"); $("#askGo").textContent = t("compare");
  $("#askChips").innerHTML = `<span class="muted" style="font-size:12.5px;align-self:center">${t("askHint")}</span>` + t("askChips").map(c => `<button class="chip" type="button">${esc(c)}</button>`).join("");
  document.querySelectorAll("#askChips .chip").forEach(c => c.onclick = () => { $("#askQ").value = c.textContent; runAsk(); });
}


/* ---------- outbound links + calls to action ---------- */
const CTA_FOR = {"bank-accounts":"ctaOpen",savings:"ctaOpen","business-accounts":"ctaOpen",fintech:"ctaOpen",investing:"ctaOpen","personal-loans":"ctaApply",mortgages:"ctaApply",
  "credit-cards":"ctaApply","telco-mobile":"ctaPlan","telco-broadband":"ctaPlan",insurance:"ctaQuote","money-transfer":"ctaSend",fx:"ctaSend",restaurants:"ctaBook",pos:"ctaPos"};
function outLink(url, slug, content) {
  if (!url || !/^https?:/i.test(url)) return url || "#";
  if (/google\.[a-z.]+\/maps|maps\.app\.goo/.test(url)) return url;
  try { const u = new URL(url); u.searchParams.set("utm_source", "comparemalta.ai"); u.searchParams.set("utm_medium", "comparison");
    u.searchParams.set("utm_campaign", slug || "general"); if (content) u.searchParams.set("utm_content", content); return u.toString(); } catch (e) { return url; }
}
const searchUrl = r => `https://www.google.com/search?q=${encodeURIComponent(r.provider + " Malta")}`;
const siteUrl = r => r.url && r.url_ok !== false ? r.url : (r.maps || searchUrl(r));
const applyUrl = r => r.apply_url || siteUrl(r);
function ctaBtn(r, slug, primary = true, size = "sm") {
  const href = outLink(applyUrl(r), slug, "cta");
  return `<a class="btn cta ${primary ? "" : "ghost"} ${size}" href="${esc(href)}" target="_blank" rel="noopener sponsored" data-p="${esc(r.provider)}">${t(CTA_FOR[slug] || "ctaApply")} <span class="arr">→</span></a>`;
}
const visitLink = (r, slug) => r.url ? `<a class="visit" href="${esc(outLink(siteUrl(r), slug, "visit"))}" target="_blank" rel="noopener sponsored">${t("visit")} ↗</a>` : "";
const ctaCell = (r, slug, primary) => `<td class="cta-cell">${ctaBtn(r, slug, primary)}${visitLink(r, slug)}</td>`;

/* provider logo (downloaded weekly by feeds/logos.py) with the monogram as fallback */
// swap to the monogram when an image fails, or when the icon service only has a tiny default globe
window.CMlogo = (img, failed) => {
  if (failed || (img.dataset.fav && img.naturalWidth < 32)) img.parentNode.outerHTML = window.CMV.mono(img.alt, +img.dataset.size || 34);
};
function favicon(url) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    if (/(^|\.)google\./.test(h) || /maps\./.test(h)) return null;  // restaurants link to Maps, no brand icon there
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(h)}&sz=128`;
  } catch { return null; }
}
function brand(r, size = 34) {
  const m = V.mono(r.provider, size);
  const src = r.logo || favicon(r.url);  // fetched logo first, then the provider's own site icon, then the monogram
  if (!src) return m;
  return `<span class="plogo ${r.logo_light ? "dark" : ""}" style="width:${size}px;height:${size}px"><img src="${esc(src)}" alt="${esc(r.provider)}" data-size="${size}" ${r.logo ? "" : 'data-fav="1"'} onload="CMlogo(this)" onerror="CMlogo(this,1)"></span>`;
}

/* ---------- shared blocks ---------- */
const mkRowDark = (label, val) => `<div class="mk-row"><span>${esc(label)}</span><b>${val}</b></div>`;
const mkRow = r => { const mse = /^[A-Z0-9]{2,5}$/.test(r.symbol || "");
  return `<div class="mk-row"><span class="n"><b>${esc(mse ? r.symbol : r.name)}</b><small>${esc(mse ? r.name : "")}</small></span><span style="text-align:right">${nf(r.price, r.price < 10 ? 3 : 2)}<br>${chg(r.change_pct)}</span></div>`; };
const newsImg = n => n.image ? `<img class="thumb" src="${esc(n.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" ${n.image_src ? `data-alt="${esc(n.image_src)}"` : ""} onerror="if(this.dataset.alt&&this.src!==this.dataset.alt){this.src=this.dataset.alt}else{this.outerHTML=window.CMV.newsThumb('${esc(n.topic)}')}">` : V.newsThumb(n.topic);
const newsList = items => items.length ? items.map(n => `
  <a class="news-item" href="${esc(n.url)}" target="_blank" rel="noopener">
    <div class="news-img">${newsImg(n)}</div>
    <div><div class="meta"><span class="t">${esc(n.topic)}</span>${esc(n.source)}${n.published ? " · " + ago(n.published) : ""}</div>
    <h3>${esc(n.title)}</h3><div class="muted" style="font-size:14px">${esc(n.summary)}</div></div>
  </a>`).join("") : `<div class="empty">${V.mascot(56)}<span>${t("mNo")}</span></div>`;
const dishCard = (r, i) => `
  <div class="card dish">
    <div class="dish-img">${r.photo ? `<img class="cover" src="${esc(r.photo)}" alt="${esc(r.provider)}" loading="lazy">` : V.foodCover(r.provider, r.cuisine)}<span class="num">${i + 1}</span></div>
    <div class="dish-body">
      <div class="meta">${esc(r.area)} · ${esc(r.cuisine)}</div>
      <h3>${esc(r.provider)}${r.featured ? ` <span class="feat">${t("featured")}</span>` : ""}</h3>
      <div><span class="price">${"€".repeat(r.price_level || 2)}</span>${r.rating ? ` · ★ ${nf(r.rating, 1)} <span class="muted">(${r.reviews || 0})</span>` : ""}</div>
      <p class="hl">${esc(r.highlight || "")}</p>
      <div class="dish-cta">${ctaBtn(r, "restaurants", true)}${r.maps ? `<a class="visit" href="${esc(r.maps)}" target="_blank" rel="noopener">${t("dirs")} ↗</a>` : ""}</div>
    </div>
  </div>`;
const provCell = (r, sub, slug) => `<div class="prov">${brand(r, 34)}<div>${r.url ? `<a class="pname" href="${esc(outLink(siteUrl(r), slug, "name"))}" target="_blank" rel="noopener sponsored">${esc(r.provider)}</a>` : esc(r.provider)}${r.affiliated ? `<span class="aff">${t("affiliated")}</span>` : ""}<small>${sub}</small></div></div>`;

/* ---------- home ---------- */
async function topTableHtml() {
  const spec = TOP[topTab], data = await get("cat-" + spec.cat);
  const rows = (data?.items || []).slice(0, 3), best = Math.max(...rows.map(r => r.score || 0));
  return `<table><thead><tr><th>${colLabel("provider")}</th>${spec.cols.map(([k, , lab]) => `<th>${colLabel(lab || k)}</th>`).join("")}<th>${t("thrush")}</th><th></th></tr></thead><tbody>
    ${rows.map((r, i) => `<tr><td>${provCell(r, esc(r.product || ""), spec.cat)}</td>
      ${spec.cols.map(([k, f], j) => `<td class="${j === 0 ? "key" : ""}">${fmt(r[k], f)}</td>`).join("")}
      <td>${scoreCell(r, best)}</td>
      ${ctaCell(r, spec.cat, i === 0)}</tr>`).join("")}
  </tbody></table>`;
}
async function pageHome() {
  const [news, mk, fx, st] = await Promise.all([get("news"), get("markets"), get("fx"), get("status")]);
  const items = news?.items || [];
  const pickTopic = (tp, not) => items.find(n => n.topic === tp && n !== not) || items.find(n => n !== not);
  const n1 = pickTopic("Business"), n2 = pickTopic("Property", n1);
  const r = c => (fx?.rates || []).find(x => x.ccy === c);
  const stoxx = (mk?.global || []).find(x => /stoxx/i.test(x.name));
  return `
  <div class="wrap">
  <section class="hero">
    <div>
      <p class="eyebrow">${t("eyebrow")}</p>
      <h1>${t("h1a")}<br><span class="blue">${t("h1b")}</span></h1>
      <p class="lead">${t("lead")}</p>
      <form class="search" id="heroForm"><input id="heroQ" placeholder="${t("ph")}" autocomplete="off"><button class="btn navy">${t("compare")}</button></form>
      <div class="chips">${t("chips").map(c => `<button class="chip" type="button" data-q="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    </div>
    <div class="hero-card">${V.hero()}<div class="says"><p class="eyebrow">${t("says")}</p><p>“${t("quote")}”</p></div></div>
  </section>

  <section class="section" style="padding-top:20px">
    <div class="sec-head"><h2>${t("whatCmp")}</h2><a class="link" href="#categories">${t("allCats")}</a></div>
    <div class="grid g4">${HOME_CARDS.map(([k, route, ic]) => { const [title, sub] = t("c")[k];
      return `<a class="card cat2 ${k === "today" ? "dark" : ""}" href="#${route}"><span class="cb">${V.catBanner(k, k === "today")}</span><span class="cbody"><h3>${esc(title)}</h3><p>${esc(sub)}</p><span class="go">→</span></span></a>`; }).join("")}</div>
  </section>
  </div>

  <section class="section band">
    <div class="wrap">
      <p class="eyebrow">${t("topEyebrow")}</p>
      <div class="sec-head"><h2 id="topTitle">${t("topT")[topTab]}</h2>
        <div class="seg" id="topTabs">${Object.keys(TOP).map(k => `<button data-k="${k}" class="${k === topTab ? "on" : ""}">${t("tabs")[k]}</button>`).join("")}</div></div>
      <div class="tbl" id="topTbl">${await topTableHtml()}</div>
      <p class="note">${t("refreshed").replace("{t}", hhmm(st?.generated))}</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head"><div><h2>${t(dayPart())}</h2><p class="note" style="margin:4px 0 0">${t("newsAt")} ${maltaTime(news?.updated)}</p></div><a class="link" href="#news">${t("nNews")} →</a></div>
      <div class="grid g3">
        ${[n1, n2].filter(Boolean).map(n => `<div class="card news-card"><a class="nc-img" href="${esc(n.url)}" target="_blank" rel="noopener" tabindex="-1">${newsImg(n)}</a><div class="nc-body"><p class="eyebrow">${esc(n.topic)}</p><div class="src">${esc(n.source)}${n.published ? " · " + ago(n.published) : ""}</div><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><a class="link" href="${esc(n.url)}" target="_blank" rel="noopener">${t("readSum")}</a></div></div>`).join("")}
        <div class="card mk-card"><p class="eyebrow">${t("mkt")}</p>
          ${mk?.mse_index ? mkRowDark(mk.mse_index.name.replace("MSE ", "MSE "), nf(mk.mse_index.value, 2)) : ""}
          ${stoxx ? mkRowDark("EURO STOXX 50", nf(stoxx.price, 2)) : ""}
          ${r("USD") ? mkRowDark("EUR / USD", nf(r("USD").rate, 4)) : ""}
          ${r("TRY") ? mkRowDark("EUR / TRY", nf(r("TRY").rate, 4)) : ""}
          </div>
      </div>
    </div>
  </section>
  ${nlBand()}
  ${partnerBand()}`;
}
function bindHome() {
  const f = $("#heroForm"); if (!f) return;
  f.onsubmit = e => { e.preventDefault(); openAsk($("#heroQ").value); };
  document.querySelectorAll(".hero .chip").forEach(c => c.onclick = () => openAsk(c.dataset.q));
  document.querySelectorAll("#topTabs button").forEach(b => b.onclick = async () => {
    topTab = b.dataset.k;
    document.querySelectorAll("#topTabs button").forEach(x => x.classList.toggle("on", x === b));
    $("#topTitle").textContent = t("topT")[topTab];
    $("#topTbl").innerHTML = await topTableHtml();
  });
}

/* ---------- category pages ---------- */
async function pageCategory(slug) {
  const [cats, data] = await Promise.all([get("categories"), get("cat-" + slug)]);
  const cfg = cats.config[slug];
  if (!cfg || !data) return `<div class="wrap"><p>${t("noRes")}</p></div>`;
  const sec = SECTIONS.find(s => s[2].includes(slug));
  const siblings = sec ? sec[2].filter(k => cats.config[k]) : [slug];
  const extra = cfg.calculator ? `<div class="section grid g2" style="padding-bottom:0">${cfg.calculator === "loan" ? loanCalcHtml() : mortCalcHtml()}</div>` : "";
  const weights = cfg.score.map(s => `${colLabel(s.key)} ${Math.round(s.w * 100)}% (${t(s.dir)})`).join(" · ");
  setTimeout(() => bindTable(cfg, data.items, slug), 0);
  return `<div class="wrap">
  <div class="page-head with-ic">
    <span class="ph-ic">${V.catIcon(slug, 64)}</span>
    <p class="eyebrow">${esc(sec ? t(sec[1]) : t("allCatsTitle"))}</p>
    <h1 style="font-size:clamp(32px,4vw,48px)">${esc(catTitle(cfg))}</h1>
    <p>${esc(loc(cfg, "intro"))}</p>
  </div>
  ${siblings.length > 1 ? `<div class="chips">${siblings.map(k => `<a class="chip ${k === slug ? "on" : ""}" href="#${k}">${V.icon(k, 15)} ${esc(catTitle(cats.config[k]))}</a>`).join("")}</div>` : ""}
  ${data.corridors ? `<div class="chips" id="fxc">${data.corridors.map((c, i) => `<button type="button" class="chip ${i === 0 ? "on" : ""}" data-c="${c}">EUR → ${c}</button>`).join("")}</div>` : ""}
  <div class="toolbar">
    <input id="flt" placeholder="${t("filter")}">
    <select id="srt"><option value="score">${t("sortBy")}: ${t("thrush")}</option>${cfg.columns.filter(c => c.fmt && c.fmt !== "bool").map(c => `<option value="${c.key}">${t("sortBy")}: ${esc(colLabel(c.key))}</option>`).join("")}</select>
    <span class="fresh">${t("updated")} ${ago(data.updated)}</span>
  </div>
  <div class="tbl"><table><thead><tr>${cfg.columns.map(c => `<th data-k="${c.key}">${esc(colLabel(c.key))}</th>`).join("")}<th data-k="score">${t("thrush")}</th><th></th></tr></thead><tbody id="tb"></tbody></table></div>
  <div class="tip">${V.mascot(60)}<div><b>${t("tip")}</b><br>${t("tipTxt")}</div></div>
  <p class="note"><b>${t("howTitle")}:</b> ${t("weights")}: ${esc(weights)}. <a class="link" href="#how-we-rank">${t("fHow")} →</a></p>
  ${extra}
  <div style="height:40px"></div></div>`;
}
function bindTable(cfg, items, slug) {
  let key = "score", dir = -1;
  const lowKeys = new Set(cfg.score.filter(s => s.dir === "low").map(s => s.key));
  const keyCol = (cfg.score.find(s => cfg.columns.some(c => c.key === s.key && c.fmt && c.fmt !== "bool")) || {}).key;
  let best = Math.max(...items.map(r => r.score || 0));
  const draw = () => {
    const q = ($("#flt")?.value || "").toLowerCase();
    const cur = $("#fxc .on")?.dataset.c;
    const rows = items.filter(r => (!cur || r.corridor === cur) && (!q || JSON.stringify(r).toLowerCase().includes(q)))
      .sort((a, b) => { const x = a[key], y = b[key]; return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * dir; });
    best = Math.max(...rows.map(r => r.score || 0));
    $("#tb").innerHTML = rows.length ? rows.map((r, i) => `<tr>
      ${cfg.columns.map((c, j) => j === 0 ? `<td>${provCell(r, r.checked ? `${r.stale ? t("stale") : t("checked")} ${ago(r.checked)}` : t("notChecked"), slug)}</td>`
        : `<td class="${c.key === keyCol ? "key" : ""}">${fmt(r[c.key], c.fmt)}</td>`).join("")}
      <td>${scoreCell(r, best)}</td>
      ${ctaCell(r, slug, r.score === best)}</tr>${r.note ? `<tr class="note-row"><td colspan="99">ⓘ ${esc(r.note)}</td></tr>` : ""}`).join("")
      : `<tr><td colspan="99"><div class="empty">${V.mascot(80)}<span>${t("mNo")}</span></div></td></tr>`;
    document.querySelectorAll("th").forEach(th => th.classList.toggle("sorted", th.dataset.k === key));
  };
  $("#flt").oninput = draw;
  document.querySelectorAll("#fxc button").forEach(b => b.onclick = () => { document.querySelectorAll("#fxc button").forEach(x => x.classList.toggle("on", x === b)); draw(); });
  $("#srt").onchange = e => { key = e.target.value; dir = key === "score" ? -1 : (lowKeys.has(key) ? 1 : -1); draw(); };
  document.querySelectorAll("th[data-k]").forEach(th => th.onclick = () => { const k = th.dataset.k; dir = key === k ? -dir : (k === "score" ? -1 : lowKeys.has(k) ? 1 : -1); key = k; draw(); });
  draw(); bindCalcs();
}

/* ---------- other pages ---------- */
async function pageCategories() {
  const cats = await get("categories");
  return `<div class="wrap"><div class="page-head"><p class="eyebrow">${t("eyebrow")}</p><h1 style="font-size:clamp(32px,4vw,48px)">${t("allCatsTitle")}</h1></div>
  <div class="grid g4" style="margin:20px 0 50px">${cats.index.map(c => `<a class="card cat2" href="#${c.slug}"><span class="cb">${V.catBanner(c.slug)}</span><span class="cbody"><h3>${esc(catTitle(cats.config[c.slug]))}</h3><p>${c.count} ${t("results")}</p><span class="go">→</span></span></a>`).join("")}
    <a class="card cat2 dark" href="#news"><span class="cb">${V.catBanner("news", true)}</span><span class="cbody"><h3>${t("c").today[0]}</h3><p>${t("c").today[1]}</p><span class="go">→</span></span></a>
    <a class="card cat2" href="#markets"><span class="cb">${V.catBanner("markets")}</span><span class="cbody"><h3>${t("c").markets[0]}</h3><p>${t("c").markets[1]}</p><span class="go">→</span></span></a></div></div>`;
}
async function pageNews() {
  const news = await get("news"); const items = news?.items || [];
  const topics = [...new Set(items.map(n => n.topic))], sources = [...new Set(items.map(n => n.source))];
  setTimeout(() => {
    let tp = "", sr = "";
    const draw = () => { $("#nl").innerHTML = newsList(items.filter(n => (!tp || n.topic === tp) && (!sr || n.source === sr))); };
    document.querySelectorAll("[data-tp]").forEach(b => b.onclick = () => { tp = b.dataset.tp; document.querySelectorAll("[data-tp]").forEach(x => x.classList.toggle("on", x === b)); draw(); });
    document.querySelectorAll("[data-sr]").forEach(b => b.onclick = () => { sr = b.dataset.sr; document.querySelectorAll("[data-sr]").forEach(x => x.classList.toggle("on", x === b)); draw(); });
    draw();
  }, 0);
  return `<div class="wrap"><div class="page-head"><p class="eyebrow">${t("fDaily")}</p><h1 style="font-size:clamp(32px,4vw,48px)">${t(dayPart())}</h1><p>${t("newsAt")} ${maltaTime(news?.updated)}</p></div>
    <div class="chips"><button class="chip on" data-tp="">${t("all")}</button>${topics.map(x => `<button class="chip" data-tp="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    <div class="chips"><button class="chip on" data-sr="">${t("sources")}: ${t("all")}</button>${sources.map(x => `<button class="chip" data-sr="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    <div class="card" id="nl" style="margin:18px 0 50px"></div></div>`;
}
async function pageMarkets() {
  const [mk, fx] = await Promise.all([get("markets"), get("fx")]);
  return `<div class="wrap"><div class="page-head"><p class="eyebrow">${t("fDaily")}</p><h1 style="font-size:clamp(32px,4vw,48px)">${t("c").markets[0]}</h1><p>${t("updated")} ${ago(mk?.updated)}${mk?.mse_index ? ` · ${esc(mk.mse_index.name)} <b>${nf(mk.mse_index.value)}</b>` : ""}${fx?.policy ? ` · ${t("ecb")} <b>${nf(fx.policy.rate)}%</b>` : ""}</p></div>
  <div class="grid g2">
    <div class="card mk-list"><h2 style="font-size:24px">${t("mse")}</h2>${(mk?.mse || []).map(mkRow).join("")}</div>
    <div class="card mk-list"><h2 style="font-size:24px">${t("global")}</h2>${(mk?.global || []).map(mkRow).join("")}<h2 style="font-size:24px;margin-top:20px">${t("crypto")}</h2>${(mk?.crypto || []).map(mkRow).join("")}</div>
  </div>
  <div class="grid g2 section">
    <div class="card mk-list"><h2 style="font-size:24px">${t("fx")}</h2><p class="note">${esc(fx?.source || "")} · ${esc(fx?.date || "")}</p>
      ${(fx?.rates || []).map(r => `<div class="mk-row"><span class="n"><b>EUR/${r.ccy}</b></span>${spark(r.spark)}<span style="text-align:right">${nf(r.rate, 4)}<br>${chg(r.change_pct)}</span></div>`).join("")}</div>
    <div>${fxCalcHtml(fx)}<div style="height:14px"></div>${loanCalcHtml()}</div>
  </div></div>`;
}
async function pageDining() {
  const [dining, data] = await Promise.all([get("dining"), get("cat-restaurants")]);
  const items = data?.items || [];
  const areas = [...new Set(items.map(r => r.area))].sort(), cuis = [...new Set(items.map(r => r.cuisine))].sort();
  setTimeout(() => {
    const draw = () => { const a = $("#fa").value, c = $("#fc").value, p = +$("#fp").value;
      $("#dl").innerHTML = items.filter(r => (!a || r.area === a) && (!c || r.cuisine === c) && (!p || r.price_level <= p)).map(dishCard).join("") || `<div class="empty">${V.mascot(56)}<span>${t("mNo")}</span></div>`; };
    ["#fa", "#fc", "#fp"].forEach(s => $(s).onchange = draw); draw();
  }, 0);
  return `<div class="wrap"><div class="page-head"><p class="eyebrow">${t("nEat")}</p><h1 style="font-size:clamp(32px,4vw,48px)">${t("c").eat[0]}</h1><p>${t("diningLead")}</p></div>
  <h2 style="font-size:24px">${t("todayDining")}</h2><div class="grid g3">${(dining?.picks || []).map(dishCard).join("")}</div>
  <div class="toolbar section" style="padding-bottom:0">
    <select id="fa"><option value="">${t("area")}: ${t("all")}</option>${areas.map(x => `<option>${esc(x)}</option>`).join("")}</select>
    <select id="fc"><option value="">${t("cuisine")}: ${t("all")}</option>${cuis.map(x => `<option>${esc(x)}</option>`).join("")}</select>
    <select id="fp"><option value="0">${t("priceL")}: ${t("all")}</option><option value="1">€</option><option value="2">≤ €€</option><option value="3">≤ €€€</option></select>
  </div><div class="grid g3" id="dl" style="margin-bottom:50px"></div></div>`;
}
async function pageCalcs() { const fx = await get("fx"); setTimeout(bindCalcs, 0);
  return `<div class="wrap"><div class="page-head"><h1 style="font-size:clamp(32px,4vw,48px)">${t("calc")}</h1></div><div class="grid g3" style="margin-bottom:50px">${loanCalcHtml()}${mortCalcHtml()}${fxCalcHtml(fx)}</div></div>`; }
async function pageHow() {
  const cats = await get("categories");
  return `<div class="wrap"><div class="page-head"><p class="eyebrow">${t("fAbout")}</p><h1 style="font-size:clamp(32px,4vw,48px)">${t("howTitle")}</h1><p>${t("howTxt")}</p></div>
  <div class="tbl" style="margin:20px 0 50px"><table><thead><tr><th>${t("allCatsTitle")}</th><th>${t("weights")}</th></tr></thead><tbody>
  ${Object.entries(cats.config).map(([k, c]) => `<tr><td><b>${esc(catTitle(c))}</b></td><td>${c.score.map(s => `${esc(colLabel(s.key))} ${Math.round(s.w * 100)}% <span class="muted">(${t(s.dir)})</span>`).join(" · ")}</td></tr>`).join("")}
  </tbody></table></div></div>`;
}
const pageContact = async () => `<div class="wrap"><div class="page-head"><p class="eyebrow">${t("fAbout")}</p><h1 style="font-size:clamp(32px,4vw,48px)">${t("fContact")}</h1><div class="tip">${V.mascot(60)}<div>${t("contactTxt")}</div></div></div><div style="height:60px"></div></div>`;


async function pagePartners() {
  setTimeout(bindPartners, 0);
  const types = t("pTypes");
  return `<div class="wrap"><div class="partners">
    <div class="p-left">
      <p class="eyebrow">${t("pEyebrow")}</p>
      <h1 style="font-size:clamp(32px,4vw,46px)">${t("pTitle")}</h1>
      <p class="lead2">${t("pLead")}</p>
      <ul class="p-why">${t("pWhy").map(w => `<li>${V.icon("insurance", 18)}<span>${esc(w)}</span></li>`).join("")}</ul>
      <div class="p-bird">${V.mascot(120, "wink")}</div>
    </div>
    <form class="card p-form" id="pForm" novalidate>
      <div class="grid g2"><label>${t("pName")}<input name="name" required maxlength="100" autocomplete="name"></label>
        <label>${t("pCompany")}<input name="company" required maxlength="120" autocomplete="organization"></label></div>
      <label>${t("pEmail")}<input name="email" type="email" required maxlength="160" autocomplete="email"></label>
      <label>${t("pType")}<select name="topic">${types.map((x, i) => `<option value="${i}">${esc(x)}</option>`).join("")}</select></label>
      <label>${t("pMsg")}<textarea name="message" rows="5" maxlength="3000" required></textarea></label>
      <input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <label class="chk"><input type="checkbox" name="consent" required><span>${t("pConsent")}</span></label>
      <button class="btn cta" type="submit">${t("pSend")} <span class="arr">→</span></button>
      <p class="p-status" id="pStatus" role="status"></p>
    </form>
  </div></div><div style="height:50px"></div>`;
}
function bindPartners() {
  const f = $("#pForm"); if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    const d = Object.fromEntries(new FormData(f).entries());
    if (d.website) return;  // honeypot
    const st = $("#pStatus"), btn = f.querySelector("button"); btn.disabled = true; st.className = "p-status";
    const body = {name: d.name, company: d.company, email: d.email, topic: T.en.pTypes[+d.topic] || "Other", message: d.message, lang, page: location.href};
    let ok = false;
    try {
      const base = (window.CM_AGENT_URL || "").replace(/\/$/, "");
      const url = window.CM_CONTACT_ENDPOINT || (base ? `${base}/contact` : "");
      if (url) { const r = await fetch(url, {method: "POST", headers: {"content-type": "application/json", accept: "application/json"}, body: JSON.stringify(body)}); ok = r.ok; }
    } catch (err) { ok = false; }
    btn.disabled = false;
    if (ok) { f.reset(); st.textContent = t("pOk"); st.classList.add("ok"); }
    else { st.innerHTML = esc(t("pErr")) + (window.CM_CONTACT_EMAIL ? ` <a class="link" href="mailto:${esc(window.CM_CONTACT_EMAIL)}">${esc(window.CM_CONTACT_EMAIL)}</a>` : ""); st.classList.add("err"); }
  };
}
const partnerBand = () => `<section class="section"><div class="wrap"><div class="p-band">
  <div class="pb-bird">${V.mascot(96, "wink")}</div>
  <div class="pb-txt"><p class="eyebrow" style="color:var(--peach)">${t("pEyebrow")}</p><h2>${t("pBand")}</h2><p>${t("pBandSub")}</p></div>
  <a class="btn cta lg" href="#partners">${t("pCta")} <span class="arr">→</span></a></div></div></section>`;


/* ---------- weekly newsletter ---------- */
const nlForm = (source) => `<form class="nl-form" data-src="${source}" novalidate>
  <div class="nl-row"><input type="email" name="email" placeholder="${t("nlPh")}" autocomplete="email" required maxlength="190"><button class="btn cta" type="submit">${t("nlBtn")} <span class="arr">→</span></button></div>
  <input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
  <label class="nl-chk"><input type="checkbox" name="consent" required><span>${t("nlConsent")}</span></label>
  <p class="nl-status" role="status"></p></form>`;
const nlBand = () => `<section class="section" style="padding-bottom:0"><div class="wrap"><div class="nl-band">
  <div class="nl-bird">${V.mascot(110)}</div>
  <div class="nl-txt"><p class="eyebrow">${t("nlEyebrow")}</p><h2>${t("nlTitle")}</h2><p>${t("nlSub")}</p></div>
  <div class="nl-side">${nlForm("home")}</div></div></div></section>`;
function bindNewsletter() {
  document.querySelectorAll(".nl-form").forEach(f => f.onsubmit = async e => {
    e.preventDefault();
    const st = f.querySelector(".nl-status"), btn = f.querySelector("button"), d = Object.fromEntries(new FormData(f).entries());
    st.className = "nl-status";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email || "") || !d.consent) { st.textContent = t("nlBad"); st.classList.add("err"); return; }
    btn.disabled = true; let res = null;
    try {
      const base = (window.CM_AGENT_URL || "").replace(/\/$/, "");
      const r = await fetch(window.CM_NEWSLETTER_ENDPOINT || `${base}/subscribe`, {method: "POST", headers: {"content-type": "application/json"},
        body: JSON.stringify({email: d.email, consent: true, lang, source: f.dataset.src, website: d.website || ""})});
      if (r.ok) res = await r.json();
    } catch (err) { res = null; }
    btn.disabled = false;
    if (res?.ok) { f.reset(); st.textContent = res.double_opt_in ? t("nlOk") : t("nlOkDirect"); st.classList.add("ok"); }
    else { st.textContent = t("nlErr"); st.classList.add("err"); }
  });
}
async function pageNewsletter() {
  const nl = await get("newsletter");
  const src = nl?.issues?.[lang] || nl?.issues?.en;
  return `<div class="wrap"><div class="nl-page">
    <div><p class="eyebrow">${t("nlEyebrow")}</p><h1 style="font-size:clamp(32px,4vw,46px)">${t("nlTitle")}</h1><p class="lead2">${t("nlSub")}</p>
      <div class="card" style="padding:20px">${nlForm("newsletter-page")}</div><div style="margin-top:22px">${V.mascot(120, "wink")}</div></div>
    <div><p class="eyebrow">${t("nlLatest")}${nl?.week ? " · " + esc(nl.week) : ""}</p>${src ? `<iframe class="nl-preview" src="${esc(src)}" title="${t("nlLatest")}" loading="lazy"></iframe>` : ""}</div>
  </div></div><div style="height:50px"></div>`;
}

/* ---------- calculators ---------- */
const field = (id, label, val, attrs = "") => `<label for="${id}">${label}</label><input id="${id}" type="number" value="${val}" ${attrs}>`;
const loanCalcHtml = () => `<div class="card calc" data-calc="loan"><h3>${V.icon("personal-loans", 18)} ${t("loanCalc")}</h3>
  ${field("l_amt", t("amount"), 15000, 'min="500" step="500"')}${field("l_rate", t("rate"), 6.5, 'step="0.05"')}${field("l_yrs", t("years"), 5, 'min="1" max="15"')}${field("l_fee", t("fee"), 50)}<div class="out" id="l_out"></div></div>`;
const mortCalcHtml = () => `<div class="card calc" data-calc="mort"><h3>${V.icon("mortgages", 18)} ${t("mortCalc")}</h3>
  ${field("m_price", t("price"), 300000, 'step="5000"')}${field("m_dep", t("deposit"), 30000, 'step="1000"')}${field("m_rate", t("rate"), 3.5, 'step="0.05"')}${field("m_yrs", t("years"), 30, 'min="5" max="40"')}<div class="out" id="m_out"></div></div>`;
const fxCalcHtml = fx => { const opts = ["EUR", ...(fx?.rates || []).map(r => r.ccy)].map(c => `<option>${c}</option>`).join(""); setTimeout(bindCalcs, 0);
  return `<div class="card calc" data-calc="fx"><h3>${V.icon("money-transfer", 18)} ${t("fxCalc")}</h3>${field("f_amt", t("amt"), 1000)}
  <div class="grid g2"><div><label>${t("from")}</label><select id="f_from">${opts}</select></div><div><label>${t("to")}</label><select id="f_to">${opts.replace("<option>GBP", "<option selected>GBP")}</select></div></div>
  <div class="out" id="f_out"></div><p class="note">ECB · ${esc(fx?.date || "")}</p></div>`; };
function pmt(P, ratePct, years) { const r = ratePct / 100 / 12, n = years * 12; return r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n; }
function aprc(P, fee, m, n) { let lo = 0, hi = .05; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; let pv = 0; for (let j = 1; j <= n; j++) pv += m / Math.pow(1 + mid, j); pv > P - fee ? lo = mid : hi = mid; } return (Math.pow(1 + lo, 12) - 1) * 100; }
const v = id => parseFloat(document.getElementById(id)?.value) || 0;
const kv = (k, val, big) => big ? `<div class="muted" style="font-size:12.5px">${k}</div><div class="big">${val}</div>` : `<div class="kv"><span>${k}</span><b>${val}</b></div>`;
function bindCalcs() {
  const L = () => { if (!$("#l_out")) return; const P = v("l_amt"), n = v("l_yrs") * 12, m = pmt(P, v("l_rate"), v("l_yrs"));
    $("#l_out").innerHTML = kv(t("monthly"), "€" + nf(m), 1) + kv(t("totalPay"), "€" + nf(m * n + v("l_fee"))) + kv(t("totalInt"), "€" + nf(m * n - P)) + kv(t("aprc"), nf(aprc(P, v("l_fee"), m, n)) + "%"); };
  const M = () => { if (!$("#m_out")) return; const P = Math.max(0, v("m_price") - v("m_dep")), m = pmt(P, v("m_rate"), v("m_yrs"));
    $("#m_out").innerHTML = kv(t("monthly"), "€" + nf(m), 1) + kv("LTV", nf(P / (v("m_price") || 1) * 100, 0) + "%") + kv(t("totalInt"), "€" + nf(m * v("m_yrs") * 12 - P, 0)); };
  const F = () => { if (!$("#f_out")) return; const all = Object.assign({EUR: 1}, D.fx?.all || {}); const a = v("f_amt"), f = $("#f_from").value, to = $("#f_to").value;
    $("#f_out").innerHTML = kv(`${nf(a)} ${f} =`, `${nf(a / all[f] * all[to])} ${to}`, 1) + kv(`1 ${f}`, `${nf(all[to] / all[f], 4)} ${to}`); };
  document.querySelectorAll("[data-calc] input,[data-calc] select").forEach(el => el.oninput = el.onchange = () => { L(); M(); F(); });
  L(); M(); F();
}

/* ---------- Ask Blue: plain-language router → best three ---------- */
const INTENTS = [
  ["pos", /\bpos\b|card (reader|machine|terminal)|terminal|tap to pay|accept (card|payment)|merchant|softpos|sumup|mypos|viva|takings|apparat tal-karti|terminale|lettore di carte|accettare (carte|pagamenti)|esercente/i],
  ["savings", /saving|deposit|aer|interest on|tfaddil|depożit|risparm|deposit/i],
  ["mortgages", /mortgage|home loan|house|mutu|self għad-dar|dar\b/i],
  ["business-accounts", /business|sme|company|negozju|azienda|impresa|pmi|multi.?currency|multivaluta/i],
  ["credit-cards", /credit card|cashback|card|karta|karti|carta|carte/i],
  ["personal-loans", /loan|borrow|self|prestit/i],
  ["telco-broadband", /fibre|fiber|broadband|internet|wifi|tv bundle|fibra/i],
  ["telco-mobile", /mobile|5g|sim|data|phone|telefon|cellular|unlimited|illimitat|bla limitu/i],
  ["insurance", /insur|assigur|assicur/i],
  ["investing", /invest|broker|stock|shares|borsa|azzjonijiet/i],
  ["fx", /exchange rate|currency|fx\b|convert|euro to|eur to|usd|gbp|try\b|lira|dollar|pound|rupee|peso|kambju|cambio|valuta/i],
  ["money-transfer", /transfer|send money|remit|trasfer|bonifico/i],
  ["fintech", /fintech|revolut|wise|n26|app/i],
  ["bank-accounts", /current account|bank account|kont|conto/i],
  ["restaurants", /eat|lunch|dinner|restaurant|food|seafood|pizza|ikla|ikel|ħut|pranzo|cena|ristorant|pesce/i],
  ["news", /news|aħbarijiet|notizie|headline/i],
  ["markets", /fx|currency|exchange rate|eur\/|valut|munit|market|mse|index|swieq|mercat/i],
];
function parseAmount(q) { const m = q.replace(/,/g, "").match(/€?\s?(\d+(?:\.\d+)?)\s?(k|m)?\b/i); if (!m) return null; return parseFloat(m[1]) * (m[2] ? (m[2].toLowerCase() === "k" ? 1e3 : 1e6) : 1); }
async function runRules(q) {
  const hit = INTENTS.find(([, rx]) => rx.test(q));
  if (!hit) return `<div class="reply">${t("askNone")} <a class="link" href="#categories">${t("allCats")}</a></div>`;
  const slug = hit[0];
  if (slug === "news" || slug === "markets") return `<div class="reply"><a class="link" href="#${slug}">${t("seeTable")}</a></div>`;
  const [cats, data] = await Promise.all([get("categories"), get("cat-" + slug)]);
  let rows = [...(data?.items || [])];
  const amt = parseAmount(q);
  if (amt && slug === "savings") rows = rows.filter(r => !r.min_deposit || r.min_deposit <= amt);
  if (amt && slug === "personal-loans") rows = rows.filter(r => !r.max_amount || r.max_amount >= amt);
  if (slug === "restaurants") { const area = rows.map(r => r.area).find(a => a && q.toLowerCase().includes(String(a).toLowerCase().split(/[ (/]/)[0])); if (area) rows = rows.filter(r => r.area === area);
    if (/seafood|fish|ħut|pesce/i.test(q)) rows = rows.filter(r => /sea|fish/i.test(r.cuisine)) .concat(rows.filter(r => !/sea|fish/i.test(r.cuisine))); }
  if (/multi.?currency|multivaluta|ħafna muniti/i.test(q)) rows = rows.filter(r => r.multi_currency !== false);
  if (/unlimited|illimitat|bla limitu/i.test(q)) rows = rows.filter(r => !("data_gb" in r) || r.data_gb >= 999).sort((a, b) => (a.price || 0) - (b.price || 0));
  if (/cheap|irħas|economic/i.test(q) && rows.some(r => "price" in r)) rows.sort((a, b) => (a.price || 0) - (b.price || 0));
  const top = rows.slice(0, 3), cfg = cats.config[slug], keyCol = cfg.columns.find(c => c.key === cfg.score[0].key) || cfg.columns[2];
  return `<div class="reply"><p style="margin:0 0 6px"><b>${t("askHere")} ${esc(catTitle(cfg))}:</b></p>
    ${top.map((r, i) => `<div class="r">${brand(r, 30)}<div class="grow"><b>${esc(r.provider)}</b> <span class="muted">${esc(r.product || r.area || "")}</span><br><span class="blue" style="font-weight:700">${fmt(r[keyCol.key], keyCol.fmt)}</span> <span class="muted">· ${colLabel(keyCol.key)}</span></div>${i === 0 ? `<span class="pick">${t("bestPick")}</span>` : `<span class="score">${nf(r.score || 0, 1)}</span>`}${ctaBtn(r, slug, i === 0)}</div>`).join("") || `<div class="empty">${V.mascot(56)}<span>${t("mNo")}</span></div>`}
    <p style="margin:10px 0 0"><a class="link" href="#${slug === "restaurants" ? "dining" : slug}">${t("seeTable")}</a></p></div>`;
}
/* AI agent first, keyword router as fallback */
let chat = [];
async function runAsk() {
  const q = $("#askQ").value.trim(); if (!q) return;
  const res = $("#askRes");
  res.insertAdjacentHTML("beforeend", `<div class="bubble-q">${esc(q)}</div><div class="reply thinking" id="thinking">${V.mascot(40, "", "fly")}<span>${t("thinking")}</span></div>`);
  $("#askQ").value = ""; $("#askQ").placeholder = t("followPh");
  res.scrollTop = res.scrollHeight;
  let out = null;
  const url = (window.CM_AGENT_URL || "").replace(/\/$/, "");
  if (url) {
    try {
      const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 45000);
      const r = await fetch(`${url}/ask`, {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({q, lang, history: chat}), signal: ctl.signal});
      clearTimeout(timer);
      if (r.ok) out = await r.json();
    } catch (e) { out = null; }
  }
  $("#thinking")?.remove();
  if (out && (out.answer || out.picks?.length)) {
    chat.push({role: "user", content: q}, {role: "assistant", content: out.answer});
    const cats = await get("categories");
    const picks = (out.picks || []).map((p, i) => `<div class="r">${brand(p, 30)}<div class="grow"><b>${esc(p.provider)}</b> <span class="muted">${esc(p.product || "")}</span>${p.affiliated ? `<span class="aff">${t("affiliated")}</span>` : ""}
        <br><span class="blue" style="font-weight:700">${fmt(p.key?.value, p.key?.fmt)}</span> <span class="muted">· ${colLabel(p.key?.field)}${p.demo ? " · " + t("sample") : ""}</span><div class="why">${esc(p.why)}</div></div>
        ${i === 0 ? `<span class="pick">${t("bestPick")}</span>` : p.score != null ? `<span class="score">${nf(p.score, 1)}</span>` : ""}
        ${p.url ? ctaBtn({provider: p.provider, url: p.url, apply_url: p.apply_url}, p.category, i === 0) : ""}</div>`).join("");
    const oc = out.open_category && cats.config[out.open_category] ? out.open_category : null;
    res.insertAdjacentHTML("beforeend", `<div class="reply ai"><p class="ans">${esc(out.answer)}</p>${picks}
      ${oc ? `<p style="margin:10px 0 0"><a class="link" href="#${oc === "restaurants" ? "dining" : oc}">${t("seeTable")}</a></p>` : ""}<p class="ai-note">${t("aiNote")}</p></div>`);
  } else {
    res.insertAdjacentHTML("beforeend", await runRules(q));
  }
  bindAskLinks();
  res.lastElementChild?.scrollIntoView({block: "nearest"});
}
function bindAskLinks() { document.querySelectorAll("#askRes a[href^='#']").forEach(a => a.addEventListener("click", closeAsk)); }
function openAsk(q = "") { $("#ask").classList.add("open"); $("#askQ").value = q; if (q) { $("#askRes").innerHTML = ""; chat = []; } $("#askQ").placeholder = chat.length ? t("followPh") : t("ph"); setTimeout(() => $("#askQ").focus(), 30); if (q) runAsk(); }
function closeAsk() { $("#ask").classList.remove("open"); }

/* ---------- router ---------- */
async function route() {
  const r = (location.hash || "#home").slice(1) || "home";
  await get("categories");
  renderNav(r); $("#nav").classList.remove("open");
  const pages = {newsletter: pageNewsletter, partners: pagePartners, contact: pagePartners, news: pageNews, markets: pageMarkets, dining: pageDining, calculators: pageCalcs, categories: pageCategories, "how-we-rank": pageHow, contact: pageContact};
  $("#app").innerHTML = await (pages[r] ? pages[r]() : D.categories?.config[r] ? pageCategory(r) : pageHome());
  if (r === "markets") bindCalcs();
  if ($("#heroForm")) bindHome();
  bindNewsletter();
  window.scrollTo(0, 0);
}
document.querySelectorAll("#langSeg button").forEach(b => b.onclick = () => { lang = b.dataset.l; try { localStorage.setItem("cm_lang", lang); } catch (e) {} renderChrome(); route(); });
$("#menuBtn").onclick = () => $("#nav").classList.toggle("open");
$("#askBtn").onclick = () => openAsk();
if (location.hash === "#ask" || QS.get("q")) { history.replaceState(null, "", location.pathname + "#home"); setTimeout(() => openAsk(QS.get("q") || ""), 300); }
$("#askX").onclick = closeAsk;
$("#ask").onclick = e => { if (e.target.id === "ask") closeAsk(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAsk(); });
$("#askForm").onsubmit = e => { e.preventDefault(); runAsk(); };
window.addEventListener("hashchange", route);
renderChrome(); route();
})();
