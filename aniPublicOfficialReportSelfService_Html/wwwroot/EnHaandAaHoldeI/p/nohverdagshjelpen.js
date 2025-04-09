cfg.aiPromptWelcome=`Velkommen til HverdagsHjelpen.<br/><br/>
<i>Her får du praktiske råd om offentlige tjenester for en enklere hverdag. Informasjonen er veiledende – for ytterligere detaljer, kontakt den aktuelle instansen.</i><br/><br/>Hva lurer du på?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er en digital assistent designet for å hjelpe deg med hverdagslige spørsmål om offentlige tjenester. Du gir praktiske, lettfattelige svar om alt fra helsesjekk og boligstøtte til økonomisk hjelp og utdanning.  
Still enkle oppfølgingsspørsmål for å sikre at du forstår brukerens situasjon og gir den beste veiledningen.`
  },
  [`Hvordan bestiller jeg en helsesjekk?`, `Du kan bestille en helsesjekk via din kommunale helsestasjon. Har du en fast lege?`],
  [`Hvor finner jeg informasjon om boligsparing?`, `Boligsparingstips finnes via Finansportalen. Har du sett de nyeste rådene der?`],
  [`Hvordan søker jeg om økonomisk støtte?`, `Økonomisk støtte søkes gjennom din kommune eller NAV. Har du dokumentasjon på din situasjon?`],
  [`Hva må jeg gjøre for å få utdanningsstøtte?`, `Utdanningsstøtte søkes via Lånekassen. Har du sjekket dine krav?`],
  [`Hvordan kontakter jeg kommunen for veiledning?`, `Du kan kontakte kommunen via deres digitale kontaktskjema. Har du tilgang til din kommuneportal?`]
];

ui.c.ImgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAC/CAMAAADEm+k5AAAAbFBMVEW6DC8AIFv///8AAVKhqLuyt8a4ACLWhpDRcH+4ACW+ID4AAE8ADVTCyNSEjKThp6/MYXC3AB0XLWT78/QAEVUAGFe2ABjKW2u1AAntyc7UgIt7haBTYISmrb5caInclqDPaXi9FjjCwc6GiqOU7OiQAAAB8ElEQVR4nO3b2UocARRF0bIzGo2tMZ3ZmOH//zGBDdGHEmy4DTZZ67moU+zX4i7LiNPLzZ23Zydrzi/uPbO9mhl+YnSIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE65Pg7vBzx4eO+HT7NDE9ZXs3Y7tnh85eh4SHLZt5jOjw1OkSH6BAdokN0iA7RITpEhyzPx918fb/aYfftZn5syvJs3nqGvyEOsDVleeCb/zc6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHbKczTt/YGt3gK0py4t5F+shdt8PsDXF/6zoEB2iQ3SIDtEhOkSH6BAdsryecXvvnY+6v/gxNDxkOR1xtf89zszwlKHrpuO/z5qhQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgOOf4Ob0b8vNxc//Nr927Nye+7R663Q8NT/gDnPeC7RJa1WQAAAABJRU5ErkJggg=='
cfg.app='HverdagsHjelpen';
