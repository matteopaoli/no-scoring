import Head from "next/head";
import Link from "next/link";

export const metadata = {
  title: "Termini e Condizioni - PayTomorrow",
  description: "Termini e condizioni generali di PayTomorrow",
};

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Navbar Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            PayTomorrow
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="border-b-2 border-gray-800 mb-8 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
              TERMINI E CONDIZIONI GENERALI
            </h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                DEFINIZIONI
              </h2>
              <p className="mb-4 text-gray-700">
                Ai fini delle presenti Condizioni generali, i termini
                successivamente indicati, ove riportati con lettera maiuscola,
                avranno il seguente significato:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                <li>
                  <strong>Account</strong> Viene creato con la registrazione del
                  Cliente e l'inserimento di tutti i dati. A ciascun account
                  verrà associato un ID e una password.
                </li>
                <li>
                  <strong>Cliente</strong> indica la persona fisica o giuridica
                  che registra l'Account sulla Piattaforma e titolare
                  dell'abbonamento al Servizio.
                </li>
                <li>
                  <strong>Cliente finale</strong> Si intende la persona fisica o
                  giuridica che acquista i beni o i servizi dal Cliente
                </li>
                <li>
                  <strong>Contratto</strong> Si intende congiuntamente: la
                  registrazione del Cliente alla Piattaforma; la sottoscrizione
                  della richiesta di abbonamento; le presenti Condizioni
                  generali.
                </li>
                <li>
                  <strong>Leg S.r.l.</strong> Società di diritto italiano con
                  sede in Brescia, cf. e p.iva 04231050982, titolare del
                  software PayTomorrow
                </li>
                <li>
                  <strong>PayTomorrow</strong> E' la piattaforma software in
                  cloud disponibile all'indirizzo web https://paytomorrow.it, di
                  proprietà di LEG SRL. Ogniqualvolta nelle presenti Condizioni
                  Generali è indicato PayTomorrow il riferimento è anche a Leg
                  S.r.l.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                1. Accettazione delle presenti condizioni generali
              </h2>
              <p className="mb-4 text-gray-700">
                Le presenti Condizioni generali si considerano lette ed
                accettate alla data di sottoscrizione della richiesta di
                abbonamento.
              </p>
              <p className="mb-4 text-gray-700">
                Eventuali modifiche delle presenti Condizioni Generali devono
                essere debitamente accettate e sottoscritte dalle Parti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                2. Oggetto
              </h2>
              <p className="mb-4 text-gray-700">
                Attraverso la piattaforma innovativa Paytomorrow i Clienti
                offrono ai loro Clienti finali la possibilità di dilazionare il
                pagamento del prezzo di un bene o di un servizio acquistato nel
                negozio fisico, ricevendo immediatamente l'intero corrispettivo
                dell'acquisto.
              </p>
              <p className="mb-4 text-gray-700">
                Paytomorrow crea una landing page con sistema POS integrato e
                implementa sistemi di pagamento con carta, pagamento differito e
                ricorrente tramite l'infrastruttura Stripe Connect sulla
                piattaforma https://paytomorrow.it; sviluppa una pagina
                e-commerce con caricamento illimitato di schede prodotto, e
                metodi di pagamento innovativi automatizzati durante il
                checkout; fornisce un pannello dedicato per funzionalità come
                "Pay by Link", con informazioni su transazioni, pagamenti,
                bonifici, trasferimenti e statistiche.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                3. Requisiti di accesso al servizio e tecnologia utilizzata
              </h2>
              <p className="mb-4 text-gray-700">
                Il Cliente si impegna a garantire un account Stripe attivo e
                funzionante, a verificare prima della sottoscrizione di tale
                contratto di esserne idoneo{" "}
                <a
                  href="https://stripe.com/it/legal/restricted-businesses"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://stripe.com/it/legal/restricted-businesses
                </a>
                . Il Cliente prende atto che PAYTOMORROW è una piattaforma e non
                ha alcun rapporto diretto né legame societario di alcun genere
                con WooCommerce, Stripe, Klarna, Sepa o altre società di servizi
                integrati. Paytomorrow utilizza tecnologie API e Webhook con
                Stripe Connect per espletare funzioni bancarie gestendo fondi,
                trasferimenti e revisioni degli account secondo le normative in
                vigore.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                4. Obblighi del Cliente
              </h2>
              <p className="mb-4 text-gray-700">
                Il Cliente si impegna a rispettare le norme di buona condotta, a
                non commettere illeciti e ad utilizzare correttamente la
                piattaforma. Il Cliente si obbliga a corrispondere nei termini
                pattuiti i corrispettivi previsti dal presente Contratto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                5. Durata e disdetta
              </h2>
              <p className="mb-4 text-gray-700">
                Il contratto tra Paytomorrow e il Cliente avrà durata annuale, a
                decorrere dalla data di sottoscrizione della richiesta di
                abbonamento. Salvo disdetta da comunicare a Paytomorrow, via
                PEC, entro 30 giorni prima della data di scadenza del contratto,
                quest’ultimo si intenderà tacitamente rinnovato per la medesima
                durata. Alla disdetta del contratto i servizi di Stripe e il
                collegamento con la Leg per il flusso provvigionale potrebbero
                rimanere attivi. Tale disattivazione è possibile solo
                dall’account del Cliente e rimane un onere a suo carico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                6. Corrispettivo
              </h2>
              <p className="mb-4 text-gray-700">
                Il costo di attivazione del Servizio in abbonamento è pari ad
                Euro 90,00 (IVA esclusa) per anno da corrispondere a Paytomorrow
                in via anticipata mediante bonifico bancario o pagamento con
                carta di credito. Paytomorrow, inoltre, spetterà un compenso
                pari ad Euro.... su ogni transazione eseguita in aggiunta alle
                commissioni applicate da Stripe e dalle controparti da
                quest’ultima utilizzate per i pagamenti. Il compenso è fatturato
                in modo autonomo ed indipendente da Stripe e Leg Srl con cadenza
                mensile fine mese con pagamento da effettuarsi entro 10 giorni
                dal deposito della fattura nel cassetto fiscale del Cliente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                7. Mancato pagamento
              </h2>
              <p className="mb-4 text-gray-700">
                In caso di mancato pagamento da parte del Cliente del
                corrispettivo dovuto alla scadenza prevista, Paytomorrow si
                riserva il diritto di sospendere immediatamente l’erogazione del
                Servizio fino al pagamento dell’intero importo dovuto. Decorsi
                inutilmente 15 (quindici) giorni dall’invio, mediante PEC, della
                diffida ad adempiere Paytomorrow è titolare del diritto di
                risolvere il Contratto senza necessità di ulteriori
                comunicazioni formali, impregiudicato ogni altro mezzo di tutela
                per ottenere il pagamento degli importi dovuti oltre l’eventuale
                risarcimento del danno subito in conseguenza dell’inadempimento.
                In caso di ritardo di pagamento, si applica la disciplina
                prevista dal d.lgs 231/2002. Il Cliente è inoltre tenuto a
                corrispondere un’indennità fissa di euro 40 (euro quaranta) per
                i costi sostenuti da Paytomorrow per il recupero delle somme non
                tempestivamente corrisposte dal Cliente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                8. Clausola risolutiva espressa
              </h2>
              <p className="mb-4 text-gray-700">
                Il presente contratto potrà essere risolto da Paytomorrow ai
                sensi dell’art. 1456 del codice civile al ricorrere di una o più
                delle seguenti circostanze:
                <ul className="list-disc pl-5">
                  <li>
                    Nel caso di procedura concorsuale del Cliente, o
                    liquidazione volontaria o coattiva, ovvero di procedure
                    previste in materia di crisi d’impresa;
                  </li>
                  <li>
                    In caso di inadempimento, da parte del Cliente, anche solo
                    parziale, di una o più clausole previste dalle presenti
                    condizioni generali;
                  </li>
                </ul>
                Al verificarsi di una o più delle circostanze sopra specificate,
                la volontà di risoluzione sarà comunicata al Cliente per
                iscritto e la risoluzione avrà effetto a decorrere dalla data di
                ricezione della comunicazione da parte del Cliente. Sono fatte
                salve la possibilità di agire da parte di Paytomorrow per ogni
                danno cagionato da fatto, o con dolo o colpa dal Cliente, nonché
                la possibilità di chiedere la risoluzione del presente contratto
                in base alle norme comuni. In caso di gravi inadempienze,
                comportamenti illeciti, pratiche commerciali scorrette e
                perdurata insolvenza del Cliente è facoltà di Paytomorrow di
                sospendere temporaneamente il Servizio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                9. Limitazione di responsabilità
              </h2>
              <p className="mb-4 text-gray-700">
                Paytomorrow si avvale di servizi di terze parti per l’erogazione
                del proprio Servizio. Stripe potrebbe limitare, sospendere
                temporaneamente o definitivamente i servizi qualora venga
                rilevato un utilizzo non conforme alle norme vigenti da parte
                del Cliente. Resta inteso che Paytomorrow non è responsabile per
                le limitazioni, sospensione e chiusure relativi all’account
                Stripe e ai vari circuiti di pagamento utilizzati per erogare i
                Servizi. Il Cliente accetta che Paytomorrow non è responsabile
                per eventuali pagamenti non riusciti a causa di carte non
                accettate dai circuiti di pagamento utilizzati. Paytomorrow non
                può essere ritenuta responsabile per i danni, di qualsiasi
                tipologia, subiti dal Cliente a causa del mancato funzionamento,
                per colpa imputabile al Cliente o non, dei circuiti di
                pagamento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                10. Forza maggiore
              </h2>
              <p className="mb-4 text-gray-700">
                Paytomorrow non sarà ritenuta responsabile per ritardi o
                inadempimenti nell’esecuzione del Contratto qualora gli stessi
                si siano verificati a causa di eventi di forza maggiore o caso
                fortuito ai sensi degli articoli 1218 e 1256 del codice civile;
                quali malfunzionamenti informativi della piattaforma. Al
                verificarsi del predetto evento, Paytomorrow si impegna a
                comunicare tempestivamente al Cliente, mediante PEC o email, il
                verificarsi di tale evento e l’interruzione del Servizio.
                Qualora l’impedimento sia temporaneo, il termine per
                l’adempimento dell’obbligazione è sospeso fino a quando
                Paytomorrow non sia più soggetta agli effetti dell’evento di
                forza maggiore. Qualora l’impedimento sia permanente, le Parti
                sono liberate dalle loro obbligazioni alle condizioni previste
                dall’articolo 1256 del codice civile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                11. Assistenza
              </h2>
              <p className="mb-4 text-gray-700">
                Paytomorrow mette a disposizione del Cliente il servizio di
                assistenza per il corretto utilizzo del Servizio o in caso di
                malfunzionamenti del Servizio stesso, operativo nei giorni
                feriali dalle 9.00 alle 17.30, al seguente indirizzo email:{" "}
                <a href="mailto:info@paytomorrow.it">info@paytomorrow.it</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                12. Cessione
              </h2>
              <p className="mb-4 text-gray-700">
                Il Contratto, compresi i diritti e gli obblighi dallo stesso
                previsti, può essere ceduto dal Cliente, in tutto o in parte, a
                titolo oneroso o meno, previo consenso scritto. Ai sensi
                dell’articolo 1407 del codice civile, Paytomorrow può cedere o
                trasferire liberamente il Contratto, inclusi i diritti e gli
                obblighi ivi previsti. Con la comunicazione scritta della
                cessione al Cliente, Paytomorrow sarà libera da ogni obbligo
                derivante dal Contratto e non sarà ritenuta responsabile in
                solido per l’esecuzione del Contratto da parte del cessionario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                13. Trattamento dati
              </h2>
              <p className="mb-4 text-gray-700">
                Per la gestione e la conservazione centralizzata di tutti i dati
                dei consumatori e dei loro consensi Paytomorrow e il Cliente
                stipulano un apposito accordo in forma scritta ai sensi
                dell’art. 28, par. 3, del Regolamento UE n. 2016/679, contenente
                le istruzioni sui fini, sulle modalità e da durata dal
                trattamento medesimo. In forza del suddetto accordo Paytomorrow
                assume la posizione di Responsabile del trattamento dei dati,
                impegnandosi ad operare secondo le istruzioni ricevute dal
                Cliente e nel rispetto dei principi di liceità, correttezza,
                trasparenza e minimizzazione così come descritti dal Regolamento
                UE n. 2016/679. Paytomorrow si impegna ad utilizzare le misure
                tecniche e organizzative adeguate, garantendo che non verrà
                trattenuto nessun dato personale dei Clienti finali.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                14. Proprietà Intellettuale
              </h2>
              <p className="mb-4 text-gray-700">
                Paytomorrow è unico titolare di tutti i diritti di proprietà
                intellettuale e industriale relativi alla piattaforma
                Paytomorrow. L’accesso al Servizio non conferisce al Cliente
                alcun diritto di proprietà sul Servizio, sulla sua tecnologia o
                sui diritti di proprietà intellettuale e industriali di
                Paytomorrow. Il Cliente non potrà utilizzare il Servizio per
                scopi diversi da quelli previsti dalle condizioni del Contratto.
                Di conseguenza, il Cliente si asterrà da qualsiasi Reverse
                Engineering del Servizio al fine di realizzare un prodotto o
                Servizio concorrente e/o copiare o riprodurre qualsiasi
                funzionalità, funzione o caratteristica grafica del Servizio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                15. Foro competente
              </h2>
              <p className="mb-4 text-gray-700">
                Il Contratto è disciplinato dal diritto italiano, per quanto
                attiene sia alle norme formali che sostanziali. In mancanza di
                una composizione bonaria della controversia, le parti
                deferiranno la controversia al Tribunale di Brescia, cui è
                attribuita competenza esclusiva, a prescindere dalla pluralità
                di convenuti o dall'escussione di garanzie di terzi, anche per i
                procedimenti d'urgenza e cautelari sia sommari che di parte.
              </p>
              <p className="mb-4 text-gray-700">
                Luogo, data
                <br />
                Firma
              </p>
              <p className="mb-4 text-gray-700">
                Ai sensi degli art. 1341 e 1342 c.c., il Cliente dichiara di
                aver letto ed esaminato e di approvare specificatamente le
                clausole di cui alle Condizioni Generali di Contratto: Art. 8
                (Clausola risolutiva espressa); Art. 9 (Limitazioni di
                responsabilità); Art. 10 (Forza maggiore); Art. 15 (Foro
                competente).
              </p>
              <p className="mb-4 text-gray-700">
                Luogo, data
                <br />
                Firma
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
