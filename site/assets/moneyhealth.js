/* CompareMalta Money Health: a 3-minute personal budgeting check with a transparent, rule-based 1 to 100 score.
   No AI decides the score. Nothing leaves the browser: answers live in sessionStorage, saved results in localStorage. */
(function () {
"use strict";

/* ---------- copy (EN / MT / IT) ---------- */
const S = {
en: {
  nav: "Money Health", eyebrow: "CompareMalta Money Health", h1: "A clearer picture of your money.",
  lead: "Answer a few simple questions to understand your monthly balance, savings buffer and financial flexibility.",
  lead2: "Get your Money Health Score from 1 to 100, with practical steps based on your answers.",
  chips: ["Free", "Around 3 minutes", "Documents optional"], start: "Check my Money Health", docs: "Use my documents",
  notCredit: "This is a personal budgeting indicator, not a credit score or a prediction of loan approval.",
  privacy: "Your answers stay in this browser. We do not store them on our servers and no account is needed.",
  pillars: [["Monthly breathing room", "What is left after spending and repayments"], ["Savings buffer", "How many months of essentials your savings cover"], ["Budget consistency", "How often income covered costs lately"], ["Financial flexibility", "Income not tied to essentials"]],
  stepOf: "Step {n} of {t}", back: "Back", next: "Continue", monthly: "Monthly", weekly: "Weekly", yearly: "Yearly",
  q1: "Whose finances are you checking?", q1o: ["Just mine", "My household's"],
  q2: "What would you like help with?", q2o: ["Understand my spending", "Build a savings buffer", "Manage repayments", "Get a general overview"], q2h: "This shapes your tips. It does not change your score.",
  q3: "How do you usually receive your income?", q3o: ["Salary", "Self-employment", "Pension or regular support", "A mix", "No regular income"],
  q4: "How much usually comes in each month, after tax?", q4h: "Include income you can normally rely on. Do not include loans, transfers between your own accounts or one-off gifts.",
  q4v: "My income varies", q4alt: "Looking at the last 6 months, what was your average monthly income after tax?", q4months: "If you only have a shorter history, how many months does your estimate cover?",
  q5: "How much do you usually spend each month?", q5f: ["Rent and housing costs, excluding mortgage repayments", "Bills, food, transport and other spending", "Mortgage, loan, credit card and instalment repayments"],
  q5h: "Count each cost once. Include mortgage payments under repayments. Do not count transfers to your savings as spending.",
  q5card: "If you repay your card in full each month, count the purchases as spending and do not count the card payment again. For an existing carried balance, include the repayment separately.",
  total: "Total", q6: "How much of your spending is essential?", q6h: "Include housing, basic bills, food, essential transport, care costs and required debt repayments. This amount is part of your total spending, not an extra expense.",
  q6of: "of {v} total", q6err: "Essential spending is part of your total, so it cannot be more than {v}.",
  q7: "How much accessible savings do you have?", q7h: "Include money you can access quickly without borrowing or a significant penalty. Exclude property, pensions, unused credit limits and money reserved for upcoming bills.",
  none: "None", unsure: "Not sure",
  q8: "In how many of the last 3 months did your income cover your spending and repayments?",
  confirm: "Does this look right?", cIncome: "Monthly income", cSpend: "Monthly spending and repayments", cEss: "Of which essential", cSav: "Accessible savings", cCov: "Months covered by income", cOf: "{n} out of 3",
  edit: "Edit my answers", see: "See my score", cNote: "Your result is based on the information you provide. Estimates are welcome, but missing accounts or expenses may change the result.",
  more: "One more number will help us calculate your score.", moreSub: "You can enter an estimate, or see the indicators we can already calculate.", addEst: "Enter an estimate", partial: "Show what you can",
  needNum: "Please enter an amount, or choose an option.",
  scoreTitle: "Your Money Health Score", basedOn: "Based on your answers", calcToday: "Calculated today",
  disclaimer: "This score describes your current budget and savings position. It is not a credit score, a guarantee of financial security or a lending decision.",
  bands: ["Your budget needs attention", "Limited financial breathing room", "Building your financial buffer", "A steadier financial position", "Strong foundations"],
  expl: (left, buf) => `Based on your answers, ${left} and ${buf}.`,
  leftPos: "you have money left over each month", leftZero: "your income just about covers your spending", leftNeg: "you are spending more than comes in each month",
  bufText: m => m < 0.25 ? "you have little or no savings buffer yet" : `around ${m} of essential expenses in accessible savings`,
  months: m => m < 1 ? "less than a month" : m === 1 ? "one month" : `${m} months`,
  deficitH: "Your spending currently exceeds your income.", deficitP: "Your savings provide a buffer, but this monthly gap will gradually reduce it.", deficitP0: "Without savings to fall back on, closing this gap is the first priority.",
  cards: ["Monthly breathing room", "Savings buffer", "Budget consistency", "Financial flexibility"],
  cA: (v, p) => `You have around ${v} left each month, equal to ${p} of your income.`, cAneg: (v, p) => `You spend around ${v} more than comes in each month, ${p} of your income.`,
  cB: m => `Your accessible savings cover around ${m} of essential costs.`, cC: n => `Your income covered your spending in ${n} of the last 3 months.`,
  cD: p => `Around ${p} of your income remains after essential costs and required repayments.`, cMissing: "Add this number to see this indicator.",
  weight: "{w}% of score",
  partialH: "Your indicators", partialP: "We need one more number for an overall score. Here is what we can already see.",
  runwayH: "How long your money may last", runwayP: (m, s) => `At your current spending of ${s} a month, your accessible savings could last around ${m}. This assumes no new income and no change in spending.`,
  runwayNote: "With no regular income we show how long your savings may last instead of a score. A score here would not be fair to you.",
  coverage: "Covers your own estimates. Other accounts or cash spending may not be included.", limited: n => `Your income estimate covers ${n} month${n === 1 ? "" : "s"}, so treat this as an early read.`,
  nextH: "Your next steps", nextSub: "Practical ideas based on your answers. They are about your budget, not about raising a number.",
  rBufH: "Build your next month of savings", rBuf: (e, a, n) => `One additional month of essential costs is ${e}. Setting aside ${a} a month would reach that amount in around ${n} months, assuming no withdrawals.`,
  rGapH: "Close the monthly gap", rGap: (g, n) => `You are around ${g} a month short. Your non-essential spending is about ${n} a month, so trimming part of it is the quickest way to balance.`, rGap2: g => `You are around ${g} a month short, and most of your spending is essential. Look at your largest fixed costs and any help you may be entitled to.`,
  rRepH: "Review what your repayments cost", rRep: (r, p) => `Repayments take ${r} a month, ${p} of your income. Check the rate you pay against today's offers before your next renewal.`,
  rSpendH: "See where your money goes", rSpend: (h, l, r) => `Housing takes ${h}, everyday spending ${l} and repayments ${r} of your income. Tracking the everyday share for a month usually shows the easiest savings.`,
  rConH: "Plan for the months that don't balance", rCon: n => `Your income covered your costs in ${n} of the last 3 months. Moving a fixed amount to savings on payday makes uneven months easier to absorb.`,
  rWorkH: "Make your buffer work harder", rWork: "Your buffer looks healthy. Compare savings and term deposit rates so the money you keep aside earns more.",
  cta: { savings: "Compare savings accounts", loans: "Compare personal loans", mortgages: "Compare mortgages", bank: "Compare current accounts", groceries: "Compare supermarkets" },
  simH: "What would change if…", simSave: "I saved an extra € per month", simCut: "My monthly costs fell by €", simInc: "My income changed by € per month",
  simTag: "Illustrative scenario", simOut: (a, b) => `Your savings buffer could grow from ${a} to ${b} in 12 months.`, simLeft: (a, b) => `Monthly breathing room: ${a} → ${b}.`, simScore: (a, b) => `Illustrative score after 12 months: ${a} → ${b}.`,
  simNote: "This is an estimate based on the figures you entered. It is not saved to your score history.",
  docH: "Want a more accurate picture?", docP: "Use documents to check your numbers and reduce guesswork. Uploading documents does not automatically increase your score.", docBtn: "Check my numbers with documents", soon: "Coming soon",
  docSoon: "Document checks are coming soon. They will suggest figures from a bank statement or payslip, and you will review every change before it affects your score.",
  save: "Save on this device", saved: "Saved on this device", again: "Start again", change: (d, t) => `${d > 0 ? "+" : ""}${d} since ${t}`,
  howH: "How the score works", how: ["Four indicators with fixed weights: monthly breathing room 30%, savings buffer 30%, budget consistency 25%, financial flexibility 15%.", "Each indicator turns your numbers into 0 to 100 points on a published scale, and the score is 1 + 0.99 × the weighted average.", "Missing information is never scored as zero, and not having used credit never lowers your score.", "Nationality, age, employer, marital status, health and social media are never used. Using CompareMalta or uploading documents never adds points.", "The weights are a product design choice, not statistical thresholds from the Maltese population."],
},
mt: {
  nav: "Saħħa Finanzjarja", eyebrow: "CompareMalta Money Health", h1: "Stampa aktar ċara ta' flusek.",
  lead: "Wieġeb ftit mistoqsijiet sempliċi biex tifhem il-bilanċ ta' kull xahar, il-buffer tat-tfaddil u l-flessibbiltà finanzjarja tiegħek.",
  lead2: "Ikseb il-Money Health Score tiegħek minn 1 sa 100, b'passi prattiċi bbażati fuq it-tweġibiet tiegħek.",
  chips: ["B'xejn", "Madwar 3 minuti", "Dokumenti mhux obbligatorji"], start: "Iċċekkja s-Saħħa Finanzjarja tiegħi", docs: "Uża d-dokumenti tiegħi",
  notCredit: "Dan huwa indikatur tal-baġit personali, mhux credit score jew tbassir ta' approvazzjoni ta' self.",
  privacy: "It-tweġibiet tiegħek jibqgħu f'dan il-browser. Ma naħżnuhomx fuq is-servers tagħna u m'għandekx bżonn kont.",
  pillars: [["Spazju ta' kull xahar", "X'jibqa' wara l-infiq u l-ħlasijiet"], ["Buffer tat-tfaddil", "Kemm-il xahar ta' spejjeż essenzjali jkopri t-tfaddil"], ["Konsistenza tal-baġit", "Kemm-il darba d-dħul kopra l-ispejjeż riċentement"], ["Flessibbiltà finanzjarja", "Dħul mhux marbut ma' spejjeż essenzjali"]],
  stepOf: "Pass {n} minn {t}", back: "Lura", next: "Kompli", monthly: "Kull xahar", weekly: "Kull ġimgħa", yearly: "Kull sena",
  q1: "Il-finanzi ta' min qed tiċċekkja?", q1o: ["Tiegħi biss", "Tad-dar tiegħi"],
  q2: "Fiex tixtieq l-għajnuna?", q2o: ["Nifhem l-infiq tiegħi", "Nibni buffer tat-tfaddil", "Nimmaniġġja l-ħlasijiet", "Ħarsa ġenerali"], q2h: "Dan isawwar il-pariri tiegħek. Ma jbiddilx il-punteġġ.",
  q3: "Kif normalment tirċievi d-dħul tiegħek?", q3o: ["Salarju", "Self-employment", "Pensjoni jew appoġġ regolari", "Taħlita", "L-ebda dħul regolari"],
  q4: "Kemm normalment jidħol kull xahar, wara t-taxxa?", q4h: "Inkludi dħul li normalment tista' tistrieħ fuqu. Tinkludix self, trasferimenti bejn il-kontijiet tiegħek jew rigali ta' darba.",
  q4v: "Id-dħul tiegħi jvarja", q4alt: "Fl-aħħar 6 xhur, x'kien id-dħul medju tiegħek kull xahar wara t-taxxa?", q4months: "Jekk għandek storja iqsar, kemm-il xahar tkopri l-istima tiegħek?",
  q5: "Kemm normalment tonfoq kull xahar?", q5f: ["Kera u spejjeż tad-dar, mingħajr ħlasijiet tal-mortgage", "Kontijiet, ikel, trasport u nfiq ieħor", "Ħlasijiet ta' mortgage, self, karta tal-kreditu u nstallamenti"],
  q5h: "Għodd kull spiża darba. Inkludi l-mortgage taħt il-ħlasijiet. Tgħoddx trasferimenti lejn it-tfaddil bħala nfiq.",
  q5card: "Jekk tħallas il-karta kollha kull xahar, għodd ix-xiri bħala nfiq u tgħoddx il-ħlas tal-karta mill-ġdid. Għal bilanċ li jinġarr, inkludi l-ħlas separatament.",
  total: "Total", q6: "Kemm mill-infiq tiegħek huwa essenzjali?", q6h: "Inkludi d-dar, kontijiet bażiċi, ikel, trasport essenzjali, spejjeż ta' kura u ħlasijiet ta' djun meħtieġa. Dan l-ammont huwa parti mit-total, mhux spiża żejda.",
  q6of: "minn {v} total", q6err: "L-infiq essenzjali huwa parti mit-total, għalhekk ma jistax ikun aktar minn {v}.",
  q7: "Kemm għandek tfaddil aċċessibbli?", q7h: "Inkludi flus li tista' tuża malajr mingħajr self jew penali sinifikanti. Teskludi proprjetà, pensjonijiet, limiti tal-kreditu mhux użati u flus riżervati għal kontijiet li ġejjin.",
  none: "Xejn", unsure: "Mhux ċert",
  q8: "F'kemm mill-aħħar 3 xhur id-dħul tiegħek kopra l-infiq u l-ħlasijiet?",
  confirm: "Dan jidher korrett?", cIncome: "Dħul ta' kull xahar", cSpend: "Infiq u ħlasijiet ta' kull xahar", cEss: "Li minnhom essenzjali", cSav: "Tfaddil aċċessibbli", cCov: "Xhur koperti mid-dħul", cOf: "{n} minn 3",
  edit: "Biddel it-tweġibiet", see: "Ara l-punteġġ tiegħi", cNote: "Ir-riżultat huwa bbażat fuq l-informazzjoni li tagħti. Stimi huma milqugħa, iżda kontijiet jew spejjeż neqsin jistgħu jbiddlu r-riżultat.",
  more: "Numru ieħor jgħinna nikkalkulaw il-punteġġ tiegħek.", moreSub: "Tista' ddaħħal stima, jew tara l-indikaturi li diġà nistgħu nikkalkulaw.", addEst: "Daħħal stima", partial: "Uri dak li tista'",
  needNum: "Jekk jogħġbok daħħal ammont, jew agħżel għażla.",
  scoreTitle: "Il-Money Health Score tiegħek", basedOn: "Ibbażat fuq it-tweġibiet tiegħek", calcToday: "Ikkalkulat illum",
  disclaimer: "Dan il-punteġġ jiddeskrivi l-baġit u t-tfaddil tiegħek bħalissa. Mhuwiex credit score, garanzija ta' sigurtà finanzjarja jew deċiżjoni ta' self.",
  bands: ["Il-baġit tiegħek jeħtieġ attenzjoni", "Ftit spazju finanzjarju", "Qed tibni l-buffer finanzjarju", "Pożizzjoni finanzjarja aktar soda", "Pedamenti b'saħħithom"],
  expl: (left, buf) => `Skont it-tweġibiet tiegħek, ${left} u ${buf}.`,
  leftPos: "jibqagħlek il-flus kull xahar", leftZero: "id-dħul tiegħek bilkemm ikopri l-infiq", leftNeg: "qed tonfoq aktar milli jidħol kull xahar",
  bufText: m => m < 0.25 ? "għad ftit jew xejn buffer tat-tfaddil" : `għandek madwar ${m} ta' spejjeż essenzjali f'tfaddil aċċessibbli`,
  months: m => m < 1 ? "inqas minn xahar" : m === 1 ? "xahar" : `${m} xhur`,
  deficitH: "L-infiq tiegħek bħalissa jaqbeż id-dħul.", deficitP: "It-tfaddil tiegħek jagħti buffer, iżda dan id-distakk ta' kull xahar se jnaqqsu bil-mod.", deficitP0: "Mingħajr tfaddil, l-ewwel prijorità hija li tagħlaq dan id-distakk.",
  cards: ["Spazju ta' kull xahar", "Buffer tat-tfaddil", "Konsistenza tal-baġit", "Flessibbiltà finanzjarja"],
  cA: (v, p) => `Jibqagħlek madwar ${v} kull xahar, ${p} tad-dħul tiegħek.`, cAneg: (v, p) => `Tonfoq madwar ${v} aktar milli jidħol kull xahar, ${p} tad-dħul tiegħek.`,
  cB: m => `It-tfaddil aċċessibbli tiegħek ikopri madwar ${m} ta' spejjeż essenzjali.`, cC: n => `Id-dħul tiegħek kopra l-infiq f'${n} mill-aħħar 3 xhur.`,
  cD: p => `Madwar ${p} tad-dħul tiegħek jibqa' wara l-ispejjeż essenzjali u l-ħlasijiet meħtieġa.`, cMissing: "Żid dan in-numru biex tara dan l-indikatur.",
  weight: "{w}% tal-punteġġ",
  partialH: "L-indikaturi tiegħek", partialP: "Neħtieġu numru ieħor għal punteġġ ġenerali. Hawn dak li diġà nistgħu naraw.",
  runwayH: "Kemm jistgħu jdumu flusek", runwayP: (m, s) => `Bl-infiq attwali ta' ${s} fix-xahar, it-tfaddil aċċessibbli tiegħek jista' jdum madwar ${m}. Dan jassumi l-ebda dħul ġdid u l-ebda bidla fl-infiq.`,
  runwayNote: "Mingħajr dħul regolari nuruk kemm jista' jdum it-tfaddil minflok punteġġ. Punteġġ hawn ma jkunx ġust miegħek.",
  coverage: "Ikopri l-istimi tiegħek. Kontijiet oħra jew infiq bil-kontanti jistgħu ma jkunux inklużi.", limited: n => `L-istima tad-dħul tiegħek tkopri ${n} xahar, għalhekk ħudha bħala qari bikri.`,
  nextH: "Il-passi li jmiss", nextSub: "Ideat prattiċi bbażati fuq it-tweġibiet tiegħek. Huma dwar il-baġit, mhux dwar li togħla numru.",
  rBufH: "Ibni x-xahar li jmiss ta' tfaddil", rBuf: (e, a, n) => `Xahar ieħor ta' spejjeż essenzjali huwa ${e}. Jekk twarrab ${a} fix-xahar tilħqu f'madwar ${n} xhur, jekk ma tiġbedx minnu.`,
  rGapH: "Agħlaq id-distakk ta' kull xahar", rGap: (g, n) => `Int nieqes madwar ${g} fix-xahar. L-infiq mhux essenzjali tiegħek huwa madwar ${n} fix-xahar, għalhekk tnaqqis minnu huwa l-iktar mod malajr biex tibbilanċja.`, rGap2: g => `Int nieqes madwar ${g} fix-xahar, u l-biċċa l-kbira tal-infiq huwa essenzjali. Ħares lejn l-akbar spejjeż fissi u kwalunkwe għajnuna li jista' jkollok dritt għaliha.`,
  rRepH: "Iċċekkja kemm jiswewlek il-ħlasijiet", rRep: (r, p) => `Il-ħlasijiet jieħdu ${r} fix-xahar, ${p} tad-dħul tiegħek. Qabbel ir-rata li tħallas mal-offerti tal-lum qabel it-tiġdid li jmiss.`,
  rSpendH: "Ara fejn imorru flusek", rSpend: (h, l, r) => `Id-dar tieħu ${h}, l-infiq ta' kuljum ${l} u l-ħlasijiet ${r} tad-dħul tiegħek. Li ssegwi l-infiq ta' kuljum għal xahar normalment juri l-iktar iffrankar faċli.`,
  rConH: "Ippjana għax-xhur li ma jibbilanċjawx", rCon: n => `Id-dħul tiegħek kopra l-ispejjeż f'${n} mill-aħħar 3 xhur. Li tittrasferixxi ammont fiss għat-tfaddil fil-jum tal-paga jagħmel ix-xhur mhux indaqs aktar faċli.`,
  rWorkH: "Ħalli l-buffer jaħdem aktar", rWork: "Il-buffer tiegħek jidher b'saħħtu. Qabbel ir-rati tat-tfaddil u tad-depożiti fissi biex il-flus li twarrab jaqilgħu aktar.",
  cta: { savings: "Qabbel kontijiet tat-tfaddil", loans: "Qabbel self personali", mortgages: "Qabbel mortgages", bank: "Qabbel kontijiet kurrenti", groceries: "Qabbel supermarkits" },
  simH: "X'jinbidel kieku…", simSave: "Iffrankajt € żejda fix-xahar", simCut: "L-ispejjeż ta' kull xahar naqsu b'€", simInc: "Id-dħul tiegħi nbidel b'€ fix-xahar",
  simTag: "Xenarju illustrattiv", simOut: (a, b) => `Il-buffer tat-tfaddil tiegħek jista' jikber minn ${a} għal ${b} fi 12-il xahar.`, simLeft: (a, b) => `Spazju ta' kull xahar: ${a} → ${b}.`, simScore: (a, b) => `Punteġġ illustrattiv wara 12-il xahar: ${a} → ${b}.`,
  simNote: "Din hija stima bbażata fuq iċ-ċifri li daħħalt. Ma tiġix salvata fl-istorja tal-punteġġ.",
  docH: "Trid stampa aktar preċiża?", docP: "Uża d-dokumenti biex tiċċekkja n-numri u tnaqqas l-istima. It-tlugħ ta' dokumenti ma jgħollix il-punteġġ awtomatikament.", docBtn: "Iċċekkja n-numri bid-dokumenti", soon: "Dalwaqt",
  docSoon: "Il-kontrolli bid-dokumenti ġejjin dalwaqt. Jissuġġerixxu ċifri minn statement tal-bank jew payslip, u int tirrevedi kull bidla qabel ma taffettwa l-punteġġ.",
  save: "Issalva fuq dan l-apparat", saved: "Salvat fuq dan l-apparat", again: "Erġa' ibda", change: (d, t) => `${d > 0 ? "+" : ""}${d} minn ${t}`,
  howH: "Kif jaħdem il-punteġġ", how: ["Erba' indikaturi b'piżijiet fissi: spazju ta' kull xahar 30%, buffer tat-tfaddil 30%, konsistenza tal-baġit 25%, flessibbiltà finanzjarja 15%.", "Kull indikatur ibiddel in-numri tiegħek f'0 sa 100 punt fuq skala ppubblikata, u l-punteġġ huwa 1 + 0.99 × il-medja peżata.", "Informazzjoni nieqsa qatt ma tingħata żero, u li ma użajtx kreditu qatt ma jbaxxi l-punteġġ.", "Nazzjonalità, età, min iħaddmek, stat ċivili, saħħa u social media qatt ma jintużaw. L-użu ta' CompareMalta jew it-tlugħ ta' dokumenti qatt ma jżid punti.", "Il-piżijiet huma għażla tad-disinn tal-prodott, mhux limiti statistiċi mill-popolazzjoni Maltija."],
},
it: {
  nav: "Money Health", eyebrow: "CompareMalta Money Health", h1: "Un quadro più chiaro dei tuoi soldi.",
  lead: "Rispondi a poche domande semplici per capire il tuo saldo mensile, il cuscinetto di risparmi e la tua flessibilità finanziaria.",
  lead2: "Ottieni il tuo Money Health Score da 1 a 100, con passi pratici basati sulle tue risposte.",
  chips: ["Gratis", "Circa 3 minuti", "Documenti facoltativi"], start: "Controlla la mia Money Health", docs: "Usa i miei documenti",
  notCredit: "È un indicatore del bilancio personale, non un credit score né una previsione di approvazione di un prestito.",
  privacy: "Le tue risposte restano in questo browser. Non le salviamo sui nostri server e non serve un account.",
  pillars: [["Margine mensile", "Quanto resta dopo spese e rate"], ["Cuscinetto di risparmi", "Quanti mesi di spese essenziali coprono i risparmi"], ["Regolarità del bilancio", "Quante volte le entrate hanno coperto le spese di recente"], ["Flessibilità finanziaria", "Entrate non vincolate alle spese essenziali"]],
  stepOf: "Passo {n} di {t}", back: "Indietro", next: "Continua", monthly: "Mensile", weekly: "Settimanale", yearly: "Annuale",
  q1: "Di chi sono le finanze che stai controllando?", q1o: ["Solo le mie", "Della mia famiglia"],
  q2: "In cosa vorresti aiuto?", q2o: ["Capire le mie spese", "Costruire un cuscinetto di risparmi", "Gestire le rate", "Avere un quadro generale"], q2h: "Serve a personalizzare i consigli. Non cambia il punteggio.",
  q3: "Come ricevi di solito le tue entrate?", q3o: ["Stipendio", "Lavoro autonomo", "Pensione o sostegno regolare", "Un mix", "Nessuna entrata regolare"],
  q4: "Quanto entra di solito ogni mese, al netto delle tasse?", q4h: "Includi le entrate su cui puoi contare normalmente. Non includere prestiti, trasferimenti tra i tuoi conti o regali occasionali.",
  q4v: "Le mie entrate variano", q4alt: "Negli ultimi 6 mesi, qual è stata la tua entrata media mensile al netto delle tasse?", q4months: "Se hai uno storico più breve, quanti mesi copre la tua stima?",
  q5: "Quanto spendi di solito ogni mese?", q5f: ["Affitto e costi della casa, esclusa la rata del mutuo", "Bollette, cibo, trasporti e altre spese", "Rate di mutuo, prestiti, carte di credito e pagamenti rateali"],
  q5h: "Conta ogni costo una sola volta. Inserisci il mutuo tra le rate. Non contare i trasferimenti verso i risparmi come spesa.",
  q5card: "Se saldi la carta per intero ogni mese, conta gli acquisti come spesa e non contare di nuovo il pagamento della carta. Per un saldo residuo, includi la rata a parte.",
  total: "Totale", q6: "Quanta parte della tua spesa è essenziale?", q6h: "Includi casa, bollette di base, cibo, trasporti essenziali, spese di assistenza e rate obbligatorie. Questo importo fa parte della spesa totale, non è una spesa in più.",
  q6of: "su {v} totali", q6err: "La spesa essenziale fa parte del totale, quindi non può superare {v}.",
  q7: "Quanti risparmi accessibili hai?", q7h: "Includi denaro che puoi usare rapidamente senza prestiti né penali importanti. Escludi immobili, pensioni, fidi non usati e soldi già destinati a bollette in arrivo.",
  none: "Nessuno", unsure: "Non sono sicuro",
  q8: "In quanti degli ultimi 3 mesi le tue entrate hanno coperto spese e rate?",
  confirm: "È tutto corretto?", cIncome: "Entrate mensili", cSpend: "Spese e rate mensili", cEss: "Di cui essenziali", cSav: "Risparmi accessibili", cCov: "Mesi coperti dalle entrate", cOf: "{n} su 3",
  edit: "Modifica le risposte", see: "Vedi il mio punteggio", cNote: "Il risultato si basa sulle informazioni che fornisci. Le stime vanno bene, ma conti o spese mancanti possono cambiarlo.",
  more: "Ci serve ancora un numero per calcolare il punteggio.", moreSub: "Puoi inserire una stima oppure vedere gli indicatori che possiamo già calcolare.", addEst: "Inserisci una stima", partial: "Mostra ciò che si può",
  needNum: "Inserisci un importo o scegli un'opzione.",
  scoreTitle: "Il tuo Money Health Score", basedOn: "Basato sulle tue risposte", calcToday: "Calcolato oggi",
  disclaimer: "Questo punteggio descrive il tuo bilancio e i tuoi risparmi attuali. Non è un credit score, una garanzia di sicurezza finanziaria né una decisione di credito.",
  bands: ["Il tuo bilancio richiede attenzione", "Margine finanziario limitato", "Stai costruendo il tuo cuscinetto", "Una posizione finanziaria più stabile", "Basi solide"],
  expl: (left, buf) => `In base alle tue risposte, ${left} e ${buf}.`,
  leftPos: "ti restano soldi ogni mese", leftZero: "le tue entrate coprono appena le spese", leftNeg: "spendi più di quanto entra ogni mese",
  bufText: m => m < 0.25 ? "non hai ancora un vero cuscinetto di risparmi" : `hai circa ${m} di spese essenziali in risparmi accessibili`,
  months: m => m < 1 ? "meno di un mese" : m === 1 ? "un mese" : `${m} mesi`,
  deficitH: "Al momento spendi più di quanto entra.", deficitP: "I risparmi ti danno un cuscinetto, ma questo divario mensile lo ridurrà gradualmente.", deficitP0: "Senza risparmi su cui contare, chiudere questo divario è la prima priorità.",
  cards: ["Margine mensile", "Cuscinetto di risparmi", "Regolarità del bilancio", "Flessibilità finanziaria"],
  cA: (v, p) => `Ti restano circa ${v} al mese, pari al ${p} delle entrate.`, cAneg: (v, p) => `Spendi circa ${v} più di quanto entra ogni mese, il ${p} delle entrate.`,
  cB: m => `I tuoi risparmi accessibili coprono circa ${m} di spese essenziali.`, cC: n => `Le entrate hanno coperto le spese in ${n} degli ultimi 3 mesi.`,
  cD: p => `Circa il ${p} delle entrate resta dopo spese essenziali e rate obbligatorie.`, cMissing: "Aggiungi questo numero per vedere l'indicatore.",
  weight: "{w}% del punteggio",
  partialH: "I tuoi indicatori", partialP: "Ci serve un altro numero per il punteggio complessivo. Ecco cosa vediamo già.",
  runwayH: "Quanto possono durare i tuoi soldi", runwayP: (m, s) => `Con una spesa attuale di ${s} al mese, i risparmi accessibili potrebbero durare circa ${m}. Si assume nessuna nuova entrata e nessun cambiamento nelle spese.`,
  runwayNote: "Senza entrate regolari mostriamo quanto possono durare i risparmi invece di un punteggio, che qui non sarebbe equo.",
  coverage: "Copre le tue stime. Altri conti o spese in contanti potrebbero non essere inclusi.", limited: n => `La stima delle entrate copre ${n} mes${n === 1 ? "e" : "i"}: consideralo un primo quadro.`,
  nextH: "I tuoi prossimi passi", nextSub: "Idee pratiche basate sulle tue risposte. Riguardano il bilancio, non l'aumento di un numero.",
  rBufH: "Costruisci il prossimo mese di risparmi", rBuf: (e, a, n) => `Un mese in più di spese essenziali vale ${e}. Mettendo da parte ${a} al mese lo raggiungeresti in circa ${n} mesi, senza prelievi.`,
  rGapH: "Chiudi il divario mensile", rGap: (g, n) => `Ti mancano circa ${g} al mese. Le spese non essenziali sono circa ${n} al mese: ridurne una parte è il modo più rapido per riequilibrare.`, rGap2: g => `Ti mancano circa ${g} al mese e la maggior parte delle spese è essenziale. Guarda i costi fissi più alti e gli eventuali aiuti a cui hai diritto.`,
  rRepH: "Verifica quanto ti costano le rate", rRep: (r, p) => `Le rate assorbono ${r} al mese, il ${p} delle entrate. Confronta il tasso che paghi con le offerte di oggi prima del prossimo rinnovo.`,
  rSpendH: "Guarda dove vanno i tuoi soldi", rSpend: (h, l, r) => `La casa assorbe il ${h}, le spese quotidiane il ${l} e le rate il ${r} delle entrate. Monitorare le spese quotidiane per un mese di solito mostra i risparmi più facili.`,
  rConH: "Pianifica i mesi che non quadrano", rCon: n => `Le entrate hanno coperto i costi in ${n} degli ultimi 3 mesi. Spostare una cifra fissa sui risparmi il giorno di paga rende più facili i mesi irregolari.`,
  rWorkH: "Fai lavorare di più il cuscinetto", rWork: "Il tuo cuscinetto è in buona salute. Confronta i tassi di risparmio e dei depositi vincolati per far rendere di più ciò che metti da parte.",
  cta: { savings: "Confronta i conti di risparmio", loans: "Confronta i prestiti personali", mortgages: "Confronta i mutui", bank: "Confronta i conti correnti", groceries: "Confronta i supermercati" },
  simH: "Cosa cambierebbe se…", simSave: "Risparmiassi € in più al mese", simCut: "I miei costi mensili scendessero di €", simInc: "Le mie entrate cambiassero di € al mese",
  simTag: "Scenario illustrativo", simOut: (a, b) => `Il cuscinetto di risparmi potrebbe passare da ${a} a ${b} in 12 mesi.`, simLeft: (a, b) => `Margine mensile: ${a} → ${b}.`, simScore: (a, b) => `Punteggio illustrativo dopo 12 mesi: ${a} → ${b}.`,
  simNote: "È una stima basata sulle cifre inserite. Non viene salvata nello storico del punteggio.",
  docH: "Vuoi un quadro più preciso?", docP: "Usa i documenti per verificare i numeri e ridurre le stime. Caricare documenti non aumenta automaticamente il punteggio.", docBtn: "Verifica i numeri con i documenti", soon: "In arrivo",
  docSoon: "La verifica con i documenti arriverà presto. Suggerirà le cifre da un estratto conto o da una busta paga, e potrai rivedere ogni modifica prima che incida sul punteggio.",
  save: "Salva su questo dispositivo", saved: "Salvato su questo dispositivo", again: "Ricomincia", change: (d, t) => `${d > 0 ? "+" : ""}${d} dal ${t}`,
  howH: "Come funziona il punteggio", how: ["Quattro indicatori con pesi fissi: margine mensile 30%, cuscinetto di risparmi 30%, regolarità del bilancio 25%, flessibilità finanziaria 15%.", "Ogni indicatore trasforma i tuoi numeri in 0-100 punti su una scala pubblicata, e il punteggio è 1 + 0,99 × la media ponderata.", "Le informazioni mancanti non valgono mai zero e non aver usato credito non abbassa mai il punteggio.", "Nazionalità, età, datore di lavoro, stato civile, salute e social media non vengono mai usati. Usare CompareMalta o caricare documenti non aggiunge punti.", "I pesi sono una scelta di design del prodotto, non soglie statistiche ricavate dalla popolazione maltese."],
}};

/* ---------- scoring engine (fixed, explainable rules) ---------- */
const lerp = (x, pts) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); }
  return pts[pts.length - 1][1];
};
const P_A = [[-0.10, 0], [0, 25], [0.10, 60], [0.20, 85], [0.30, 100]];
const P_B = [[0, 0], [0.5, 20], [1, 40], [2, 65], [3, 85], [6, 100]];
const P_C = [0, 33, 67, 100];
const P_D = [[0, 0], [0.10, 25], [0.20, 50], [0.30, 75], [0.40, 100]];
const W = { A: 0.30, B: 0.30, C: 0.25, D: 0.15 };

