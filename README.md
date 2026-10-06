# Generátor widgetů pro QARO

Interní nástroj DigiDay na rychlou výrobu odkazových widgetů vkládaných do webů přes iframe (typicky QARO iframe modul). Bez gitu a bez deploye, celá podoba widgetu je zakódovaná přímo v URL.

- Generátor: https://dominikdigiday.github.io/qaro-widget/ (zrcadlo: https://qaro-widget.vercel.app/)
- Renderer widgetu: `https://dominikdigiday.github.io/qaro-widget/w/?c=…`
- Krátký odkaz: `https://qaro-widget.vercel.app/s/<id>`

## Jak vyrobit widget

1. Otevři generátor a vyplň formulář (název, adresa odkazu, volitelně podtitulek, popis, logo, barva, texty tlačítka).
2. Zkopíruj „URL widgetu" a vlož ji do iframe modulu v QARO. Výška iframe typicky 175 px.
3. Hotovo, nic se nikam nenasazuje.

Úprava hotového widgetu: vlož jeho URL do pole „Upravit existující widget", formulář se předvyplní, uprav a do QARO dej novou URL.

## Krátký odkaz

Dlouhou URL widgetu jde v generátoru jedním klikem zkrátit na tvar `https://qaro-widget.vercel.app/s/<id>`. Zkracovač běží na Vercelu (projekt `qaro-widget`, tým digi-day-team1):

- `POST /api/shorten` s `{"url": "<dlouhá URL widgetu>"}` uloží mapování do Vercel Blob (store `qaro-widget-links`) a vrátí krátký odkaz. Zkrátit jde jen URL rendereru z tohoto projektu, nic cizího.
- `GET /s/<id>` přesměruje (302) na dlouhou URL. Id je hash konfigurace, stejný widget má vždy stejný krátký odkaz a mapování se nedá přepsat na jiný obsah.
- Krátký odkaz funguje i jako `src` iframe, prohlížeč redirect uvnitř iframe normálně následuje.

## Jak to funguje

- `index.html` je generátor, `w/index.html` je renderer.
- Konfigurace widgetu je JSON zakódovaný přes base64url v query parametru `c`. Nikde se nic neukládá, každá URL je samostatný widget.
- Renderer staví obsah přes `textContent` (žádné vkládání HTML z konfigurace), odkaz povolí jen `http(s)://`, logo jen `http(s)://` nebo `data:image/`.
- Odkaz se otevírá přes `target="_blank"`. QARO vkládá iframe se sandboxem bez `allow-top-navigation`, takže navigace celého okna by selhala, `allow-popups` v sandboxu je.
- Widget vyplní celou plochu iframe, ať má jakýkoliv rozměr. Pod 900 px šířky skryje popis, pod 640 px i logo a poznámku, takže nízká výška stačí i na mobilu.
- Světlejší a tmavší odstíny (hover, pozadí loga, rámeček) se dopočítávají z hlavní barvy, barva textu tlačítka se volí automaticky podle kontrastu.
- Pozadí karty jde změnit: barva (u tmavé se texty automaticky přepnou na světlé) a volitelný obrázek přes celou kartu (cover) s nastavitelnou opacity, skrz kterou prosvítá barva pozadí.

## Generátor ČEZ odstávek

- Generátor: https://digidayczech.github.io/qaro-widget/cez/
- Renderer: `…/qaro-widget/cez/w/?h=<identifikátor obce>&s=<250|468|728>`

Obec dostane od ČEZ Distribuce kód banneru „Plánované odstávky" (`ppo.cezdistribuce.cz/ovm/<hash>/redirect` + `/image/<rozměr>`, starší tvar `ovm.bezstavy.cz/v1/<hash>/…`). Do generátoru se vloží celý kód, jedna z adres nebo jen hash, vybere se rozměr a URL se dá do iframe modulu v QARO.

- Renderer je jen obal: odkaz `…/redirect` (target `_blank`) a obrázek `…/image/<rozměr>`. Obsah banneru generuje ČEZ živě pro danou lokalitu (`Cache-Control: no-store`), otevřená stránka ho každých 15 minut obnoví.
- ČEZ nabízí jen rozměry 250 × 250, 468 × 60 a 728 × 90. Výška iframe = výška banneru + 4 px. V užším iframe se banner poměrově zmenší.
- Krátký odkaz funguje stejně jako u widgetů.

## Limity

- Logo musí být veřejně dostupný obrázek (URL), soubor nejde nahrát.
- URL delší než cca 2000 znaků může být v některých systémech problém, generátor na to upozorní.
