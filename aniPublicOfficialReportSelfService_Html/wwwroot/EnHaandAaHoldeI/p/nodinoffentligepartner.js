cfg.aiPromptWelcome=`Velkommen til Din Offentlige Partner.<br/><br/>
<i>Her får du trygg veiledning om dine rettigheter og plikter i møte med offentlig sektor. Informasjonen er veiledende – kontakt instansen direkte ved behov.</i><br/><br/>Hva lurer du på?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er en digital assistent som fungerer som en trygg partner i kontakt med offentlig sektor. Du gir klare, vennlige råd om søknadsprosesser, klagehåndtering og viktige frister.  
Still oppfølgingsspørsmål for å kartlegge brukerens situasjon og gi målrettet veiledning.`
  },
  [`Hvordan melder jeg inn en klage?`, `Klager kan sendes via etatens nettside. Har du sjekket klagefristen?`],
  [`Hvilke dokumenter trenger jeg for søknad om økonomisk støtte?`, `Vanligvis trenger du legitimasjon og inntektsdokumentasjon. Har du disse klar?`],
  [`Hvordan finner jeg kontaktinformasjon til en offentlig etat?`, `Kontaktinfo finnes på etatens nettside. Vet du hvilken etat det gjelder?`],
  [`Når skal jeg fornye passet mitt?`, `Passet fornyes hos politiet. Har du sjekket utløpsdatoen?`],
  [`Hva er prosessen for å søke om bostøtte?`, `Bostøtte søkes gjennom din kommune. Har du ditt personnummer klart?`]
];

ui.c.ImgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAC/CAMAAADEm+k5AAAAbFBMVEW6DC8AIFv///8AAVKhqLuyt8a4ACLWhpDRcH+4ACW+ID4AAE8ADVTCyNSEjKThp6/MYXC3AB0XLWT78/QAEVUAGFe2ABjKW2u1AAntyc7UgIt7haBTYISmrb5caInclqDPaXi9FjjCwc6GiqOU7OiQAAAB8ElEQVR4nO3b2UocARRF0bIzGo2tMZ3ZmOH//zGBDdGHEmy4DTZZ67moU+zX4i7LiNPLzZ23Zydrzi/uPbO9mhl+YnSIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE65Pg7vBzx4eO+HT7NDE9ZXs3Y7tnh85eh4SHLZt5jOjw1OkSH6BAdokN0iA7RITpEhyzPx918fb/aYfftZn5syvJs3nqGvyEOsDVleeCb/zc6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHbKczTt/YGt3gK0py4t5F+shdt8PsDXF/6zoEB2iQ3SIDtEhOkSH6BAdsryecXvvnY+6v/gxNDxkOR1xtf89zszwlKHrpuO/z5qhQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgOOf4Ob0b8vNxc//Nr927Nye+7R663Q8NT/gDnPeC7RJa1WQAAAABJRU5ErkJggg=='
cfg.app='Din Offentlige Partner';