function compute(d) {
  const inc = d.income, spend = d.spend, ess = d.essential;
  const out = { inc, spend, ess, sav: d.savings, comps: { A: null, B: null, C: null, D: null }, score: null, runway: null };
  if (!(inc > 0)) { // no regular income: show how long savings may last, never a punitive score
    if (typeof d.savings === "number" && spend > 0) out.runway = d.savings / spend;
    return out;
  }
  if (spend != null) { const r = (inc - spend) / inc; out.left = inc - spend; out.leftPct = r; out.comps.A = lerp(r, P_A); }
  if (ess > 0 && d.savings != null && d.savings !== "unsure") { const m = (d.savings === "none" ? 0 : d.savings) / ess; out.buffer = m; out.comps.B = lerp(m, P_B); }
  if (typeof d.covered === "number") out.comps.C = P_C[d.covered];
  if (ess != null) { const f = (inc - ess) / inc; out.flexPct = f; out.comps.D = lerp(f, P_D); }
  const c = out.comps;
  if ([c.A, c.B, c.C, c.D].every(v => v != null)) {
    const avg = W.A * c.A + W.B * c.B + W.C * c.C + W.D * c.D;
    out.score = Math.max(1, Math.min(100, Math.round(1 + 0.99 * avg)));
  }
  return out;
}
const band = s => s < 25 ? 0 : s < 50 ? 1 : s < 70 ? 2 : s < 85 ? 3 : 4;
window.CMMoneyHealthEngine = { compute, lerp, band }; // exposed for testing

