cfg.aiPromptWelcome=`Velkommen til RettighetsVakten.<br/><br/>
<i>Her får du hjelp til å sikre at du får dine rettigheter oppfylt. Informasjonen er veiledende – for detaljerte svar, kontakt den aktuelle instansen.</i><br/><br/>Hva lurer du på?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er en digital assistent som overvåker og informerer om dine rettigheter og viktige frister. Du gir konkrete og enkle råd slik at du får den hjelpen du har krav på.  
Still oppfølgingsspørsmål for å kartlegge brukerens situasjon.`
  },
  [`Når skal jeg fornye passet mitt?`, `Sjekk passets utløpsdato. Har du funnet ut hvor du skal fornye det?`],
  [`Hvordan søker jeg om sykepenger?`, `Sykepenger krever en sykmelding. Har du fått den fra legen?`],
  [`Hva er prosedyren for å klage på en offentlig beslutning?`, `Klager kan sendes via etatens nettside. Har du sjekket klagefristen?`],
  [`Hvordan oppdaterer jeg mine personopplysninger?`, `Dette gjøres via Folkeregisteret. Har du all nødvendig dokumentasjon?`],
  [`Hvilke rettigheter har jeg ved arbeidsledighet?`, `Arbeidsledige kan få dagpenger. Har du registrert deg hos NAV?`]
];

ui.c.ImgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAC/CAMAAADEm+k5AAAAbFBMVEW6DC8AIFv///8AAVKhqLuyt8a4ACLWhpDRcH+4ACW+ID4AAE8ADVTCyNSEjKThp6/MYXC3AB0XLWT78/QAEVUAGFe2ABjKW2u1AAntyc7UgIt7haBTYISmrb5caInclqDPaXi9FjjCwc6GiqOU7OiQAAAB8ElEQVR4nO3b2UocARRF0bIzGo2tMZ3ZmOH//zGBDdGHEmy4DTZZ67moU+zX4i7LiNPLzZ23Zydrzi/uPbO9mhl+YnSIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE65Pg7vBzx4eO+HT7NDE9ZXs3Y7tnh85eh4SHLZt5jOjw1OkSH6BAdokN0iA7RITpEhyzPx918fb/aYfftZn5syvJs3nqGvyEOsDVleeCb/zc6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHbKczTt/YGt3gK0py4t5F+shdt8PsDXF/6zoEB2iQ3SIDtEhOkSH6BAdsryecXvvnY+6v/gxNDxkOR1xtf89zszwlKHrpuO/z5qhQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgOOf4Ob0b8vNxc//Nr927Nye+7R663Q8NT/gDnPeC7RJa1WQAAAABJRU5ErkJggg=='
cfg.app='RettighetsVakten';
