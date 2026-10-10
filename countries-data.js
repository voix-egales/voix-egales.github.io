export const countries = [
  {
    "id": "qc",
    "defaultSelected": false,
    "verifiedAt": "2026-10-04",
    "name": { "fr": "Québec", "en": "Québec" },
    "symbol": "127",
    "category": { "fr": "Majoritaire à un tour", "en": "First past the post" },
    "scope": { "fr": "Assemblée nationale · carte de 2026", "en": "National Assembly · 2026 electoral map" },
    "summary": {
      "fr": "Une circonscription, un siège. La personne qui obtient le plus de votes est élue, même sans dépasser 50 %. Les résultats locaux s’additionnent pour former l’Assemblée nationale.",
      "en": "One constituency, one seat. The candidate with the most votes wins, even without passing 50%. These local results add up to determine the membership of the National Assembly."
    },
    "columns": [
      {
        "title": { "fr": "Sur le bulletin", "en": "On the ballot" },
        "body": {
          "fr": "Choisir une seule candidature dans sa circonscription. Il n’y a ni classement des préférences ni deuxième vote pour une liste de parti.",
          "en": "Choose one candidate in your constituency. There is no preference ranking or separate vote for a party list."
        }
      },
      {
        "title": { "fr": "Dans l’Assemblée", "en": "In the Assembly" },
        "body": {
          "fr": "La carte de 2026 comprend 127 circonscriptions. Chaque victoire locale apporte un siège; aucune liste provinciale ne corrige les écarts entre votes et sièges.",
          "en": "The 2026 map has 127 constituencies. Each local victory yields one seat; no province-wide list adjusts differences between parties’ vote shares and seat shares."
        }
      }
    ],
    "tradeoff": {
      "fr": "Un lien territorial direct et un décompte simple, mais une répartition des sièges qui peut s’éloigner des proportions de votes à l’échelle du Québec.",
      "en": "A direct local representative and a simple count, but the distribution of seats can differ substantially from province-wide vote shares."
    },
    "footnote": {
      "fr": "L’élection du 5 octobre 2026 a utilisé cette carte de 127 circonscriptions : PQ 59, PLQ 40, PCQ 19, QS 9, CAQ 0. L’élection de 2022 comptait 125 circonscriptions.",
      "en": "The 5 October 2026 election used this 127-constituency map: PQ 59, PLQ 40, PCQ 19, QS 9, CAQ 0. The 2022 election had 125 constituencies."
    },
    "sources": [
      { "label": "Élections Québec · Systèmes électoraux", "url": "https://www.electionsquebec.qc.ca/comprendre/comprendre-la-democratie-et-les-elections/les-systemes-electoraux-du-quebec/" },
      { "label": "Élections Québec · Carte de 2026", "url": "https://www.electionsquebec.qc.ca/cartes-electorales/revision-de-la-carte-electorale-du-quebec/" }
    ]
  },
  {
    "id": "au",
    "defaultSelected": true,
    "verifiedAt": "2026-10-04",
    "name": { "fr": "Australie", "en": "Australia" },
    "symbol": "1,2,3",
    "category": { "fr": "Deux usages du vote préférentiel", "en": "Two uses of ranked voting" },
    "scope": { "fr": "Parlement fédéral · Chambre et Sénat", "en": "Federal Parliament · House and Senate" },
    "summary": {
      "fr": "Classer les candidatures peut servir deux objectifs différents. À la Chambre, le transfert des préférences désigne une personne par circonscription. Au Sénat, plusieurs sièges sont répartis avec un quota et des transferts.",
      "en": "Ranking candidates can serve two different purposes. In the House, preference transfers choose one person per constituency. In the Senate, several seats are filled using a quota and transfers."
    },
    "columns": [
      {
        "title": { "fr": "Chambre · vote alternatif", "en": "House · instant runoff" },
        "body": {
          "fr": "Classer toutes les candidatures. Sans majorité absolue, la candidature la moins soutenue est éliminée et ses votes passent aux préférences suivantes, jusqu’à une majorité des votes valides.",
          "en": "Rank every candidate. If nobody has an absolute majority, the lowest candidate is eliminated and votes transfer to next preferences until someone has a majority of valid votes."
        }
      },
      {
        "title": { "fr": "Sénat · vote unique transférable", "en": "Senate · single transferable vote" },
        "body": {
          "fr": "Plusieurs personnes sont élues par État ou territoire. Les candidatures atteignant le quota sont élues; leurs surplus sont transférés à valeur réduite. Les candidatures les moins soutenues peuvent ensuite être éliminées.",
          "en": "Each state or territory elects several senators. Candidates reaching the quota are elected, with surplus votes transferred at reduced value. The lowest remaining candidates can then be eliminated."
        }
      }
    ],
    "tradeoff": {
      "fr": "Le classement exprime des choix de repli. Il ne rend pas automatiquement une assemblée proportionnelle : le nombre de sièges par circonscription et les règles de transfert comptent aussi.",
      "en": "Ranking expresses backup choices. It does not automatically produce a proportional legislature: constituency size and transfer rules also matter."
    },
    "footnote": {
      "fr": "Au Sénat, la consigne est de classer au moins 6 groupes ou 12 candidatures, avec des règles de validité protégeant certains bulletins incomplets. Les préférences peuvent s’épuiser. Les derniers sièges peuvent être attribués sans atteindre le quota.",
      "en": "Senate instructions ask for at least 6 groups or 12 candidates, with validity provisions preserving some incomplete ballots. Preferences can run out. The final seats can sometimes be filled without reaching the quota."
    },
    "sources": [
      { "label": "AEC · Preferential voting", "url": "https://www.aec.gov.au/learn/preferential-voting.htm" },
      { "label": "AEC · Senate count", "url": "https://www.aec.gov.au/Voting/counting/senate_count.htm" },
      { "label": "AEC · Counting FAQ", "url": "https://aec.gov.au/faqs/counting.htm" }
    ]
  },
  {
    "id": "de",
    "defaultSelected": false,
    "verifiedAt": "2026-10-04",
    "name": { "fr": "Allemagne", "en": "Germany" },
    "symbol": "2",
    "category": { "fr": "Proportionnelle personnalisée", "en": "Personalised proportional representation" },
    "scope": { "fr": "Bundestag · règles appliquées depuis 2025", "en": "Bundestag · rules applied since 2025" },
    "summary": {
      "fr": "Deux votes, deux fonctions. Le premier désigne une candidature locale; le second détermine la part des sièges revenant au parti. Le Bundestag compte normalement 630 sièges, répartis selon une logique proportionnelle.",
      "en": "Two votes, two functions. The first chooses a local candidate; the second determines the party’s share of seats. The Bundestag normally has 630 seats, allocated on a proportional basis."
    },
    "columns": [
      {
        "title": { "fr": "Premier vote · candidature", "en": "First vote · candidate" },
        "body": {
          "fr": "Depuis 2025, arriver en tête ne suffit plus pour une candidature de parti : le siège doit être couvert par les seconds votes du parti dans le Land.",
          "en": "Since 2025, finishing first is not enough for a party candidate: the seat must also be supported by the party’s second-vote allocation in that state."
        }
      },
      {
        "title": { "fr": "Second vote · parti", "en": "Second vote · party" },
        "body": {
          "fr": "La répartition entre partis, puis entre leurs listes régionales, utilise Sainte-Laguë/Schepers. Les candidatures locales admissibles occupent d’abord les sièges; les listes complètent l’attribution.",
          "en": "Sainte-Laguë/Schepers allocates seats among parties, then among their state lists. Eligible constituency candidates fill seats first, followed by candidates from the lists."
        }
      }
    ],
    "tradeoff": {
      "fr": "Les sièges suivent les seconds votes des partis admissibles, tout en conservant des candidatures locales. Mais les seuils excluent certaines voix et une première place locale ne garantit plus un siège.",
      "en": "Seats follow eligible parties’ second votes while retaining local candidates. But thresholds exclude some votes, and finishing first locally no longer guarantees a seat."
    },
    "footnote": {
      "fr": "Seuil général de 5 %. Le régime issu du jugement de 2024 admet aussi les partis arrivés premiers dans au moins trois circonscriptions; les partis de minorités nationales sont exemptés. Des règles distinctes concernent les indépendants. Une clause de majorité peut augmenter les 630 sièges.",
      "en": "The general threshold is 5%. Under the 2024 court ruling, parties leading in at least three constituencies also qualify; national-minority parties are exempt. Independent candidates have separate rules. A majority safeguard can increase the usual 630 seats."
    },
    "sources": [
      { "label": "Federal Returning Officer · Electoral system", "url": "https://www.bundeswahlleiterin.de/en/bundestagswahlen/2025/informationen-waehler/wahlsystem.html" },
      { "label": "Federal Returning Officer · Threshold", "url": "https://www.bundeswahlleiterin.de/en/service/glossar/s/sperrklausel.html" },
      { "label": "Federal Elections Act · Current text", "url": "https://www.gesetze-im-internet.de/bwahlg/BJNR003830956.html" }
    ]
  },
  {
    "id": "jp",
    "defaultSelected": false,
    "verifiedAt": "2026-10-04",
    "name": { "fr": "Japon", "en": "Japan" },
    "symbol": "289+176",
    "category": { "fr": "Scrutin mixte parallèle", "en": "Parallel mixed system" },
    "scope": { "fr": "Chambre des représentants · 465 sièges", "en": "House of Representatives · 465 seats" },
    "summary": {
      "fr": "Deux voies s’additionnent : 289 sièges dans des circonscriptions à une personne et 176 sièges proportionnels dans 11 régions. Les sièges de liste sont calculés séparément; ils ne compensent pas les résultats locaux.",
      "en": "Two routes add together: 289 single-member constituency seats and 176 proportional seats across 11 regions. List seats are calculated separately; they do not compensate for constituency results."
    },
    "columns": [
      {
        "title": { "fr": "Une candidature locale", "en": "A local candidate" },
        "body": {
          "fr": "Dans chaque circonscription, la candidature qui obtient le plus de votes remporte le siège. Ce volet fonctionne au scrutin majoritaire à un tour.",
          "en": "In each constituency, the candidate with the most votes wins the seat. This part uses first past the post."
        }
      },
      {
        "title": { "fr": "Une liste de parti", "en": "A party list" },
        "body": {
          "fr": "Un autre vote choisit un parti. Dans chaque région, la méthode D’Hondt répartit les sièges de liste selon les votes obtenus par les partis.",
          "en": "A separate vote chooses a party. Within each region, D’Hondt allocates list seats according to the parties’ votes."
        }
      }
    ],
    "tradeoff": {
      "fr": "Les électeurs choisissent une personne et un parti séparément. La part proportionnelle diversifie les voies d’accès, mais l’ensemble des sièges peut rester éloigné des proportions de votes.",
      "en": "Voters choose a candidate and a party separately. Proportional seats provide another route into parliament, but overall seat shares can still differ from vote shares."
    },
    "footnote": {
      "fr": "Certaines candidatures figurent à la fois en circonscription et sur une liste. À rang égal, leur résultat local relatif peut déterminer l’ordre. Cette fiche décrit la Chambre des représentants, pas les règles différentes de la Chambre des conseillers.",
      "en": "Some candidates stand both locally and on a list. For candidates sharing a list rank, relative local performance can determine their order. This profile covers the House of Representatives, not the different House of Councillors rules."
    },
    "sources": [
      { "label": "House of Representatives · Membership", "url": "https://www.shugiin.go.jp/internet/itdb_english.nsf/html/statics/guide/structure.htm" },
      { "label": "Chiyoda electoral commission · Voting systems", "url": "https://www.city.chiyoda.lg.jp/koho/kurashi/senkyo/sedo/mamechishiki.html" },
      { "label": "Suginami · Proportional allocation", "url": "https://www.city.suginami.tokyo.jp/s118/1376.html" }
    ]
  },
  {
    "id": "tw",
    "defaultSelected": false,
    "verifiedAt": "2026-10-04",
    "name": { "fr": "Taïwan", "en": "Taiwan" },
    "symbol": "73+6+34",
    "category": { "fr": "Scrutin mixte parallèle", "en": "Parallel mixed system" },
    "scope": { "fr": "Yuan législatif · 113 sièges", "en": "Legislative Yuan · 113 seats" },
    "summary": {
      "fr": "Une assemblée de 113 sièges : 73 territoriaux, 6 autochtones et 34 de liste nationale. Le vote pour une candidature et le vote pour un parti alimentent des répartitions distinctes.",
      "en": "A 113-seat legislature: 73 constituency seats, 6 Indigenous seats and 34 national-list seats. The candidate vote and the party vote feed separate allocations."
    },
    "columns": [
      {
        "title": { "fr": "Représentation territoriale et autochtone", "en": "Constituency and Indigenous representation" },
        "body": {
          "fr": "Les 73 circonscriptions territoriales élisent chacune une personne. Deux circonscriptions autochtones nationales élisent chacune trois personnes; chaque électeur y choisit une seule candidature, sans transfert.",
          "en": "Each of the 73 territorial constituencies elects one person. Two nationwide Indigenous constituencies each elect three; voters choose one candidate, with no vote transfers."
        }
      },
      {
        "title": { "fr": "34 sièges de liste", "en": "34 list seats" },
        "body": {
          "fr": "Les partis obtenant au moins 5 % des votes de liste se partagent les sièges proportionnellement, avec attribution des restes. Les sièges territoriaux ne sont pas déduits de ce total.",
          "en": "Parties receiving at least 5% of list votes share these seats proportionally, with remaining seats allocated by remainders. Constituency seats are not deducted from this allocation."
        }
      }
    ],
    "tradeoff": {
      "fr": "Plusieurs formes de représentation coexistent. Mais les 34 sièges de liste ne corrigent pas les écarts des autres scrutins, et les partis sous le seuil n’en obtiennent aucun.",
      "en": "Several forms of representation coexist. But the 34 list seats do not correct disproportionality elsewhere, and parties below the threshold receive none of them."
    },
    "footnote": {
      "fr": "Les électeurs autochtones votent pour une candidature autochtone plutôt que territoriale, ainsi que pour un parti. Chaque parti doit attribuer au moins la moitié de ses sièges de liste à des femmes. Le seuil de 5 % concerne uniquement les listes.",
      "en": "Indigenous voters choose an Indigenous rather than a territorial candidate, alongside a party vote. At least half of each party’s elected list members must be women. The 5% threshold applies only to list seats."
    },
    "sources": [
      { "label": "Constitutional Additional Articles · Article 4", "url": "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0000002" },
      { "label": "Election and Recall Act · Article 67", "url": "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0020010" },
      { "label": "Central Election Commission · Voting guide", "url": "https://web.cec.gov.tw/api/file/9cdda387-4bb9-4939-8825-1d1a8cd66684.pdf" }
    ]
  }
]
;