/* ---------- helpers ---------- */
const PER = { m: 1, w: 52 / 12, y: 1 / 12 };
const num = v => { if (v == null || v === "") return null; const n = Number(String(v).replace(/[€\s]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", ".")); return isFinite(n) && n >= 0 ? n : null; };
const STORE = "cm_mh_answers", HIST = "cm_mh_history";
const ss = { get: () => { try { return JSON.parse(sessionStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }, set: v => { try { sessionStorage.setItem(STORE, JSON.stringify(v)); } catch (e) {} } };
const hist = { get: () => { try { return JSON.parse(localStorage.getItem(HIST)) || []; } catch (e) { return []; } }, add: e => { try { const h = hist.get(); h.push(e); localStorage.setItem(HIST, JSON.stringify(h.slice(-24))); } catch (e2) {} } };

let L = S.en, lang = "en", esc = s => String(s), V = null, root = null, A = {}, step = 0, view = "intro";
const eur = v => "€" + Math.round(v).toLocaleString(lang === "en" ? "en-GB" : lang === "it" ? "it-IT" : "mt-MT");
const pct = v => Math.round(v * 100) + "%";
const mo = m => L.months(m < 1 ? m : Math.round(m * 2) / 2);
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

/* answers → monthly figures */
function figures() {
  const m = (o) => o && num(o.v) != null ? num(o.v) * PER[o.per || "m"] : null;
  const per = A.spendPer || "m";
  const h = num(A.housing), l = num(A.living), r = num(A.repay);
  const anySpend = [h, l, r].some(x => x != null);
  const spend = anySpend ? ((h || 0) + (l || 0) + (r || 0)) * PER[per] : null;
  const income = A.incomeType === 4 && !(num(A.income?.v) > 0) ? 0 : m(A.income);
  return { income, spend, housing: (h || 0) * PER[per], living: (l || 0) * PER[per], repay: (r || 0) * PER[per],
    essential: num(A.essential) != null ? num(A.essential) * PER[per] : null,
    savings: A.savingsMode === "none" ? "none" : A.savingsMode === "unsure" ? "unsure" : num(A.savings),
    covered: A.covered === "unsure" || A.covered == null ? (A.covered === "unsure" ? "unsure" : null) : Number(A.covered) };
}

/* ---------- UI pieces ---------- */
const STEPS = ["who", "goal", "type", "income", "spend", "essential", "savings", "covered"];
const tiles = (key, opts, multi) => `<div class="mh-tiles">${opts.map((o, i) => `<button type="button" class="mh-tile ${A[key] === i ? "on" : ""}" data-k="${key}" data-v="${i}">${esc(o)}</button>`).join("")}</div>`;
const perSeg = (key, val) => `<div class="mh-per" role="group">${[["m", L.monthly], ["w", L.weekly], ["y", L.yearly]].map(([k, t]) => `<button type="button" class="${(val || "m") === k ? "on" : ""}" data-per="${key}" data-pv="${k}">${t}</button>`).join("")}</div>`;
const money = (id, val, label) => `<label class="mh-money">${label ? `<span>${esc(label)}</span>` : ""}<div class="mh-in"><b>€</b><input id="${id}" inputmode="decimal" autocomplete="off" placeholder="0" value="${val == null ? "" : esc(val)}"></div></label>`;

function gauge(score) {
  const r = 120, cx = 150, cy = 150, len = Math.PI * r, frac = score == null ? 0 : (score - 1) / 99;
  const ang = Math.PI * (1 - frac), kx = cx + r * Math.cos(ang), ky = cy - r * Math.sin(ang);
  const ticks = [0, 25, 50, 70, 85, 100].map(v => { const a = Math.PI * (1 - v / 100); return `<line x1="${cx + (r + 18) * Math.cos(a)}" y1="${cy - (r + 18) * Math.sin(a)}" x2="${cx + (r + 26) * Math.cos(a)}" y2="${cy - (r + 26) * Math.sin(a)}" stroke="rgba(255,255,255,.35)" stroke-width="2"/>`; }).join("");
  return `<svg class="mh-gauge" viewBox="0 0 300 175" role="img" aria-label="${score ?? ""} / 100">
    <defs><linearGradient id="mhg" x1="0" x2="1"><stop offset="0" stop-color="#ff6b5b"/><stop offset=".35" stop-color="#ffb547"/><stop offset=".6" stop-color="#ffe066"/><stop offset=".8" stop-color="#7bdc8f"/><stop offset="1" stop-color="#2fd18b"/></linearGradient></defs>
    ${ticks}
    <path d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="22" stroke-linecap="round"/>
    <path class="mh-arc" d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="url(#mhg)" stroke-width="22" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}" data-to="${len * (1 - frac)}"/>
    ${score == null ? "" : `<circle class="mh-knob" cx="${kx}" cy="${ky}" r="13" fill="#fff" stroke="#0d2a4a" stroke-width="4" opacity="0"/>`}
  </svg>`;
}
const ring = (p) => { const c = 2 * Math.PI * 22, col = p == null ? "#c9d1dc" : p < 25 ? "#e5534b" : p < 50 ? "#f0a030" : p < 70 ? "#e0c23a" : p < 85 ? "#57c27a" : "#1fae6b";
  return `<svg viewBox="0 0 56 56" class="mh-ring"><circle cx="28" cy="28" r="22" fill="none" stroke="#e8edf3" stroke-width="7"/><circle cx="28" cy="28" r="22" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${p == null ? c : c * (1 - p / 100)}" transform="rotate(-90 28 28)"/><text x="28" y="33" text-anchor="middle" font-size="15" font-weight="700" fill="#0d2a4a">${p == null ? "–" : Math.round(p)}</text></svg>`; };

/* ---------- screens ---------- */
function intro() {
  return `<section class="mh-hero"><div class="mh-hero-in">
    <div><p class="mh-eyebrow">${L.eyebrow}</p><h1>${L.h1}</h1><p class="mh-lead">${L.lead}</p><p class="mh-lead">${L.lead2}</p>
      <div class="mh-chips">${L.chips.map(c => `<span>${c}</span>`).join("")}</div>
      <div class="mh-ctas"><button class="mh-btn" data-go="start">${L.start} →</button><button class="mh-btn ghost" data-go="docs">${L.docs}</button></div>
      <p class="mh-fine">${L.notCredit}</p><p class="mh-fine">🔒 ${L.privacy}</p></div>
    <div class="mh-preview">${gauge(78)}<div class="mh-prev-num"><b>78</b><span>/100</span></div><div class="mh-prev-band">${L.bands[3]}</div>
      <div class="mh-prev-pills">${L.pillars.map(([t]) => `<span>${t}</span>`).join("")}</div></div>
  </div></section>
  <div class="mh-pillars">${L.pillars.map(([t, d], i) => `<div class="mh-pillar"><span class="mh-pi">${["◔", "◕", "◑", "◒"][i]}</span><b>${t}</b><small>${d}</small><em>${[30, 30, 25, 15][i]}%</em></div>`).join("")}</div>
  ${howBlock()}`;
}
const howBlock = () => `<details class="mh-how"><summary>${L.howH}</summary><ul>${L.how.map(x => `<li>${x}</li>`).join("")}</ul></details>`;

function question() {
  const k = STEPS[step], n = step + 1, t = STEPS.length;
  let body = "";
  if (k === "who") body = `<h2>${L.q1}</h2>${tiles("who", L.q1o)}`;
  if (k === "goal") body = `<h2>${L.q2}</h2><p class="mh-help">${L.q2h}</p>${tiles("goal", L.q2o)}`;
  if (k === "type") body = `<h2>${L.q3}</h2>${tiles("incomeType", L.q3o)}`;
  if (k === "income") body = `<h2>${A.varies ? L.q4alt : L.q4}</h2><p class="mh-help">${L.q4h}</p>${A.varies ? "" : perSeg("income", A.income?.per)}${money("mh_income", A.income?.v)}
    <label class="mh-check"><input type="checkbox" id="mh_varies" ${A.varies ? "checked" : ""}> ${L.q4v}</label>
    ${A.varies ? `<label class="mh-money sm"><span>${L.q4months}</span><div class="mh-in"><input id="mh_vmonths" inputmode="numeric" placeholder="6" value="${esc(A.vmonths ?? "")}"></div></label>` : ""}`;
  if (k === "spend") body = `<h2>${L.q5}</h2><p class="mh-help">${L.q5h}</p>${perSeg("spend", A.spendPer)}
    ${money("mh_housing", A.housing, L.q5f[0])}${money("mh_living", A.living, L.q5f[1])}${money("mh_repay", A.repay, L.q5f[2])}
    <details class="mh-tip"><summary>💳 Credit cards</summary><p>${L.q5card}</p></details>
    <div class="mh-total">${L.total}: <b id="mh_tot">${eur(((num(A.housing) || 0) + (num(A.living) || 0) + (num(A.repay) || 0)))}</b> <small>/ ${L[{m: "monthly", w: "weekly", y: "yearly"}[A.spendPer || "m"]].toLowerCase()}</small></div>`;
  if (k === "essential") { const tot = (num(A.housing) || 0) + (num(A.living) || 0) + (num(A.repay) || 0);
    body = `<h2>${L.q6}</h2><p class="mh-help">${L.q6h}</p>${money("mh_ess", A.essential)}<p class="mh-of">${T(L.q6of, { v: eur(tot) })}</p><p class="mh-err" id="mh_err" hidden>${T(L.q6err, { v: eur(tot) })}</p>`; }
  if (k === "savings") body = `<h2>${L.q7}</h2><p class="mh-help">${L.q7h}</p>${money("mh_sav", A.savingsMode ? "" : A.savings)}
    <div class="mh-tiles two"><button type="button" class="mh-tile ${A.savingsMode === "none" ? "on" : ""}" data-sm="none">${L.none}</button><button type="button" class="mh-tile ${A.savingsMode === "unsure" ? "on" : ""}" data-sm="unsure">${L.unsure}</button></div>`;
  if (k === "covered") body = `<h2>${L.q8}</h2><div class="mh-tiles nums">${[0, 1, 2, 3].map(i => `<button type="button" class="mh-tile ${A.covered === i ? "on" : ""}" data-cov="${i}">${i}</button>`).join("")}<button type="button" class="mh-tile ${A.covered === "unsure" ? "on" : ""}" data-cov="unsure">${L.unsure}</button></div>`;
  return `<div class="mh-flow"><div class="mh-prog"><span style="width:${n / (t + 1) * 100}%"></span></div><p class="mh-stepof">${T(L.stepOf, { n, t: t + 1 })}</p>
    <div class="mh-q">${body}<p class="mh-err" id="mh_need" hidden>${L.needNum}</p></div>
    <div class="mh-nav"><button class="mh-btn ghost" data-go="back">← ${L.back}</button><button class="mh-btn" data-go="next">${L.next} →</button></div></div>`;
}

function confirmScreen() {
  const f = figures(), miss = [];
  if (f.savings === "unsure" || f.savings == null) miss.push(6);
  if (A.covered === "unsure") miss.push(7);
  const row = (k, v, s) => `<div class="mh-crow"><span>${k}</span><b>${v}</b><button class="mh-link" data-edit="${s}">✎</button></div>`;
  return `<div class="mh-flow"><div class="mh-prog"><span style="width:100%"></span></div><p class="mh-stepof">${T(L.stepOf, { n: 9, t: 9 })}</p>
    <div class="mh-q"><h2>${L.confirm}</h2>
      <div class="mh-confirm">
        ${row(L.cIncome, f.income != null ? eur(f.income) : "–", 3)}
        ${row(L.cSpend, f.spend != null ? eur(f.spend) : "–", 4)}
        ${row(L.cEss, f.essential != null ? eur(f.essential) : "–", 5)}
        ${row(L.cSav, f.savings === "none" ? L.none : f.savings === "unsure" ? L.unsure : f.savings != null ? eur(f.savings) : "–", 6)}
        ${row(L.cCov, A.covered === "unsure" ? L.unsure : A.covered != null ? T(L.cOf, { n: A.covered }) : "–", 7)}
      </div>
      <p class="mh-help">${L.cNote}</p>
      ${miss.length ? `<div class="mh-more"><b>${L.more}</b><p>${L.moreSub}</p><button class="mh-btn ghost sm" data-edit="${miss[0]}">${L.addEst}</button></div>` : ""}
    </div>
    <div class="mh-nav"><button class="mh-btn ghost" data-edit="0">${L.edit}</button><button class="mh-btn" data-go="result">${miss.length ? L.partial : L.see} →</button></div></div>`;
}

function recommendations(f, r) {
  const goal = A.goal ?? 3, out = [];
  const inc = f.income, ess = f.essential, left = r.left;
  if (left < 0) { const non = Math.max(0, f.spend - ess); out.push({ p: 0, h: L.rGapH, t: non >= -left * 0.5 ? L.rGap(eur(-left), eur(non)) : L.rGap2(eur(-left)), cta: ["groceries", "groceries"] }); }
  if (r.buffer != null && r.buffer < 3 && ess > 0) { const amt = Math.max(25, Math.round((left > 0 ? left * 0.5 : ess * 0.05) / 10) * 10), n = Math.ceil(ess / amt);
    out.push({ p: goal === 1 ? -1 : 1, h: L.rBufH, t: L.rBuf(eur(ess), eur(amt), n), cta: ["savings", "savings"] }); }
  if (f.repay > 0 && f.repay / inc >= 0.2) out.push({ p: goal === 2 ? -1 : 2, h: L.rRepH, t: L.rRep(eur(f.repay), pct(f.repay / inc)), cta: [f.housing === 0 ? "mortgages" : "loans", f.housing === 0 ? "mortgages" : "personal-loans"] });
  if (typeof A.covered === "number" && A.covered < 3) out.push({ p: 3, h: L.rConH, t: L.rCon(A.covered), cta: ["bank", "bank-accounts"] });
  if (goal === 0 || out.length < 2) out.push({ p: goal === 0 ? -1 : 4, h: L.rSpendH, t: L.rSpend(pct(f.housing / inc), pct(f.living / inc), pct(f.repay / inc)), cta: ["groceries", "groceries"] });
  if (r.buffer != null && r.buffer >= 3 && left >= 0) out.push({ p: 5, h: L.rWorkH, t: L.rWork, cta: ["savings", "savings"] });
  return out.sort((a, b) => a.p - b.p).slice(0, 3);
}

function result() {
  const f = figures(), r = compute(f), h = hist.get(), last = h[h.length - 1];
  if (!(f.income > 0)) { // no regular income → runway analysis
    return `<div class="mh-res"><div class="mh-card-dark mh-runway"><p class="mh-eyebrow">${L.runwayH}</p>
      <div class="mh-big">${r.runway != null ? mo(r.runway) : "–"}</div><p>${r.runway != null ? L.runwayP(mo(r.runway), eur(f.spend)) : L.needNum}</p><p class="mh-fine">${L.runwayNote}</p></div>
      ${actionsRow()}${howBlock()}</div>`;
  }
  const s = r.score, c = r.comps;
  const bufM = r.buffer != null ? mo(r.buffer) : null;
  const fixExpl = r.buffer == null || r.buffer < 0.25 ? L.expl(r.left > 0.5 ? L.leftPos : r.left >= -0.5 ? L.leftZero : L.leftNeg, L.bufText(0)) : L.expl(r.left > 0.5 ? L.leftPos : r.left >= -0.5 ? L.leftZero : L.leftNeg, L.bufText(bufM));
  const cards = [
    ["A", 30, c.A, r.left >= 0 ? L.cA(eur(r.left), pct(r.leftPct)) : L.cAneg(eur(-r.left), pct(-r.leftPct))],
    ["B", 30, c.B, r.buffer != null ? L.cB(bufM) : L.cMissing],
    ["C", 25, c.C, typeof A.covered === "number" ? L.cC(A.covered) : L.cMissing],
    ["D", 15, c.D, r.flexPct != null ? L.cD(pct(Math.max(0, r.flexPct))) : L.cMissing],
  ];
  const recs = recommendations(f, r);
  const since = last && s != null ? L.change(s - last.score, new Date(last.d).toLocaleDateString(lang === "en" ? "en-GB" : lang, { day: "numeric", month: "short" })) : "";
  const varNote = A.varies && num(A.vmonths) != null && num(A.vmonths) < 6 ? `<p class="mh-fine">${L.limited(num(A.vmonths))}</p>` : "";
  return `<div class="mh-res">
    <div class="mh-card-dark">
      <div class="mh-score-top"><div>
        <p class="mh-eyebrow">${s != null ? L.scoreTitle : L.partialH}</p>
        ${s != null ? `<div class="mh-gwrap">${gauge(s)}<div class="mh-num"><b data-count="${s}">0</b><span>/100</span></div></div>
          <div class="mh-bandl b${band(s)}">${L.bands[band(s)]}</div>` : `<p class="mh-lead">${L.partialP}</p>`}
        ${since ? `<div class="mh-since">${since}</div>` : ""}
      </div>
      <div class="mh-side"><p class="mh-expl">${fixExpl}</p>
        <div class="mh-meta"><span class="mh-tag">● ${L.basedOn}</span><span class="mh-tag">${L.calcToday}</span></div>
        <p class="mh-fine">${L.coverage}</p>${varNote}<p class="mh-fine">${L.disclaimer}</p></div></div>
    </div>
    ${r.left < -0.5 ? `<div class="mh-alert"><b>⚠ ${L.deficitH}</b><p>${(f.savings === "none" || f.savings === 0) ? L.deficitP0 : L.deficitP}</p></div>` : ""}
    <div class="mh-cards">${cards.map(([k, w, p, txt], i) => `<div class="mh-ind">${ring(p)}<div><div class="mh-ind-h"><b>${L.cards[i]}</b><small>${T(L.weight, { w })}</small></div><p>${txt}</p></div></div>`).join("")}</div>
    ${recs.length ? `<section class="mh-next"><h2>${L.nextH}</h2><p class="mh-help">${L.nextSub}</p><div class="mh-recs">${recs.map((x, i) => `<div class="mh-rec"><span class="mh-rn">${i + 1}</span><h3>${x.h}</h3><p>${x.t}</p><a class="mh-link" href="#${x.cta[1]}">${L.cta[x.cta[0]]} →</a></div>`).join("")}</div></section>` : ""}
    ${s != null ? simBlock() : ""}
    <section class="mh-docs"><div><h3>${L.docH}</h3><p>${L.docP}</p></div><button class="mh-btn ghost" data-go="docs">${L.docBtn} <span class="mh-soon">${L.soon}</span></button></section>
    ${actionsRow(s != null)}
    ${howBlock()}
  </div>`;
}
const actionsRow = (canSave) => `<div class="mh-actions">${canSave ? `<button class="mh-btn" data-go="save">💾 ${L.save}</button>` : ""}<button class="mh-btn ghost" data-go="confirm">${L.edit}</button><button class="mh-btn ghost" data-go="restart">↺ ${L.again}</button></div>`;
const simBlock = () => `<section class="mh-sim"><div class="mh-sim-h"><h2>${L.simH}</h2><span class="mh-tag light">${L.simTag}</span></div>
  <div class="mh-sim-grid">
    <label>${L.simSave}<input type="range" id="sim_s" min="0" max="1000" step="25" value="0"><output id="sim_so">€0</output></label>
    <label>${L.simCut}<input type="range" id="sim_c" min="0" max="1000" step="25" value="0"><output id="sim_co">€0</output></label>
    <label>${L.simInc}<input type="range" id="sim_i" min="-1000" max="1000" step="25" value="0"><output id="sim_io">€0</output></label>
  </div><div class="mh-sim-out" id="sim_out"></div><p class="mh-fine">${L.simNote}</p></section>`;

function runSim() {
  const f = figures(), base = compute(f);
  const s = +root.querySelector("#sim_s").value, cut = +root.querySelector("#sim_c").value, di = +root.querySelector("#sim_i").value;
  root.querySelector("#sim_so").textContent = eur(s); root.querySelector("#sim_co").textContent = eur(cut); root.querySelector("#sim_io").textContent = (di < 0 ? "−" : "+") + eur(Math.abs(di));
  const nonEss = Math.max(0, f.spend - f.essential), spend2 = Math.max(0, f.spend - cut), ess2 = Math.max(0, f.essential - Math.max(0, cut - nonEss));
  const sav0 = f.savings === "none" ? 0 : f.savings, sav12 = Math.max(0, sav0 + 12 * s);
  const r2 = compute({ ...f, income: Math.max(0, f.income + di), spend: spend2, essential: ess2, savings: sav12 });
  const b0 = base.buffer, b2 = r2.buffer;
  root.querySelector("#sim_out").innerHTML = `
    <div><small>${L.cards[1]}</small><b>${mo(b0)} → ${b2 != null ? mo(b2) : "–"}</b><p>${L.simOut(mo(b0), b2 != null ? mo(b2) : "–")}</p></div>
    <div><small>${L.cards[0]}</small><b>${eur(base.left)} → ${r2.left != null ? eur(r2.left) : "–"}</b><p>${L.simLeft(eur(base.left), r2.left != null ? eur(r2.left) : "–")}</p></div>
    <div><small>Score</small><b>${base.score} → ${r2.score ?? "–"}</b><p>${L.simScore(base.score, r2.score ?? "–")}</p></div>`;
}

/* ---------- controller ---------- */
function render() {
  root.innerHTML = view === "intro" ? intro() : view === "q" ? question() : view === "confirm" ? confirmScreen() : view === "docs" ? docsScreen() : result();
  bind();
  if (view === "result") animate();
  if (view === "q") setTimeout(() => root.querySelector(".mh-q input")?.focus(), 30);
}
const docsScreen = () => `<div class="mh-flow"><div class="mh-q"><h2>${L.docH}</h2><p class="mh-help">${L.docSoon}</p><p class="mh-fine">Never upload banking passwords, PINs or security codes.</p></div>
  <div class="mh-nav"><button class="mh-btn ghost" data-go="home">← ${L.back}</button><button class="mh-btn" data-go="start">${L.start} →</button></div></div>`;
function animate() {
  const arc = root.querySelector(".mh-arc"), knob = root.querySelector(".mh-knob"), n = root.querySelector("[data-count]");
  requestAnimationFrame(() => { if (arc) arc.style.strokeDashoffset = arc.dataset.to; if (knob) setTimeout(() => knob.setAttribute("opacity", 1), 900); });
  if (n) { const to = +n.dataset.count, t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 1100); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
  if (root.querySelector("#sim_s")) { root.querySelectorAll(".mh-sim input").forEach(i => i.oninput = runSim); runSim(); }
}
function readStep() {
  const k = STEPS[step], v = id => root.querySelector("#" + id)?.value;
  if (k === "income") { A.income = { v: v("mh_income"), per: A.varies ? "m" : (A.income?.per || "m") }; A.vmonths = v("mh_vmonths"); }
  if (k === "spend") { A.housing = v("mh_housing"); A.living = v("mh_living"); A.repay = v("mh_repay"); }
  if (k === "essential") A.essential = v("mh_ess");
  if (k === "savings" && num(v("mh_sav")) != null) { A.savings = v("mh_sav"); A.savingsMode = null; }
  ss.set(A);
}
function valid() {
  const k = STEPS[step], need = root.querySelector("#mh_need");
  const bad = (k === "who" && A.who == null) || (k === "goal" && A.goal == null) || (k === "type" && A.incomeType == null)
    || (k === "income" && num(A.income?.v) == null && A.incomeType !== 4)
    || (k === "spend" && [A.housing, A.living, A.repay].every(x => num(x) == null))
    || (k === "essential" && num(A.essential) == null)
    || (k === "savings" && num(A.savings) == null && !A.savingsMode)
    || (k === "covered" && A.covered == null);
  if (k === "essential" && num(A.essential) != null) {
    const tot = (num(A.housing) || 0) + (num(A.living) || 0) + (num(A.repay) || 0);
    if (num(A.essential) > tot + 0.001) { root.querySelector("#mh_err").hidden = false; return false; }
  }
  if (need) need.hidden = !bad;
  return !bad;
}
function bind() {
  root.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { A[b.dataset.k] = +b.dataset.v; ss.set(A); if (b.dataset.k !== "incomeType" || true) { step++; render(); } });
  root.querySelectorAll("[data-per]").forEach(b => b.onclick = () => { readStep(); if (b.dataset.per === "income") A.income = { ...(A.income || {}), per: b.dataset.pv }; else A.spendPer = b.dataset.pv; ss.set(A); render(); });
  root.querySelectorAll("[data-sm]").forEach(b => b.onclick = () => { A.savingsMode = b.dataset.sm; A.savings = null; ss.set(A); step++; render(); });
  root.querySelectorAll("[data-cov]").forEach(b => b.onclick = () => { A.covered = b.dataset.cov === "unsure" ? "unsure" : +b.dataset.cov; ss.set(A); view = "confirm"; render(); });
  const vr = root.querySelector("#mh_varies"); if (vr) vr.onchange = () => { readStep(); A.varies = vr.checked; ss.set(A); render(); };
  ["mh_housing", "mh_living", "mh_repay"].forEach(id => { const el = root.querySelector("#" + id); if (el) el.oninput = () => { const t = ["mh_housing", "mh_living", "mh_repay"].reduce((s, i) => s + (num(root.querySelector("#" + i).value) || 0), 0); root.querySelector("#mh_tot").textContent = eur(t); }; });
  root.querySelectorAll(".mh-q input").forEach(i => i.onkeydown = e => { if (e.key === "Enter") root.querySelector('[data-go="next"]')?.click(); });
  root.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => { step = +b.dataset.edit; view = "q"; render(); scrollTop(); });
  root.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
    const g = b.dataset.go;
    if (g === "start") { view = "q"; step = A.who != null && A.covered != null ? 0 : 0; }
    if (g === "docs") view = "docs";
    if (g === "home") view = "intro";
    if (g === "back") { readStep(); if (step === 0) view = "intro"; else step--; }
    if (g === "next") { readStep(); if (!valid()) return; if (step < STEPS.length - 1) step++; else view = "confirm"; }
    if (g === "result") view = "result";
    if (g === "confirm") view = "confirm";
    if (g === "restart") { A = {}; ss.set(A); step = 0; view = "intro"; }
    if (g === "save") { const r = compute(figures()); if (r.score != null) { hist.add({ d: new Date().toISOString(), score: r.score, comps: r.comps }); b.textContent = "✓ " + L.saved; b.disabled = true; } return; }
    render(); scrollTop();
  });
}
const scrollTop = () => { const y = root.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > y) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); };

window.CMMoneyHealth = {
  nav: l => (S[l] || S.en).nav,
  page(l, helpers) { lang = S[l] ? l : "en"; L = S[lang]; esc = helpers.esc; V = helpers.V; A = ss.get(); if (view !== "result" && view !== "confirm") { view = "intro"; step = 0; }
    return `<div class="mh" id="mh"></div>`; },
  mount() { root = document.getElementById("mh"); if (root) render(); },
};
})();
